//pages/api/ocr.js
import ocrController from "../../lib/ocr/server/controller/ocrController";

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false, // Remove the default response size limit
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    try {
        await ocrController.processUpload(req, res);
    } catch (error) {
        console.error('API Error:', error);
        // Ensure response is sent even if controller crashes
        if (!res.headersSent) {
            let errorMessage = error.message || "An unexpected error occurred";
            
            // Customize error messages for common issues
            if (errorMessage.includes("LIMIT_FILE_SIZE")) {
                errorMessage = "File size exceeds the 10MB limit.";
            } else if (errorMessage.includes("LIMIT_UNEXPECTED_FILE")) {
                errorMessage = "Invalid file type. Only PDF files are allowed.";
            } else if (errorMessage.includes("extract_area")) {
                errorMessage = "Could not process the document layout. The file may be damaged or encrypted.";
            }
            
            res.status(500).json({
                message: "Error processing files",
                error: errorMessage
            });
        }
    }
}