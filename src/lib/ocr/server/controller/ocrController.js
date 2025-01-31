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
// Di bagian atas controller
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
      const projectId = req.query.projectId;

      // Tambahkan validasi
      if (!projectId) {
        return res.status(400).json({
          message: "projectId is required",
        });
      }

      let allResults = [];
      for (const file of pdfFiles) {
          let result; // Declare result here
          const pdfPath = file.filepath;
          const originalFilename = file.originalFilename;
          const fileIndex = uploadQueueFiles.findIndex(
              (queueFile) => queueFile.file.name === originalFilename
            );
          try {
                // Generate nama file unik
                const sanitizedPdfName = originalFilename
                   .replace(/[^a-zA-Z0-9-_.]/g, "_")
                    .replace(/\s+/g, "_");
                    const pdfStoragePath = `pdf/${uuidv4()}-${sanitizedPdfName}`;
             const pdfFileBuffer = fs.readFileSync(pdfPath);

                  // Upload ke Supabase
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

                 console.log("Supabase PDF URL:", pdfStorageUrl);

                  if (!pdfStorageUrl || typeof pdfStorageUrl !== 'string' ) {
                      console.error("Invalid pdfStorageUrl:", pdfStorageUrl);
                       uploadQueueFiles[fileIndex].status = "Failed";
                       continue;
                 }


              result = await processPDF(
              pdfPath,
              tempDir,
                outputDir,
                targetDPI,
                originalFilename,
                 pdfStorageUrl // Add storageUrl here
            );

          const modifiedPdfBuffer = result.modifiedPdf ? fs.readFileSync(result.modifiedPdf) : null;

          if(modifiedPdfBuffer) {
             // Upload modified PDF to Supabase
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
                  result.pdf_url = supabase.storage.from("ocr-storage").getPublicUrl(modifiedPdfStoragePath).data.publicUrl;
            }  else {
                result.pdf_url = pdfStorageUrl
            }

              // Upload gambar ke Supabase
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
              parts: []
            }
            for (const imagePath of imagesToUpload) {
              let storagePath;
               const fileName = path.basename(imagePath);
            const fileBuffer = fs.readFileSync(imagePath);
            if (imagePath.startsWith(tempHiDpiDir)) {
              storagePath = `png/ocr/hidpi/${fileName}`;
            } else if (imagePath.startsWith(tempRotateDir)) {
              storagePath = `png/ocr/rotate/${fileName}`;
            } else if (imagePath.startsWith(tempCroppedDir)) {
                storagePath = `png/ocr/cuts/cropped/${fileName}`; // Corrected path
            }else if (imagePath.startsWith(tempCutDir)) {
                  storagePath = `png/ocr/cuts/part/${fileName}`;
              }  else if (imagePath.startsWith(tempDir)) {
                storagePath = `png/ocr/original/${fileName}`;
              }
             else {
                  console.error(`Unknown image path: ${imagePath}`);
                  continue;
              }
            // Validasi MIME type di sini
                const mimeType = await fileTypeFromBuffer(fileBuffer);
                if (!mimeType || mimeType.mime !== "image/png") {
                   console.error(`Invalid file type: ${storagePath}`);
                    continue; // Gunakan continue bukan return
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
                 console.error(`Upload gagal: ${storagePath}`, error)
                     continue;
                  }

                const imageUrl = supabase.storage.from("ocr-storage").getPublicUrl(storagePath).data.publicUrl;

                if (imagePath.startsWith(tempHiDpiDir)) {
                      image_paths.hidpi = imageUrl
                } else if (imagePath.startsWith(tempRotateDir)) {
                    image_paths.rotated = imageUrl
                } else if (imagePath.startsWith(tempCroppedDir)) {
                    image_paths.cropped = imageUrl;
                } else if (imagePath.startsWith(tempCutDir)) {
                      image_paths.parts.push(imageUrl);
                } else if (imagePath.startsWith(tempDir)) {
                   image_paths.original = imageUrl
                }
            }
                
            uploadQueueFiles[fileIndex].status = "Done";
            allResults.push(result);

            // Insert into ocr_results table
            const { data: insertData, error: insertError } = await supabase
             .from("ocr_results")
              .insert([
                {
                  projectId: projectId,
                  filename: result.filename,
                  title: result.title,
                  revision: result.revision,
                  drawingCode: result.drawingCode,
                  date: result.date,
                    image_paths: image_paths,
                   pdf_url: result.pdf_url,
                   isEncrypted: result.isEncrypted || false
                },
            ])
              .select();
            if (insertError) {
              console.error("Error inserting ocr results:", insertError);
               throw insertError;
            }


             if (result.isEncrypted) {
                // Update isEncrypted to true if QR embedding failed but OCR data is successful
                const { error: updateError } = await supabase
                   .from('ocr_results')
                   .update({ isEncrypted: true })
                   .eq('result_id', insertData[0].result_id);
               if (updateError) {
                  console.error("Error updating isEncrypted status:", updateError);
                }
             }
        }
          catch (e) {
              uploadQueueFiles[fileIndex].status = "Failed";
        }
          finally {
            try {
                await fs.promises.unlink(pdfPath);
            if(result && result.modifiedPdf){
                   await fs.promises.unlink(result.modifiedPdf);
            }

          } catch (e) {
                console.error("Error clean up file:", e);
            }
          }
       }
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
        } = req.body;

        // Pass csvFileName to the OCR or CSV generator
        let finalCsvName =
          csvFileName && csvFileName.trim() !== ""
            ? csvFileName.trim()
            : "allData";

        // Append ".csv" if not present
        if (!finalCsvName.toLowerCase().endsWith(".csv")) {
          finalCsvName += ".csv";
        }

        const now = new Date();
        const dateDay = now.getDate();
        const dateMonth = now.getMonth() + 1;
        const dateYear = now.getFullYear();

        try {
          await fs.promises.mkdir(outputDir, { recursive: true }); // recursive: true agar membuat direktori parent jika belum ada
        } catch (error) {
          if (error.code !== "EEXIST") {
            // Abaikan error jika direktori sudah ada
            console.error("Error creating output directory:", error);
            throw error;
          }
        }

        let csvContent = `TRANSMITTAL,,,,,,,,,,
              ,,,,,,,,,,
              No. Transmittal: ${transmittalNumber},,,,,,,,,,
              PROJECT: ,,,,,,,,,  Received :,${documentName}
              ${projectName},,,,,,,,,Date,${dateDay}
              ,,,,,,,,,Month,${dateMonth}
              PACKAGE :,,,,,,,,,Year,${dateYear}
              ,,,,,,,,,,
              No.,File Name,Drawing Name,Drawing Code,Format,Revision
              `;

        const drawingDataRows = transmittalData.map((item, index) => {
          const drawingNumber = item.filename;
          const drawingName = item.drawing || "";
          const drawingCode = item.drawingCode || "";
          const drawingRevision = item.revision;
          return `${
            index + 1
          },${drawingNumber},${drawingName},${drawingCode},A2,${drawingRevision}`;
        });

        csvContent += drawingDataRows.join("\n");
        csvContent += `
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
              ,,,,,,,,,,
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

        fs.writeFileSync(path.join(outputDir, finalCsvName), csvContent, {
          encoding: "utf-8",
        });

        return res.status(200).json({ csvFileName: finalCsvName });
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
      // Dapatkan data file dari database
      const { data: filesData, error: filesError } = await supabase
        .from("ocr_results")
        .select("filename, image_paths")
        .eq("projectId", projectId);

      if (filesError) throw filesError;

      // Hapus dari database
      const { error: deleteError } = await supabase
        .from("ocr_results")
        .delete()
        .eq("projectId", projectId);

      if (deleteError) throw deleteError;

      // Hapus dari storage
      if (filesData && filesData.length > 0) {
        const filesToDelete = filesData.flatMap((file) =>
          Object.values(file.image_paths).flat()
        );

        // Hapus semua file sekaligus
        const { error: storageError } = await supabase.storage
          .from("ocr-storage")
          .remove(filesToDelete);

        if (storageError) console.error("Storage cleanup error:", storageError);
      }

      // Hapus file lokal dengan error handling
      const cleanupLocalFile = async (filePath) => {
        try {
          await fs.promises.unlink(filePath);
        } catch (e) {
          if (e.code !== "ENOENT") {
            // Abaikan error jika file tidak ada
            console.error(
              `Error cleaning up ${path.basename(filePath)}:`,
              e.message
            );
          }
        }
      };

      // Hapus file temporary
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

export default ocrController;