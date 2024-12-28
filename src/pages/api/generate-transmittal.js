import { generateDataFiles } from "../../server/ocr-process";
import { outputDir } from "../../server/ocr-process";
import fs from 'fs';
import path from "path";

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
         const { transmittalData } = req.body;
       if (!transmittalData || transmittalData.length === 0) {
            return res.status(400).json({ message: "No transmittal data provided." });
        }
         let csvFileName;
        try {
              csvFileName = await generateDataFiles(transmittalData, outputDir);
        }catch(e){
            console.error("Error generating transmittal:", e);
             return res.status(500).json({ message: "Error generating transmittal", error: e.message });
        }

       res.status(200).json({ message: 'Transmittal generated successfully', csvFileName: csvFileName });

    } catch (error) {
        console.error("Error generating transmittal:", error);
       res.status(500).json({ message: "Error generating transmittal", error: error.message });
    }
}