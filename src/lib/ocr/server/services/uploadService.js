// src/lib/ocr/server/services/uploadService.js
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { tempDir } from "../ocr-process";

export const uploadService = {
  handleFormData: async (req, res) => {
    try {
      // Ensure temp directory exists
      if (!fs.existsSync(tempDir)) {
        await fs.promises.mkdir(tempDir, { recursive: true });
      }

      const form = formidable({ 
        multiples: true, 
        uploadDir: tempDir,
        maxFileSize: 10 * 1024 * 1024, // 10MB max file size
        filter: (part) => {
          return part.name === 'pdfFile' && 
                (part.mimetype === 'application/pdf' || 
                part.originalFilename.toLowerCase().endsWith('.pdf'));
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
      console.error("Error in upload service:", error);
      throw error;
    }
  },

  cleanupFile: async (filePath) => {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        console.log(`Successfully cleaned up file: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error cleaning up file ${filePath}:`, error);
    }
  }
};
