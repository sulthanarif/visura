//src/lib/ocr/server/controller/ocrController.js
import {
    processPDF,
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
import supabase from "@/utils/supabaseClient";
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

                  // Insert into ocr_results table
                    const { data, error } = await supabase
                      .from("ocr_results")
                      .insert([
                        {
                          projectId: projectId,
                          filename: result.filename,
                          title: result.title,
                          revision: result.revision,
                          drawingCode: result.drawingCode,
                          date: result.date,
                        },
                      ])
                      .select();

                  if (error) {
                    console.error("Error inserting ocr results:", error);
                    throw error;
                  }

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
          let finalCsvName = csvFileName && csvFileName.trim() !== ''
            ? csvFileName.trim()
            : 'allData';

            // Append ".csv" if not present
            if (!finalCsvName.toLowerCase().endsWith('.csv')) {
                finalCsvName += '.csv';
            }

            const now = new Date();
            const dateDay = now.getDate();
            const dateMonth = now.getMonth() + 1;
            const dateYear = now.getFullYear();


              try {
                    await fs.promises.mkdir(outputDir, { recursive: true }); // recursive: true agar membuat direktori parent jika belum ada
                } catch (error) {
                    if (error.code !== 'EEXIST') { // Abaikan error jika direktori sudah ada
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
                return `${index + 1},${drawingNumber},${drawingName},${drawingCode},A2,${drawingRevision}`;
            });

            csvContent += drawingDataRows.join('\n')
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
            Issued by: .....................,,,,,,,,,,`

        fs.writeFileSync(path.join(outputDir, finalCsvName), csvContent, { encoding: "utf-8" });

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
            const { data: filesData, error: filesError } = await supabase
              .from("ocr_results")
              .select("filename")
              .eq("projectId", projectId);
            if (filesError) throw filesError;
            const { error } = await supabase.from('ocr_results').delete().eq('projectId', projectId);
            if (error) throw error;

            const { error: projectError } = await supabase.from('projects').delete().eq('projectId', projectId);
            if (projectError) throw projectError;


            const fileNames = filesData?.map(item => item.filename);

            if (fileNames && fileNames.length > 0) {
             for( const fileName of fileNames) {
                  const pngFileName = path.parse(fileName).name;
                   const highDpiFileName = `${pngFileName}-high-dpi.png`
                   const rotatedFileName = `${pngFileName}-rotated.png`

                 const pngPath = path.join(tempDir,`${pngFileName}.png` );
                   const highDpiPath = path.join(tempHiDpiDir,highDpiFileName );
                const rotatePath = path.join(tempRotateDir, rotatedFileName);

                 try {
                       await fs.promises.unlink(pngPath);
                  }
                   catch (e) {
                    console.error(`Error cleaning up  ${pngFileName}.png`);
                  }
                 try {
                        await fs.promises.unlink(highDpiPath);
                  }
                    catch (e) {
                    console.error(`Error cleaning up  ${highDpiFileName}`);
                  }
                 try {
                        await fs.promises.unlink(rotatePath);
                  }
                   catch (e) {
                    console.error(`Error cleaning up  ${rotatedFileName}`);
                   }


                  const supabaseStoragePath = `png/ocr/original/${pngFileName}.png`
                  const supabaseStorageHiDpiPath = `png/ocr/hidpi/${highDpiFileName}`
                  const supabaseStorageRotatePath = `png/ocr/rotate/${rotatedFileName}`


                const { error: originalError } = await supabase
                    .storage
                    .from('ocr-storage')
                    .remove([supabaseStoragePath]);

                if (originalError) {
                     console.error(`Error deleting original image from storage:`, originalError);
                }
                 const { error: hidpiError } = await supabase
                    .storage
                    .from('ocr-storage')
                    .remove([supabaseStorageHiDpiPath]);

                  if (hidpiError) {
                     console.error(`Error deleting hidpi image from storage:`, hidpiError);
                   }

                const { error: rotateError } = await supabase
                    .storage
                    .from('ocr-storage')
                    .remove([supabaseStorageRotatePath]);

                 if (rotateError) {
                     console.error(`Error deleting rotate image from storage:`, rotateError);
                   }
                  }
             }



            return res.status(200).json({ message: "Cleanup completed successfully." });
        } catch (error) {
            console.error("Error during cleanup:", error);
            res.status(500).json({ message: "Cleanup failed.", error: error.message });
        }
    },
};

export default ocrController;