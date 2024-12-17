const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const pdf2png = require("pdf2png");

// Fungsi untuk convert PDF ke PNG
async function pdfToPng(pdfPath, outputDir) {
    return new Promise((resolve, reject) => {
        // Menambahkan opsi quality untuk meningkatkan kualitas konversi
        pdf2png.convert(pdfPath, { returnFilePath: true, quality: 400 }, function (resp) {
            if (!resp.success) {
                console.error("Error converting PDF to PNG:", resp.error);
                reject(resp.error);
                return;
            }

            console.log(`PDF berhasil dikonversi ke PNG: ${resp.data}`);
            resolve(resp.data);
        });
    });
}

// Fungsi untuk meningkatkan DPI
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

    console.log(`[${inputPath}] DPI berhasil ditingkatkan menjadi ${dpi}.`);
}

// Fungsi untuk rotate image
async function rotateImage(inputPath, outputPath, angle) {
    await sharp(inputPath).rotate(angle).toFile(outputPath);
    console.log(`[${inputPath}] Gambar berhasil di-rotate ${angle} derajat.`);
}

// Fungsi untuk crop image 20% di pojok kanan bawah
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

    console.log(`[${inputPath}] Gambar berhasil di-crop 20% di pojok kanan bawah.`);
}

// Fungsi untuk mengoreksi hasil OCR khusus bagian title
function cleanText(text) {
    return text.replace(/\n/g, ' ').trim();
}

// Fungsi untuk mengoreksi hasil OCR khusus bagian revision
function correctRevisionOCR(text) {
    // Regex untuk mencocokkan format yang valid, dimulai dari huruf kapital diikuti minimal satu angka
    const regex = /^(A|I|R|C|CO|CT|D|T)\d+$/; // Memastikan ada minimal satu angka setelah huruf

    // Menghapus karakter non-alfanumerik dan mengubah ke huruf kapital
    const cleanedText = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    // Memeriksa apakah teks yang dibersihkan sesuai dengan regex
    if (regex.test(cleanedText)) {
        return cleanedText; // Mengembalikan teks yang sesuai
    }

    // Jika tidak sesuai, coba koreksi dengan mengganti huruf O dengan angka 0
    const correctedText = cleanedText.replace(/O/g, '0');

    if (regex.test(correctedText)) {
        return correctedText; // Mengembalikan teks yang dikoreksi
    }

    return null; // Kembalikan null jika tidak sesuai
}

// Fungsi untuk memvalidasi dan memformat tanggal
function validateAndFormatDate(text) {
    // Regex untuk format tanggal yang diharapkan (DDMMYYYY)
    const dateRegex = /^\d{8}$/;

    const cleanedText = text.replace(/[^0-9]/g, '');

    if (dateRegex.test(cleanedText)) {
        // Mengembalikan tanggal yang sudah diformat jika valid
        return cleanedText.slice(0, 2) + cleanedText.slice(2, 4) + cleanedText.slice(4, 8);
    }
    return null; // Mengembalikan null jika format tanggal tidak valid
}

// Fungsi untuk generate nomor transmittal
function generateTransmittalNumber() {
    return `[]`;
}

// Koordinat crop untuk OCR
const cropCoordinates = {
    title: { x: 400, y: 200, width: 1300, height: 400 },
    revision: { x: 850, y: 1600, width: 330, height: 220 },
    drawingCode: { x: 1170, y: 1500, width: 700, height: 300 },
    date: { x: 300, y: 1650, width: 700, height: 200 },
};

