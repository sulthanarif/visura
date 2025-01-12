import {
  processPDF,
  generateDataFiles,
  tempCutDir,
  tempHiDpiDir,
  tempRotateDir,
  tempCutResultDir,
  tempDir,
  outputDir,
  targetDPI,
} from "../ocr-process";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import e from "cors";

const ocrController = {
  handleFormData: async (req, res) => {
    try {
      const directories = [
        outputDir,
        tempDir,
        tempCutDir,
        tempHiDpiDir,
        tempRotateDir,
        tempCutResultDir,
      ];

      for (const dir of directories) {
        if (!fs.existsSync(dir)) {
          await fs.promises.mkdir(dir, { recursive: true });
        }
      }

      const form = formidable({ multiples: true, uploadDir: tempDir });
      return new Promise((resolve, reject) => {
        form.parse(req, async (err, _, files) => {
          if (err) {
            console.error("Form parsing error:", err);
            return reject(
              res.status(500).json({ message: "Failed to parse form data." })
            );
          }
          if (!files.pdfFile || files.pdfFile.length === 0) {
            return reject(
              res.status(400).json({ message: "No file uploaded" })
            );
          }
          const pdfFiles = Array.isArray(files.pdfFile)
            ? files.pdfFile
            : [files.pdfFile];
          const uploadQueueFiles = pdfFiles.map((file, index) => ({
            id: index,
            file: {
              name: file.originalFilename,
            },
            status: "Waiting...",
          }));
          resolve({
            pdfFiles,
            uploadQueueFiles,
          });
        });
      });
    } catch (error) {
      console.error("Error creating output directory:", error);
      throw error;
    }
  },
  processUpload: async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const { pdfFiles, uploadQueueFiles } = await ocrController.handleFormData(
        req,
        res
      );

      let allResults = [];
      for (const file of pdfFiles) {
        const pdfPath = file.filepath;
        const originalFilename = file.originalFilename;
        const fileIndex = uploadQueueFiles.findIndex(
          (queueFile) => queueFile.file.name === originalFilename
        );
        try {
          // Simulate uploading
          await new Promise((resolve) => setTimeout(resolve, 500));
          uploadQueueFiles[fileIndex].status = "Uploading...";

          // Simulate scanning
          await new Promise((resolve) => setTimeout(resolve, 500));
          uploadQueueFiles[fileIndex].status = "Scanning...";

          const result = await processPDF(
            pdfPath,
            tempDir,
            outputDir,
            targetDPI,
            originalFilename
          );
          uploadQueueFiles[fileIndex].status = "Done";
          allResults.push(result);
        } catch (e) {
          uploadQueueFiles[fileIndex].status = "Failed";
        } finally {
          try {
            await fs.promises.unlink(pdfPath);
          } catch (e) {
            console.error("Error clean up file:", e);
          }
        }
      }
      const csvFileName = `allData.csv`;
      await generateDataFiles(allResults, outputDir);

      res.status(200).json({
        message: "Files processed successfully",
        uploadQueueFiles: uploadQueueFiles,
        data: allResults,
        csvFileName: csvFileName,
      });
    } catch (error) {
      console.error("OCR Processing Error:", error);
      return res.status(500).json({
        message: "Error processing files", error: error.message,
      });
    }
  },
  generateTransmittal: async (req, res) => {
    try {
      const {
        transmittalData,
        projectName,
        documentName,
        transmittalNumber,
        csvFileName,
      } = req.body;

      // Pass csvFileName to the OCR or CSV generator
      const generatedFileName = await generateDataFiles(
        transmittalData,
        projectName,
        documentName,
        transmittalNumber,
        csvFileName
      );

      return res.status(200).json({ csvFileName: generatedFileName });
    } catch (error) {
      console.error("Error generating transmittal:", error);
      res
        .status(500)
        .json({
          message: "Error generating transmittal",
          error: error.message,
        });
    }
  },
};

export default ocrController;
