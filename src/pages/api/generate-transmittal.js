//src/pages/api/generate-transmittal.js
import ocrController from "../../server/controller/ocrController";

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req, res) {
     if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
   await ocrController.generateTransmittal(req, res);
}