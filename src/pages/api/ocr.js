//pages/api/ocr.js
import ocrController from "../../lib/ocr/server/controller/ocrController";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    await ocrController.processUpload(req, res);
}