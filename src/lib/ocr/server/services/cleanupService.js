// src/lib/ocr/server/services/cleanupService.js
import fs from "fs";
import path from "path";
import supabase from "@/utils/supabaseClient";
import { 
  tempDir, 
  tempCutDir, 
  tempHiDpiDir, 
  tempRotateDir, 
  tempCutResultDir, 
  tempCroppedDir 
} from "../ocr-process";

export const cleanupService = {

  cleanupLocalProcessedFiles: async (pdfPath, result) => {
    try {
      // Clean up any processed images if they exist
      if (result && result.images) {
        const allImagePaths = [
          result.images.original,
          result.images.hidpi,
          result.images.rotated,
          result.images.cropped,
          ...(result.images.parts || []),
        ].filter(Boolean);

        // Delete all images
        for (const imagePath of allImagePaths) {
          if (imagePath && fs.existsSync(imagePath)) {
            await fs.promises.unlink(imagePath);
            console.log(`Cleaned up failed processing image: ${imagePath}`);
          }
        }
      }

      // Clean up any temporary files in the temp directories
      const cleanupDirectory = async (dir) => {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          
          for (const file of files) {
            const filePath = path.join(dir, file);
            
            try {
              // Get file stats to check if it's a directory
              const stats = fs.statSync(filePath);
              
              if (stats.isFile()) {
                // Remove file
                await fs.promises.unlink(filePath);
              }
            } catch (err) {
              console.error(`Error cleaning up file ${filePath}:`, err);
            }
          }
        }
      };
      
      // Clean up all the temp directories
      await Promise.all([
        cleanupDirectory(tempDir),
        cleanupDirectory(tempCutDir),
        cleanupDirectory(tempHiDpiDir),
        cleanupDirectory(tempRotateDir),
        cleanupDirectory(tempCutResultDir),
        cleanupDirectory(tempCroppedDir),
      ]);
      
    } catch (error) {
      console.error("Error during cleanup of failed processing:", error);
    }
  },

 
  cleanupLocalFile: async (filePath) => {
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
  },

 
  cleanupProject: async (projectId) => {
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

      // Clean up local temporary files
      await Promise.all([
        ...fs
          .readdirSync(tempDir)
          .map((f) => cleanupService.cleanupLocalFile(path.join(tempDir, f))),
        ...fs
          .readdirSync(tempHiDpiDir)
          .map((f) => cleanupService.cleanupLocalFile(path.join(tempHiDpiDir, f))),
        ...fs
          .readdirSync(tempRotateDir)
          .map((f) => cleanupService.cleanupLocalFile(path.join(tempRotateDir, f))),
        ...fs
          .readdirSync(tempCutResultDir)
          .map((f) => cleanupService.cleanupLocalFile(path.join(tempCutResultDir, f))),
        ...fs
          .readdirSync(tempCroppedDir)
          .map((f) => cleanupService.cleanupLocalFile(path.join(tempCroppedDir, f))),
        ...fs
          .readdirSync(tempCutDir)
          .map((f) => cleanupService.cleanupLocalFile(path.join(tempCutDir, f))),
      ]);

      return { message: "Cleanup completed successfully." };
    } catch (error) {
      console.error("Error during cleanup:", error);
      throw new Error(`Cleanup failed: ${error.message}`);
    }
  },


  cleanupAfterProcessing: async (pdfPath, result) => {
    try {
      // Delete original PDF file if it exists
      if (fs.existsSync(pdfPath)) {
        await fs.promises.unlink(pdfPath);
        console.log(`Successfully deleted original PDF: ${pdfPath}`);
      }
      
      // Delete modified PDF if it exists
      if (result && result.modifiedPdf && fs.existsSync(result.modifiedPdf)) {
        await fs.promises.unlink(result.modifiedPdf);
        console.log(`Successfully deleted modified PDF: ${result.modifiedPdf}`);
      }
    } catch (e) {
      console.error("Error cleaning up file:", e);
    }
  }
};