async function processPDF(pdfPath, tempDir, outputDir, targetDPI, originalFilename) {
    try {
        // 1. Convert PDF ke PNG
        const pngPath = await pdfToPng(pdfPath, tempDir);

        const baseName = path.parse(pngPath).name;
         const cutDir = path.join(tempDir, "cut");
        if (!fs.existsSync(cutDir)) {
             await fs.promises.mkdir(cutDir, { recursive: true });
        }
        const highDpiImagePath = path.join(cutDir, `${baseName}-high-dpi.png`);
        const rotatedImagePath = path.join(cutDir, `${baseName}-rotated.png`);
        const croppedImagePath = path.join(cutDir, `${baseName}-cropped.png`);

        const jsonData = {
           filename: originalFilename, // Menggunakan nama file asli
            title: null,
            revision: null,
            drawingCode: null,
             date: null,
        };

        // 2. Tingkatkan DPI
        await increaseDPI(pngPath, highDpiImagePath, targetDPI);

        // 3. Rotate image 90 derajat
        await rotateImage(highDpiImagePath, rotatedImagePath, 90);

        // 4. Crop 20% di pojok kanan bawah
        await cropBottomRight(rotatedImagePath, croppedImagePath);

        // 5. Crop dan OCR untuk setiap bagian
         for (const [key, coords] of Object.entries(cropCoordinates)) {
            const sectionImagePath = path.join(cutDir, `${baseName}-${key}.png`);
            await sharp(croppedImagePath)
                .extract({
                    left: coords.x,
                    top: coords.y,
                    width: coords.width,
                    height: coords.height,
                })
                .toFile(sectionImagePath);

            const { data: { text } } = await Tesseract.recognize(sectionImagePath, "eng", {
                logger: (m) => console.log(`[${baseName}-${key}]`, m),
            });
             switch (key) {
                   case 'revision':
                        jsonData[key] = correctRevisionOCR(text.trim());
                        break;

                    case 'date':
                        // Validasi dan format tanggal jika ada
                        const formattedDate = validateAndFormatDate(text.trim());
                        
                         // Jika revisi ada dan tanggal valid, gabungkan revisi dan tanggal
                         if (jsonData['revision'] && formattedDate) {
                           jsonData['revision'] = `${jsonData['revision']}-${formattedDate}`;
                           jsonData['date'] = formattedDate;
                           }
                         break;


                    default:
                        jsonData[key] = cleanText(text.trim()); // Simpan hasil tanpa koreksi untuk bagian lain
                        break;
                }


            console.log(`[${baseName}] Teks ${key} berhasil diekstrak.`);
            console.log(`[${baseName}] Hasil OCR ${key}: ${jsonData[key]}`);
        }


        console.log(`[${baseName}] Data berhasil diproses.`);
        return jsonData;
    } catch (err) {
        console.error(`[${pdfPath}] Terjadi kesalahan:`, err);
        throw err;
    }
}

async function generateDataFiles(allResults, outputDir) {
    // Generate CSV data from template
    const generateCSVData = (results) => {
        const transmittalNumber = generateTransmittalNumber();
        const projectName = "[]";
        const now = new Date();
        const dateDay = now.getDate();
        const dateMonth = now.getMonth() + 1;
        const dateYear = now.getFullYear();

        let csvContent = `TRANSMITTAL,,,,,,,,,,
,,,,,,,,,,
No. Transmittal: ${transmittalNumber},,,,,,,,,,
PROJECT: ,,,,,,,,,  Received :,[document name]
${projectName},,,,,,,,,Date,${dateDay}
,,,,,,,,,Month,${dateMonth}
PACKAGE :,,,,,,,,,Year,${dateYear}
,,,,,,,,,,
No.,File Name,Drawing Name,Drawing Code,Format,Revision
`;

        const drawingDataRows = results.map((item, index) => {
            const drawingNumber = item.filename; // Menggunakan nama file asli
            const drawingName = item.title || "";
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

        return csvContent;
    }

    // Simpan semua hasil ke file CSV
    const csv = generateCSVData(allResults);
    fs.writeFileSync(path.join(outputDir, "allData.csv"), csv, { encoding: 'utf-8' });
    console.log("File CSV keseluruhan berhasil dibuat.");
}

module.exports = {
    processPDF,
    generateDataFiles,
};