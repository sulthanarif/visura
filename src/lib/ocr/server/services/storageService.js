// src/lib/ocr/server/services/storageService.js
import fs from "fs";
import path from "path";
import sharp from "sharp";
import supabase from "@/utils/supabaseClient";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import { 
  tempHiDpiDir, 
  tempRotateDir, 
  tempCroppedDir, 
  tempCutDir, 
  tempDir 
} from "../ocr-process";

export const storageService = {
 
  uploadPdf: async (pdfPath, originalFilename) => {
    try {
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
        console.error("Failed to upload PDF:", pdfError);
        throw new Error("Upload PDF failed");
      }
      
      const pdfStorageUrl = supabase.storage
        .from("ocr-storage")
        .getPublicUrl(pdfStoragePath).data.publicUrl;
      
      if (!pdfStorageUrl || typeof pdfStorageUrl !== "string") {
        throw new Error("Invalid PDF storage URL");
      }

      return pdfStorageUrl;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      throw error;
    }
  },

 
  uploadModifiedPdf: async (pdfBuffer, originalFilename) => {
    try {
      const sanitizedPdfName = originalFilename
        .replace(/[^a-zA-Z0-9-_.]/g, "_")
        .replace(/\s+/g, "_");

      const modifiedPdfStoragePath = `pdf/${uuidv4()}-modified-${sanitizedPdfName}`;
      
      const { error: modifiedPdfError } = await supabase.storage
        .from("ocr-storage")
        .upload(modifiedPdfStoragePath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (modifiedPdfError) {
        console.error("Failed to upload modified PDF:", modifiedPdfError);
        throw new Error("Failed to upload modified PDF");
      }

      return supabase.storage
        .from("ocr-storage")
        .getPublicUrl(modifiedPdfStoragePath).data.publicUrl;
    } catch (error) {
      console.error("Error uploading modified PDF:", error);
      throw error;
    }
  },
 
  compressImage: async (imageBuffer, imagePath) => {
    try {
      let compressionOptions = {
        quality: 80, // Default quality
        progressive: true,
        force: false
      };      // Different compression levels based on image type
      if (imagePath.includes('original')) {
        // Original images - moderate compression (keep quality for reference)
        compressionOptions.quality = 75;
      } else if (imagePath.includes('cropped')) {
        // Cropped images - higher compression (these are just for display)
        compressionOptions.quality = 70;
      } else if (imagePath.includes('part')) {
        // Part images (OCR sections) - lower compression to preserve text clarity
        compressionOptions.quality = 85;
      }

      // Get image metadata to determine optimal size
      const metadata = await sharp(imageBuffer).metadata();
      
      // Resize if image is too large (max 1920px width for storage efficiency)
      let processedImage = sharp(imageBuffer);
      
      if (metadata.width > 1920) {
        processedImage = processedImage.resize(1920, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Apply compression
      const compressedBuffer = await processedImage
        .png(compressionOptions)
        .toBuffer();

      const originalSize = imageBuffer.length;
      const compressedSize = compressedBuffer.length;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      console.log(`Image compressed: ${path.basename(imagePath)} - ${compressionRatio}% reduction (${(originalSize/1024).toFixed(1)}KB → ${(compressedSize/1024).toFixed(1)}KB)`);
      
      return compressedBuffer;
    } catch (error) {
      console.error("Error compressing image:", error);
      // Return original buffer if compression fails
      return imageBuffer;
    }
  },

   uploadImages: async (imagePaths) => {
    try {
      const image_paths = {
        original: null,
        hidpi: null, // Will remain null since we're not uploading hi-dpi
        rotated: null,
        cropped: null,
        parts: [],
      };

      const uploadedImages = [];      
      for (const imagePath of imagePaths) {
        // Skip hi-dpi images to save storage space
        if (imagePath.startsWith(tempHiDpiDir)) {
          console.log(`Skipping hi-dpi image upload: ${path.basename(imagePath)}`);
          // Clean up hi-dpi image locally since we're not uploading it
          try {
            await fs.promises.unlink(imagePath);
            console.log(`Deleted local hi-dpi image: ${imagePath}`);
          } catch (err) {
            console.error(`Error deleting hi-dpi image ${imagePath}:`, err);
          }
          continue;
        }

        // Skip rotated images to save storage space
        if (imagePath.startsWith(tempRotateDir)) {
          console.log(`Skipping rotated image upload: ${path.basename(imagePath)}`);
          // Clean up rotated image locally since we're not uploading it
          try {
            await fs.promises.unlink(imagePath);
            console.log(`Deleted local rotated image: ${imagePath}`);
          } catch (err) {
            console.error(`Error deleting rotated image ${imagePath}:`, err);
          }
          continue;
        }

        let storagePath;
        const fileName = path.basename(imagePath);
        const originalBuffer = fs.readFileSync(imagePath);
        
        // Determine storage path based on image type (only original, cropped, and parts)
        if (imagePath.startsWith(tempCroppedDir)) {
          storagePath = `png/ocr/cuts/cropped/${fileName}`;
        } else if (imagePath.startsWith(tempCutDir)) {
          storagePath = `png/ocr/cuts/part/${fileName}`;
        } else if (imagePath.startsWith(tempDir)) {
          storagePath = `png/ocr/original/${fileName}`;
        } else {
          console.error(`Unknown image path: ${imagePath}`);
          continue;
        }

        // Validate file type
        const mimeType = await fileTypeFromBuffer(originalBuffer);
        if (!mimeType || mimeType.mime !== "image/png") {
          console.error(`Invalid file type: ${storagePath}`);
          continue;
        }

        // Compress image before upload
        const compressedBuffer = await storageService.compressImage(originalBuffer, imagePath);

        // Ensure PNG extension
        if (!fileName.endsWith(".png")) {
          const newFileName = `${fileName}.png`;
          storagePath = storagePath.replace(fileName, newFileName);
        }

        // Upload compressed image to storage
        const { data: uploadData, error } = await supabase.storage
          .from("ocr-storage")
          .upload(storagePath, compressedBuffer, {
            contentType: "image/png",
            upsert: true,
          });

        if (error) {
          console.error(`Upload failed: ${storagePath}`, error);
          continue;
        }

        const imageUrl = supabase.storage
          .from("ocr-storage")
          .getPublicUrl(storagePath).data.publicUrl;        
          uploadedImages.push(imagePath);

        // Categorize image URLs (hi-dpi and rotated will remain null)
        if (imagePath.startsWith(tempCroppedDir)) {
          image_paths.cropped = imageUrl;
        } else if (imagePath.startsWith(tempCutDir)) {
          image_paths.parts.push(imageUrl);
        } else if (imagePath.startsWith(tempDir)) {
          image_paths.original = imageUrl;
        }
      }

      // Clean up local images after upload
      for (const imagePath of uploadedImages) {
        try {
          await fs.promises.unlink(imagePath);
          console.log(`Successfully deleted local image: ${imagePath}`);
        } catch (err) {
          console.error(`Error deleting local image ${imagePath}:`, err.message);
        }
      }

      return image_paths;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },


  saveOcrResults: async (result, projectId, image_paths, pdf_url) => {
    try {
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
          pdf_url: pdf_url,
          isEncrypted: result.isEncrypted || false,
        }])
        .select();

      if (insertError) {
        console.error("Error inserting OCR results:", insertError);
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

      return insertData;
    } catch (error) {
      console.error("Error saving OCR results:", error);
      throw error;
    }
  }
};
