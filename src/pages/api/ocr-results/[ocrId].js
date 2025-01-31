// pages/api/ocr-results/[ocrId].js
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
    const { ocrId } = req.query;
    
    if (!ocrId) {
        return res.status(400).json({ message: "OCR ID is required" });
    }

    if (req.method === "PUT") {
        const { title, revision, drawingCode, date } = req.body;

        try {
             if (!title || !revision || !drawingCode || !date) {
                 return res.status(400).json({ message: "All fields are required" });
            }

            const { error } = await supabase
               .from('ocr_results')
               .update({ title, revision, drawingCode, date })
               .eq('result_id', ocrId);

            if(error){
                console.error("Error updating ocr results:", error);
                return res.status(500).json({ message: "Failed to update ocr results." });
             }
           res.status(200).json({ message: 'OCR results updated successfully' });
        } catch (error) {
            console.error("Error in /api/ocr-results/[ocrId]:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}