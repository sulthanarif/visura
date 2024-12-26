// src/pages/api/cleanup.js
import fs from 'fs';
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

const tempDir = path.join(process.cwd(), "src/temp/ocr");
const outputDir = path.join(process.cwd(), "public/output");

// Fungsi untuk menghapus semua file di direktori
async function clearDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return; // Jika direktori tidak ada, tidak perlu melakukan apa pun
    }

    const items = await fs.promises.readdir(dirPath);

    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = await fs.promises.stat(itemPath);

        if (stat.isDirectory()) {
           await clearDirectory(itemPath); // Hapus direktori recursively
           await fs.promises.rmdir(itemPath);
        } else {
             await fs.promises.unlink(itemPath); // Hapus file
        }
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
         await clearDirectory(outputDir);
         await clearDirectory(path.join(tempDir, 'cut','rotate','hi-dpi'));

        res.status(200).json({ message: 'Cleanup successful' });
    } catch (error) {
         console.error('Error during cleanup:', error);
        res.status(500).json({ message: 'Error during cleanup', error });
    }
}