//src/server/controller/ocrController.js
import { processPDF, generateDataFiles, tempCutDir, tempHiDpiDir, tempRotateDir, tempCutResultDir, tempDir, outputDir, targetDPI } from "../ocr-process";
import fs from 'fs';
import path from "path";
import formidable from "formidable";

const ocrController = {
    processUpload: async (req, res) => {
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
                const uploadQueueFiles = pdfFiles.map((file, index) => ({
                    id: index,
                    file: {
                        name: file.originalFilename,
                    },
                    status: 'Waiting...'
                }));

                res.status(200).json({
                    message: 'Files received, processing started...',
                    uploadQueueFiles: uploadQueueFiles,
                 });

                for (const file of pdfFiles) {
                    const pdfPath = file.filepath;
                    const originalFilename = file.originalFilename;
                    const fileIndex = uploadQueueFiles.findIndex(queueFile => queueFile.file.name === originalFilename);

                    // Simulate uploading
                   await new Promise((resolve) => setTimeout(resolve, 500));
                    uploadQueueFiles[fileIndex].status = 'Uploading...';
                    // res.write(`data: ${JSON.stringify({uploadQueueFiles: uploadQueueFiles})}\n\n`);
                    // res.flush()

                    // Simulate scanning
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    uploadQueueFiles[fileIndex].status = 'Scanning...';
                   // res.write(`data: ${JSON.stringify({uploadQueueFiles: uploadQueueFiles})}\n\n`);
                   // res.flush()


                    try {
                         await processPDF(pdfPath, tempDir, outputDir, targetDPI, originalFilename);
                         uploadQueueFiles[fileIndex].status = 'Done';

                    }catch(e){
                         uploadQueueFiles[fileIndex].status = 'Failed';
                    }finally {
                        fs.promises.unlink(pdfPath); // clean up temporary pdf file
                    }
                // res.write(`data: ${JSON.stringify({uploadQueueFiles: uploadQueueFiles})}\n\n`);
                  //  res.flush()
                }
                  const csvFileName = `allData.csv`;
                  await generateDataFiles(uploadQueueFiles.map(item => item.file), outputDir);
                 res.write(`data: ${JSON.stringify({ uploadQueueFiles: uploadQueueFiles, csvFileName: csvFileName })}\n\n`);
                 res.end()
            });
        } catch (error) {
            console.error('OCR processing error:', error);
            res.status(500).json({ message: 'Error processing PDF' });
             res.end();
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