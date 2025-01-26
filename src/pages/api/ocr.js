import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import pdf2png from 'pdf2png';

const uploadDir = path.join(process.cwd(), 'src/temp/upload');
const tempCutDir = path.join(process.cwd(), 'src/temp/ocr/cut/part');
const tempHiDpiDir = path.join(process.cwd(), 'src/temp/ocr/hi-dpi');
const tempRotateDir = path.join(process.cwd(), 'src/temp/ocr/rotate');
const tempCutResultDir = path.join(process.cwd(), 'src/temp/ocr/cut');
const tempDir = path.join(process.cwd(), 'src/temp/ocr');
const outputDir = path.join(process.cwd(), 'public/output');
const targetDPI = 800;

export const config = {
    api: {
        bodyParser: false, // Disable Next.js body parsing
    },
};

async function pdfToPng(pdfPath, tempDir) {
    return new Promise((resolve, reject) => {
        pdf2png.convert(pdfPath, { returnFilePath: true, quality: 400 }, (resp) => {
            if (!resp.success) {
                console.error("Error converting PDF to PNG:", resp.error);
                return reject(resp.error);
            }
            const defaultPngPath = resp.data;
            const pdfFileName = path.parse(pdfPath).name; // Extract filename without extension
            const tempPngPath = path.join(tempDir, `${pdfFileName}.png`); // Use the same filename with .png extension

            console.log(defaultPngPath, pdfFileName, tempPngPath);

            var img = fs.readFileSync(resp.data);
    
            fs.writeFile(tempPngPath, img, function(err) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log(`PNG saved to temp: ${tempPngPath}`);
                    resolve(tempPngPath); // Resolve with path in temp
                }
            }); 
            
        });
    });
}

// Function to increase DPI
async function increaseDPI(inputPath, outputPath, dpi) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const scale = dpi / metadata.density;

    await image
        .resize(
            Math.round(metadata.width * scale),
            Math.round(metadata.height * scale),
            { fit: "contain" }
        )
        .toFile(outputPath);

    console.log(`[${inputPath}] DPI successfully increased to ${dpi}.`);
}

// Function to rotate image
async function rotateImage(inputPath, outputPath, angle) {
    await sharp(inputPath).rotate(angle).toFile(outputPath);
    console.log(`[${inputPath}] Image successfully rotated ${angle} degrees.`);
}

// Function to crop image 20% from the bottom right
async function cropBottomRight(inputPath, outputPath) {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const cropWidth = Math.round(metadata.width * 0.15);
    const cropHeight = Math.round(metadata.height * 0.26);

    await image
        .extract({
            left: metadata.width - cropWidth,
            top: metadata.height - cropHeight,
            width: cropWidth,
            height: cropHeight,
        })
        .toFile(outputPath);

    console.log(`[${inputPath}] Image successfully cropped 20% from the bottom right.`);
}

// Function to clean text
function cleanText(text) {
    return text.replace(/\n/g, ' ').trim();
}

// Function to correct revision OCR
function correctRevisionOCR(text) {
    const regex = /^(A|I|R|C|CO|CT|D|T)\d+$/; // Ensure at least one digit follows the letter
    const cleanedText = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    if (regex.test(cleanedText)) {
        return cleanedText; // Return valid text
    }

    const correctedText = cleanedText.replace(/O/g, '0');

    if (regex.test(correctedText)) {
        return correctedText; // Return corrected text
    }

    return null; // Return null if not valid
}

// Function to validate and format date
function validateAndFormatDate(text) {
    const dateRegex = /^\d{8}$/;
    const cleanedText = text.replace(/[^0-9]/g, '');

    if (dateRegex.test(cleanedText)) {
        return cleanedText.slice(0, 2) + cleanedText.slice(2, 4) + cleanedText.slice(4, 8);
    }
    return null; // Return null if date format is invalid
}

// Crop coordinates for OCR
const cropCoordinates = {
    title: { x: 400, y: 200, width: 1300, height: 400 },
    revision: { x: 850, y: 1600, width: 330, height: 220 },
    drawingCode: { x: 1170, y: 1500, width: 700, height: 300 },
    date: { x: 300, y: 1650, width: 700, height: 200 },
};

