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

// Function to remove all files in a directory recursively
async function clearDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return; // If the directory doesn't exist, no need to do anything
  }

  try {
    const items = await fs.promises.readdir(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
        try {
            const stat = await fs.promises.lstat(itemPath);

            if (stat.isDirectory()) {
                 await clearDirectory(itemPath); // Remove directory recursively
             } else {
                  await fs.promises.unlink(itemPath, { force: true });
             }

            } catch(err){
              console.error(`Error accessing/deleting item ${itemPath}:`, err);
           }
       }
    }
    catch(error){
       console.error("Error while clear directory: ", error);
    }
}


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
       await clearDirectory(outputDir);
        await clearDirectory(tempDir);

    res.status(200).json({ message: 'Cleanup successful' });
  } catch (error) {
    console.error('Error during cleanup:', error);
      res.status(500).json({ message: 'Error during cleanup', error: error.message });
  }
}