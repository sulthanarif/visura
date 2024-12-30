import { processPDF, generateDataFiles, tempCutDir, tempHiDpiDir, tempRotateDir, tempCutResultDir, tempDir, outputDir, targetDPI } from "../ocr-process";
import fs from 'fs';
import path from "path";
import formidable from "formidable";

const ocrController = {
      handleFormData: async (req, res) => {
        try {
            const directories = [outputDir, tempDir, tempCutDir, tempHiDpiDir, tempRotateDir, tempCutResultDir];

            for (const dir of directories) {
                if (!fs.existsSync(dir)) {
                    await fs.promises.mkdir(dir, { recursive: true });
                }
            }

            const form = formidable({ multiples: true, uploadDir: tempDir });
             return new Promise((resolve, reject) => {
                   form.parse(req, async (err, _, files) => {
                       if (err) {
                           console.error('Form parsing error:', err);
                            return reject(res.status(500).json({ message: 'Failed to parse form data.' }));
                       }
                       if (!files.pdfFile || files.pdfFile.length === 0) {
                           return reject(res.status(400).json({ message: 'No file uploaded' }));
                       }
                       const pdfFiles = Array.isArray(files.pdfFile) ? files.pdfFile : [files.pdfFile];
                          const uploadQueueFiles = pdfFiles.map((file, index) => ({
                                id: index,
                                file: {
                                    name: file.originalFilename,
                                },
                                status: 'Waiting...'
                            }));
                          resolve({
                             pdfFiles,
                              uploadQueueFiles
                          });

                   });
            });

        } catch (error) {
             console.error("Error creating output directory:", error);
            throw error
        }

      },
     processUpload: async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    
        try {
            const directories = [outputDir, tempDir, tempCutDir, tempHiDpiDir, tempRotateDir, tempCutResultDir];
    
            for (const dir of directories) {
                if (!fs.existsSync(dir)) {
                await fs.promises.mkdir(dir, { recursive: true });
                }
            }
    
            const form = formidable({ multiples: true, uploadDir: tempDir });
    
            form.parse(req, async (err, _, files) => {
                if (err) {
                    console.error('Form parsing error:', err);
                    return res.status(500).json({ message: 'Failed to parse form data.' });
                }
                if (!files.pdfFile || files.pdfFile.length === 0) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }
    
                const pdfFiles = Array.isArray(files.pdfFile) ? files.pdfFile : [files.pdfFile];
                const allResults = [];
    
    
                for (const file of pdfFiles) {
                     const pdfPath = file.filepath;
                    const originalFilename = file.originalFilename;
                     const result = await processPDF(pdfPath, tempDir, outputDir, targetDPI, originalFilename);
                     allResults.push(result);
    
                     await fs.promises.unlink(pdfPath); // clean up temporary pdf file
                }
    
                const csvFileName = `allData.csv`;
                await generateDataFiles(allResults, outputDir);
    
    
                // Send response
                res.status(200).json({
                    message: 'PDFs processed successfully',
                    data: allResults,
                    csvFileName: csvFileName,
                });
            });
    
        } catch (error) {
            console.error('OCR processing error:', error);
            res.status(500).json({ message: 'Error processing PDF' });
        }
    },
    generateTransmittal: async (req, res) => {
        try {
            const { transmittalData, projectName, documentName } = req.body;
            if (!transmittalData || transmittalData.length === 0) {
                return res.status(400).json({ message: "No transmittal data provided." });
            }
             let csvFileName;
            try {
                  csvFileName = await generateDataFiles(transmittalData, outputDir, projectName, documentName);
            }catch(e){
                console.error("Error generating transmittal:", e);
                 return res.status(500).json({ message: "Error generating transmittal", error: e.message });
            }

           res.status(200).json({ message: 'Transmittal generated successfully', csvFileName: csvFileName });

        } catch (error) {
            console.error("Error generating transmittal:", error);
           res.status(500).json({ message: "Error generating transmittal", error: error.message });
        }
    },
};

export default ocrController;