async function processPDF(pdfPath, tempDir, targetDPI, originalFilename) {
    try {
        const tempPngPath = await pdfToPng(pdfPath, tempDir); // Get path in temp

        const baseName = path.parse(tempPngPath).base;
        const timestamp = Date.now();
        // const outputBaseName = `${baseName}-${timestamp}`;
        const outputBaseName = `${baseName}`;
        const highDpiImagePath = path.join(tempHiDpiDir, `${outputBaseName}-high-dpi.png`);
        const rotatedImagePath = path.join(tempRotateDir, `${outputBaseName}-rotated.png`);
        const croppedImagePath = path.join(tempCutResultDir, `${outputBaseName}-cropped.png`);

        // console.log(outputBaseName);
        // console.log(highDpiImagePath);
        // return;

        const jsonData = {
            filename: originalFilename, // Save original filename here
            title: null,
            revision: null,
            drawingCode: null,
            date: null,
        };

        // Increase DPI
        await increaseDPI(tempPngPath, highDpiImagePath, targetDPI);

        // Rotate image 90 degrees
        await rotateImage(highDpiImagePath, rotatedImagePath, 90);

        // Crop 20% from the bottom right
        await cropBottomRight(rotatedImagePath, croppedImagePath);

        // Crop and OCR for each section
        for (const [key, coords] of Object.entries(cropCoordinates)) {
            const sectionImagePath = path.join(tempCutDir, `${outputBaseName}-${key}.png`);
            await sharp(croppedImagePath)
                .extract({
                    left: coords.x,
                    top: coords.y,
                    width: coords.width,
                    height: coords.height,
                })
                .toFile(sectionImagePath);

            const { data: { text } } = await Tesseract.recognize(sectionImagePath, "eng");
            // const { data: { text } } = await Tesseract.recognize(sectionImagePath, "eng", {
            //     logger: (m) => console.log(`[${outputBaseName}-${key}]`, m),
            // });
            switch (key) {
                case 'revision':
                    jsonData[key] = correctRevisionOCR(text.trim());
                    break;

                case 'date':
                    const formattedDate = validateAndFormatDate(text.trim());
                    if (jsonData['revision'] && formattedDate) {
                        jsonData['revision'] = `${jsonData['revision']}-${formattedDate}`;
                        jsonData['date'] = formattedDate;
                    }
                    break;

                default:
                    jsonData[key] = cleanText(text.trim()); // Save result without correction for other sections
                    break;
            }

            console.log(`[${outputBaseName}] Text ${key} successfully extracted.`);
            console.log(`[${outputBaseName}] OCR result ${key}: ${jsonData[key]}`);
            console.log(jsonData);
        }

        console.log(`[${outputBaseName}] Data processed successfully.`);
        return jsonData;
    } catch (err) {
        console.error(`[${pdfPath}] Error occurred:`, err);
        throw err;
    }
}

async function generateDataFiles(transmittalData, projectName, documentName, transmittalNumber, userCsvName) {
    let finalCsvName = userCsvName && userCsvName.trim() !== '' 
        ? userCsvName.trim() 
        : 'allData';  

    if (!finalCsvName.toLowerCase().endsWith('.csv')) {
        finalCsvName += '.csv';
    }

    const now = new Date();
    const dateDay = now.getDate();
    const dateMonth = now.getMonth() + 1;
    const dateYear = now.getFullYear();

    try {
        await fs.promises.mkdir(outputDir, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') {
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

    csvContent += drawingDataRows.join('\n');
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

    fs.writeFileSync(path.join(outputDir, finalCsvName), csvContent, { encoding: "utf-8" });
    return finalCsvName;
}


// API Route Handler
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = new IncomingForm();
        form.uploadDir = uploadDir; // Set the upload directory
        form.keepExtensions = true; // Keep file extensions

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing the files:', err);
                return res.status(500).json({ error: 'Failed to parse files.' });
            }

            console.log('Files object:', files); // Log the files object

            const uploadedFiles = files.pdfFile; // Adjust this based on your input name
            if (!uploadedFiles) {
                return res.status(400).json({ error: 'No files uploaded.' });
            }

            // Ensure uploadedFiles is an array
            const filesArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
            
            // Process each file
            const uploadPromises = filesArray.map(async (file) => {
                return new Promise(async (resolve, reject) => {
                    const oldPath = file.filepath; // Get the temporary file
                    const originalFilename = file.originalFilename; // Get the original filename

                    if (!originalFilename) {
                        return reject(new Error('Original filename is missing.'));
                    }

                    const newPath = path.join(uploadDir, originalFilename); // Use the original filename

                    // Rename the temporary file to original filename
                    fs.rename(oldPath, newPath, async (err) => {
                        if (err) {
                            console.error('Error renaming the file:', err);
                            return reject(new Error('Failed to rename the file.'));
                        }

                        try {
                            // Process the PDF
                            const result = await processPDF(newPath, tempDir, targetDPI, originalFilename);

                            // Generate the CSV file
                            const csvFileName = await generateDataFiles(
                                [result],
                                fields.projectName, // Assuming you have projectName in fields
                                fields.documentName, // Assuming you have documentName in fields
                                fields.transmittalNumber, // Assuming you have transmittalNumber in fields
                                fields.userCsvName // Assuming you have userCsvName in fields
                            );

                            resolve({ csvFileName, result });
                        } catch (error) {
                            console.error('Error in processing PDF:', error);
                            reject(new Error('Failed to process PDF.'));
                        }
                    });
                });
            });
            
            // Wait for all uploads to complete
            Promise.all(uploadPromises)
                .then(results => {
                    return res.status(200).json({
                        results,
                    });
                })
                .catch(error => {
                    console.error('Error during file upload:', error);
                    return res.status(500).json({ error: error.message });
                });
        });
    } else if (req.method === 'GET') {
        return res.status(200).json({ message: 'You are not supposed to be here.' });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
