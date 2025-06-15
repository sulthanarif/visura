import { processPDF, tempDir, outputDir, targetDPI } from "../ocr-process";
import fs from "fs";
import { 
  uploadService, 
  storageService, 
  qrService, 
  transmittalService, 
  cleanupService 
} from "../services";

const ocrController = {
  handleFormData: uploadService.handleFormData,  processUpload: async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    try {
      const { pdfFiles, uploadQueueFiles } = await ocrController.handleFormData(req, res);
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
          
          // Upload PDF to storage first
          uploadQueueFiles[fileIndex].progress = 20;
          const pdfStorageUrl = await storageService.uploadPdf(pdfPath, originalFilename);
          
          if (!pdfStorageUrl) {
            console.error("Invalid pdfStorageUrl:", pdfStorageUrl);
            uploadQueueFiles[fileIndex].status = "Failed";
            await cleanupService.cleanupLocalProcessedFiles(pdfPath, result);
            continue;
          }

          uploadQueueFiles[fileIndex].progress = 40;
          
          // Process PDF with OCR
          result = await processPDF(
            pdfPath,
            tempDir,
            outputDir,
            targetDPI,
            originalFilename,
            pdfStorageUrl
          );
          
          uploadQueueFiles[fileIndex].progress = 60;
          
          // Store the URL in the result object
          result.pdfStorageUrl = pdfStorageUrl;
          
          // Handle QR code embedding and PDF modification
          const qrResult = await qrService.processQRCodeEmbedding(
            pdfPath, 
            pdfStorageUrl, 
            tempDir, 
            `${result.filename}-${Date.now()}`
          );
          
          result.modifiedPdf = qrResult.modifiedPdf;
          result.isEncrypted = qrResult.isEncrypted;

          // Upload modified PDF if it exists
          let pdf_url;
          if (result.modifiedPdf && fs.existsSync(result.modifiedPdf)) {
            const modifiedPdfBuffer = fs.readFileSync(result.modifiedPdf);
            pdf_url = await storageService.uploadModifiedPdf(modifiedPdfBuffer, originalFilename);
          } else {
            pdf_url = pdfStorageUrl;
          }

          // Upload all processed images
          const imagesToUpload = [
            result.images.original,
            result.images.hidpi,
            result.images.rotated,
            result.images.cropped,
            ...result.images.parts,
          ];

          const image_paths = await storageService.uploadImages(imagesToUpload);

          uploadQueueFiles[fileIndex].status = "Done";
          uploadQueueFiles[fileIndex].progress = 100;
          allResults.push(result);

          // Save OCR results to database
          await storageService.saveOcrResults(result, projectId, image_paths, pdf_url);

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
          
          // Cleanup all local files when processing fails
          await cleanupService.cleanupLocalProcessedFiles(pdfPath, result);
        } finally {
          // Clean up files after processing
          await cleanupService.cleanupAfterProcessing(pdfPath, result);
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
  },  generateTransmittal: async (req, res) => {
    try {
      const {
        transmittalData,
        projectName,
        documentName,
        transmittalNumber,
        csvFileName,
        isTemplate = false, // Default false to raw mode
      } = req.body;

      const result = await transmittalService.generateTransmittal({
        transmittalData,
        projectName,
        documentName,
        transmittalNumber,
        csvFileName,
        isTemplate
      });

      // Set headers for CSV file download
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${result.csvFileName}"`);
      
      // Return CSV content directly
      return res.status(200).send(result.csvContent);
    } catch (error) {
      console.error("Error generating transmittal:", error);
      res.status(500).json({
        message: "Error generating transmittal",
        error: error.message,
      });
    }
  },cleanup: async (req, res) => {
    const { projectId } = req.body;

    try {
      const result = await cleanupService.cleanupProject(projectId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error during cleanup:", error);
      return res.status(500).json({
        message: "Cleanup failed.",
        error: error.message,
      });
    }
  },
};

export default ocrController;