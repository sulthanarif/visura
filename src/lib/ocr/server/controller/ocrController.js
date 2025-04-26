import {
  processPDF,
  tempCutDir,
  tempHiDpiDir,
  tempRotateDir,
  tempCutResultDir,
  tempDir,
  outputDir,
  targetDPI,
  tempCroppedDir,
} from "../ocr-process";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import supabase from "@/utils/supabaseClient";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";

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
        tempCroppedDir,
      ];

      for (const dir of directories) {
        if (!fs.existsSync(dir)) {
          await fs.promises.mkdir(dir, { recursive: true });
        }
      }

      const form = formidable({ 
        multiples: true, 
        uploadDir: tempDir,
        maxFileSize: 10 * 1024 * 1024, // 10MB max file size
        filter: (part) => {
          return part.name === 'pdfFile' && 
                (part.mimetype === 'application/pdf' || 
                part.originalFilename.toLowerCase().endswith('.pdf'));
        }
      });
      
      return new Promise((resolve, reject) => {
        form.parse(req, async (err, _, files) => {
          if (err) {
            console.error("Form parsing error:", err);
            let errorMessage = "Failed to parse form data.";
            
            // Customize error message based on error type
            if (err.code === 'LIMIT_FILE_SIZE') {
              errorMessage = "File size exceeds the 10MB limit.";
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
              errorMessage = "Invalid file type. Only PDF files are allowed.";
            }
            
            return reject(
              res.status(400).json({ message: errorMessage })
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
            
          // Validate file types more carefully
          for (const file of pdfFiles) {
            const fileExtension = path.extname(file.originalFilename).toLowerCase();
            
            if (fileExtension !== '.pdf') {
              return reject(
                res.status(400).json({ 
                  message: `Invalid file type: ${file.originalFilename}. Only PDF files are allowed.` 
                })
              );
            }
            
            if (file.size > 10 * 1024 * 1024) {
              return reject(
                res.status(400).json({ 
                  message: `File too large: ${file.originalFilename}. Maximum file size is 10MB.` 
                })
              );
            }
          }
          
          const uploadQueueFiles = pdfFiles.map((file, index) => ({
            id: index,
            file: {
              name: file.originalFilename,
              size: file.size
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
      const projectId = req.query.projectId;

      if (!projectId) {
        return res.status(400).json({
          message: "projectId is required",
        });
      }

      let allResults = [];
      for (const file of pdfFiles) {
        let result;
        const pdfPath = file.filepath;
        const originalFilename = file.originalFilename;
        const fileIndex = uploadQueueFiles.findIndex(
          (queueFile) => queueFile.file.name === originalFilename
        );
        
        try {
          // Update status to processing
          uploadQueueFiles[fileIndex].status = "Processing...";
          uploadQueueFiles[fileIndex].progress = 5;
          
          const sanitizedPdfName = originalFilename
            .replace(/[^a-zA-Z0-9-_.]/g, "_")
            .replace(/\s+/g, "_");
          const pdfStoragePath = `pdf/${uuidv4()}-${sanitizedPdfName}`;
          const pdfFileBuffer = fs.readFileSync(pdfPath);

          const { data: pdfUploadData, error: pdfError } = await supabase.storage
            .from("ocr-storage")
            .upload(pdfStoragePath, pdfFileBuffer, {
              contentType: "application/pdf",
              upsert: true,
            });

          if (pdfError) {
            console.error("Gagal upload PDF:", pdfError);
            throw new Error("Upload PDF gagal");
          }
          const pdfStorageUrl = supabase.storage
            .from("ocr-storage")
            .getPublicUrl(pdfStoragePath).data.publicUrl;
          if (!pdfStorageUrl || typeof pdfStorageUrl !== "string") {
            console.error("Invalid pdfStorageUrl:", pdfStorageUrl);
            uploadQueueFiles[fileIndex].status = "Failed";
            continue;
          }

          // Update progress as we go through each step
          uploadQueueFiles[fileIndex].progress = 20;
          
          result = await processPDF(
            pdfPath,
            tempDir,
            outputDir,
            targetDPI,
            originalFilename,
            pdfStorageUrl
          );
          
          uploadQueueFiles[fileIndex].progress = 60;
          
          const modifiedPdfBuffer = result.modifiedPdf
            ? fs.readFileSync(result.modifiedPdf)
            : null;

          if (modifiedPdfBuffer) {
            const modifiedPdfStoragePath = `pdf/${uuidv4()}-modified-${sanitizedPdfName}`;
            const { error: modifiedPdfError } = await supabase.storage
              .from("ocr-storage")
              .upload(modifiedPdfStoragePath, modifiedPdfBuffer, {
                contentType: "application/pdf",
                upsert: true,
              });

            if (modifiedPdfError) {
              console.error("Failed to upload modified PDF:", modifiedPdfError);
              throw new Error("Failed to upload modified PDF");
            }
            result.pdf_url = supabase.storage
              .from("ocr-storage")
              .getPublicUrl(modifiedPdfStoragePath).data.publicUrl;
          } else {
            result.pdf_url = pdfStorageUrl;
          }

          const imagesToUpload = [
            result.images.original,
            result.images.hidpi,
            result.images.rotated,
            result.images.cropped,
            ...result.images.parts,
          ];

          const image_paths = {
            original: null,
            hidpi: null,
            rotated: null,
            cropped: null,
            parts: [],
          };

          const uploadedImages = [];

          for (const imagePath of imagesToUpload) {
            let storagePath;
            const fileName = path.basename(imagePath);
            const fileBuffer = fs.readFileSync(imagePath);
            if (imagePath.startsWith(tempHiDpiDir)) {
              storagePath = `png/ocr/hidpi/${fileName}`;
            } else if (imagePath.startsWith(tempRotateDir)) {
              storagePath = `png/ocr/rotate/${fileName}`;
            } else if (imagePath.startsWith(tempCroppedDir)) {
              storagePath = `png/ocr/cuts/cropped/${fileName}`;
            } else if (imagePath.startsWith(tempCutDir)) {
              storagePath = `png/ocr/cuts/part/${fileName}`;
            } else if (imagePath.startsWith(tempDir)) {
              storagePath = `png/ocr/original/${fileName}`;
            } else {
              console.error(`Unknown image path: ${imagePath}`);
              continue;
            }

            const mimeType = await fileTypeFromBuffer(fileBuffer);
            if (!mimeType || mimeType.mime !== "image/png") {
              console.error(`Invalid file type: ${storagePath}`);
              continue;
            }

            if (!fileName.endsWith(".png")) {
              const newFileName = `${fileName}.png`;
              storagePath = storagePath.replace(fileName, newFileName);
            }
            const { data: uploadData, error } = await supabase.storage
              .from("ocr-storage")
              .upload(storagePath, fileBuffer, {
                contentType: "image/png",
                upsert: true,
              });
            if (error) {
              console.error(`Upload gagal: ${storagePath}`, error);
              continue;
            }

            const imageUrl = supabase.storage
              .from("ocr-storage")
              .getPublicUrl(storagePath).data.publicUrl;

            uploadedImages.push(imagePath);

            if (imagePath.startsWith(tempHiDpiDir)) {
              image_paths.hidpi = imageUrl;
            } else if (imagePath.startsWith(tempRotateDir)) {
              image_paths.rotated = imageUrl;
            } else if (imagePath.startsWith(tempCroppedDir)) {
              image_paths.cropped = imageUrl;
            } else if (imagePath.startsWith(tempCutDir)) {
              image_paths.parts.push(imageUrl);
            } else if (imagePath.startsWith(tempDir)) {
              image_paths.original = imageUrl;
            }
          }

          for (const imagePath of uploadedImages) {
            try {
              await fs.promises.unlink(imagePath);
              console.log(`Successfully deleted local image: ${imagePath}`);
            } catch (err) {
              console.error(
                `Error deleting local image ${imagePath}:`,
                err.message
              );
            }
          }

          uploadQueueFiles[fileIndex].status = "Done";
          uploadQueueFiles[fileIndex].progress = 100;
          allResults.push(result);

          const { data: insertData, error: insertError } = await supabase
            .from("ocr_results")
            .insert([{
                projectId: projectId,
                filename: result.filename,
                title: result.title,
                revision: result.revision,
                drawingCode: result.drawingCode,
                date: result.date,
                image_paths: image_paths,
                pdf_url: result.pdf_url,
                isEncrypted: result.isEncrypted || false,
              },
            ])
            .select();
          if (insertError) {
            console.error("Error inserting ocr results:", insertError);
            throw insertError;
          }

          if (result.isEncrypted) {
            const { error: updateError } = await supabase
              .from("ocr_results")
              .update({ isEncrypted: true })
              .eq("result_id", insertData[0].result_id);
            if (updateError) {
              console.error("Error updating isEncrypted status:", updateError);
            }
          }
        } catch (e) {
          console.error(`Error processing file ${originalFilename}:`, e);
          uploadQueueFiles[fileIndex].status = "Failed";
          
          // Set appropriate error message based on error type
          if (e.message.includes("extract_area") || e.message.includes("bad extract area")) {
            uploadQueueFiles[fileIndex].error = "Failed to analyze document structure. The PDF may be encrypted, damaged, or in an unsupported format.";
          } else if (e.message.includes("sharp")) {
            uploadQueueFiles[fileIndex].error = "Image processing failed. The document might be corrupted or in an unsupported format.";
          } else if (e.message.includes("Tesseract")) {
            uploadQueueFiles[fileIndex].error = "Text recognition failed. The document may have poor quality or unrecognizable text.";
          } else if (e.message.includes("load") || e.message.includes("decrypt")) {
            uploadQueueFiles[fileIndex].error = "This PDF is password-protected or encrypted. Please remove security restrictions and try again.";
          } else if (e.message.includes("size") || e.message.includes("large")) {
            uploadQueueFiles[fileIndex].error = "File size exceeds processing limits. Please try a smaller file.";
          } else {
            uploadQueueFiles[fileIndex].error = e.message || "Processing failed with an unknown error";
          }
        } finally {
          try {
            await fs.promises.unlink(pdfPath);
            if (result && result.modifiedPdf) {
              await fs.promises.unlink(result.modifiedPdf);
            }
          } catch (e) {
            console.error("Error clean up file:", e);
          }
        }
      }

      // Sort the upload queue to place failed items at the top
      uploadQueueFiles.sort((a, b) => {
        if (a.status === "Failed" && b.status !== "Failed") return -1;
        if (a.status !== "Failed" && b.status === "Failed") return 1;
        return 0;
      });

      res.status(200).json({
        message: "Files processed successfully",
        uploadQueueFiles: uploadQueueFiles,
        data: allResults,
      });
    } catch (error) {
      console.error("OCR Processing Error:", error);
      return res.status(500).json({
        message: "Error processing files",
        error: error.message,
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
        isTemplate = false, // Default false to raw mode
      } = req.body;

      if (!transmittalData || !projectName || !documentName || !transmittalNumber || !csvFileName) {
        return res.status(400).json({ message: "Missing required fields for transmittal generation." });
      }

      // Process the filename - always add -raw suffix for non-template mode
      let finalCsvName = csvFileName.trim() || "allData";
      if (!isTemplate) {
        const baseName = finalCsvName.toLowerCase().endsWith('.csv')
          ? finalCsvName.slice(0, -4)
          : finalCsvName;
        if (!baseName.toLowerCase().endsWith('-raw')) {
          finalCsvName = baseName + "-raw";
        }
      }

      // Ensure .csv extension
      if (!finalCsvName.toLowerCase().endsWith(".csv")) {
        finalCsvName += ".csv";
      }
      finalCsvName = finalCsvName.replace(/[^a-zA-Z0-9-_.]/g, "_"); // Sanitize filename

      try {
        await fs.promises.mkdir(outputDir, { recursive: true });
      } catch (error) {
        if (error.code !== "EEXIST") {
          console.error("Error creating output directory:", error);
          throw error;
        }
      }

      const drawingDataRows = transmittalData.map((item, index) => {
        const drawingNumber = item.filename;
        const title = item.title || "";
        const drawingCode = item.drawingCode || "";
        const drawingRevision = item.revision;
        return `${index + 1},${drawingNumber},${title},${drawingCode},A2,${drawingRevision}`;
      }).join("\n");

      // Generate content based on isTemplate
      const csvContent = isTemplate
        ? generateTemplateContent(drawingDataRows, projectName, documentName, transmittalNumber)
        : drawingDataRows;

      fs.writeFileSync(path.join(outputDir, finalCsvName), csvContent, {
        encoding: "utf-8",
      });

      return res.status(200).json({
        message: "Transmittal generated successfully.",
        csvFileName: finalCsvName,
        isTemplate,
      });
    } catch (error) {
      console.error("Error generating transmittal:", error);
      res.status(500).json({
        message: "Error generating transmittal",
        error: error.message,
      });
    }
  },
  cleanup: async (req, res) => {
    const { projectId } = req.body;

    try {
      const { data: filesData, error: filesError } = await supabase
        .from("ocr_results")
        .select("filename, image_paths")
        .eq("projectId", projectId);

      if (filesError) throw filesError;

      const { error: deleteError } = await supabase
        .from("ocr_results")
        .delete()
        .eq("projectId", projectId);

      if (deleteError) throw deleteError;

      if (filesData && filesData.length > 0) {
        const filesToDelete = filesData.flatMap((file) =>
          Object.values(file.image_paths).flat()
        );

        const { error: storageError } = await supabase.storage
          .from("ocr-storage")
          .remove(filesToDelete);

        if (storageError) console.error("Storage cleanup error:", storageError);
      }

      const cleanupLocalFile = async (filePath) => {
        try {
          await fs.promises.unlink(filePath);
        } catch (e) {
          if (e.code !== "ENOENT") {
            console.error(
              `Error cleaning up ${path.basename(filePath)}:`,
              e.message
            );
          }
        }
      };

      await Promise.all([
        ...fs
          .readdirSync(tempDir)
          .map((f) => cleanupLocalFile(path.join(tempDir, f))),
        ...fs
          .readdirSync(tempHiDpiDir)
          .map((f) => cleanupLocalFile(path.join(tempHiDpiDir, f))),
        ...fs
          .readdirSync(tempRotateDir)
          .map((f) => cleanupLocalFile(path.join(tempRotateDir, f))),
        ...fs
          .readdirSync(tempCutResultDir)
          .map((f) => cleanupLocalFile(path.join(tempCutResultDir, f))),
        ...fs
          .readdirSync(tempCroppedDir)
          .map((f) => cleanupLocalFile(path.join(tempCroppedDir, f))),
        ...fs
          .readdirSync(tempCutDir)
          .map((f) => cleanupLocalFile(path.join(tempCutDir, f))),
      ]);

      return res
        .status(200)
        .json({ message: "Cleanup completed successfully." });
    } catch (error) {
      console.error("Error during cleanup:", error);
      return res.status(500).json({
        message: "Cleanup failed.",
        error: error.message,
      });
    }
  },
};

function generateTemplateContent(drawingDataRows, projectName, documentName, transmittalNumber) {
  const now = new Date();
  const D = now.getDate();
  const M = now.getMonth() + 1;
  const Y = now.getFullYear();
  
  return `TRANSMITTAL,,,,,,,,,,
,,,,,,,,,,
No. Transmittal: ${transmittalNumber},,,,,,,,,,
PROJECT: ,,,,,,,,,  Received :,${documentName}
${projectName},,,,,,,,,Date,${D}
,,,,,,,,,Month,${M}
PACKAGE :,,,,,,,,,Year,${Y}
,,,,,,,,,,
No.,File Name,Drawing Name,Drawing Code,Format,Revision
${drawingDataRows}
,,,,,,,,,,
Prepared by:,,,,,,,,,,Checked by:
,,,,,,,,,,
,,,,,,,,,,
Distributed to :,,,,,,,,,,Copies to :
,,,,,,,,,,
1,,,,,,,,,,
2,,,,,,,,,,
3,,,,,,,,,,
,,,,,,,,,,
Legends,,,,,,,,,,Reason for Issue
,A   ,:   Approval,,,,,I, : Information,,
,C   ,:   Copy,,,,,R, : Revision,,
,CO ,:   Construction,,,,,Ct, : Contract,,
,D    ,:   Disk,,,,,T, : Tender,,
Issued by: .....................,,,,,,,,,,`;
}

export default ocrController;