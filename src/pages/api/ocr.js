import { processPDF, generateDataFiles } from "../../server/ocr-process";
import fs from 'fs';
import path from "path";
import formidable from "formidable";

export const config = {
    api: {
        bodyParser: false,
    },
};

const tempDir = path.join(process.cwd(), "src/temp");
const outputDir = path.join(process.cwd(), "public/output");

// Target DPI for image conversion
const targetDPI = 800;

// Handler for POST /api/ocr
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // create output directory if not exists
        if (!fs.existsSync(outputDir)) {
            await fs.promises.mkdir(outputDir, { recursive: true });
        }

        // create temp directory if not exists
        if (!fs.existsSync(tempDir)) {
            await fs.promises.mkdir(tempDir, { recursive: true });
        }
        // Use formidable to parse the incoming form data
        const form = formidable({ multiples: true, uploadDir: tempDir });

        // Parse the incoming form data
        form.parse(req, async (err, _, files) => {
            if (err) {
                console.error('Form parsing error:', err);
                return res.status(500).json({ message: 'Failed to parse form data.' });
            }
            if (!files.pdfFile || files.pdfFile.length === 0) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Process each uploaded PDF file
            const pdfFiles = Array.isArray(files.pdfFile) ? files.pdfFile : [files.pdfFile];
            const allResults = [];

            // Process each PDF file
            for (const file of pdfFiles) {
                 const pdfPath = file.filepath;
                const originalFilename = file.originalFilename; // Ambil nama file asli
                 const result = await processPDF(pdfPath, tempDir, outputDir, targetDPI, originalFilename);
                 allResults.push(result);


                //clean up temporary file
                await fs.promises.unlink(pdfPath);
            }

            // Generate CSV file
            const csvFileName = `output-${Date.now()}.csv`; // Generate unique filename for CSV
            await generateDataFiles(allResults, outputDir);

            // Send response
            res.status(200).json({
                message: 'PDFs processed successfully',
                data: allResults,
                csvFileName: csvFileName,
            });
        });

        // 
    } catch (error) {
        console.error('OCR processing error:', error);
        res.status(500).json({ message: 'Error processing PDF' });
    }
}