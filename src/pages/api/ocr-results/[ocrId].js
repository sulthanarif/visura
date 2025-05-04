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
    } else if (req.method === "DELETE") {
        try {
            // First, fetch the OCR result to get the image paths and storage references
            const { data: ocrResult, error: fetchError } = await supabase
                .from('ocr_results')
                .select('*')
                .eq('result_id', ocrId)
                .single();

            if (fetchError) {
                console.error("Error fetching ocr result:", fetchError);
                return res.status(500).json({ message: "Failed to fetch OCR result for deletion." });
            }

            if (!ocrResult) {
                return res.status(404).json({ message: "OCR result not found" });
            }

            // Delete files from storage if image_paths exists
            if (ocrResult.image_paths) {
                const filesToDelete = [];
                
                // Collect URLs to delete
                if (ocrResult.image_paths.original) {
                    filesToDelete.push(extractStoragePath(ocrResult.image_paths.original));
                }
                if (ocrResult.image_paths.cropped) {
                    filesToDelete.push(extractStoragePath(ocrResult.image_paths.cropped));
                }
                if (ocrResult.image_paths.hidpi) {
                    filesToDelete.push(extractStoragePath(ocrResult.image_paths.hidpi));
                }
                if (ocrResult.image_paths.rotated) {
                    filesToDelete.push(extractStoragePath(ocrResult.image_paths.rotated));
                }
                if (ocrResult.image_paths.parts && Array.isArray(ocrResult.image_paths.parts)) {
                    ocrResult.image_paths.parts.forEach(part => {
                        filesToDelete.push(extractStoragePath(part));
                    });
                }
                
                // Delete the PDF file if it exists
                if (ocrResult.pdf_url) {
                    filesToDelete.push(extractStoragePath(ocrResult.pdf_url));
                }

                // Remove null or undefined entries
                const validFilesToDelete = filesToDelete.filter(path => path);
                
                if (validFilesToDelete.length > 0) {
                    const { error: storageError } = await supabase.storage
                        .from('ocr-storage')
                        .remove(validFilesToDelete);

                    if (storageError) {
                        console.error("Error deleting files from storage:", storageError);
                        // Continue with deletion even if storage cleanup failed
                    }
                }
            }

            // Delete the OCR result from the database
            const { error: deleteError } = await supabase
                .from('ocr_results')
                .delete()
                .eq('result_id', ocrId);

            if (deleteError) {
                console.error("Error deleting ocr result:", deleteError);
                return res.status(500).json({ message: "Failed to delete OCR result." });
            }

            res.status(200).json({ message: 'OCR result deleted successfully' });
        } catch (error) {
            console.error("Error in /api/ocr-results/[ocrId] DELETE:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}

// Helper function to extract storage path from public URL
function extractStoragePath(url) {
    if (!url) return null;
    
    try {
        // Extract the path after "/storage/v1/object/public/ocr-storage/"
        const storagePrefix = "/storage/v1/object/public/ocr-storage/";
        const index = url.indexOf(storagePrefix);
        
        if (index === -1) {
            // Try alternate format with bucket name in URL structure
            const bucketMatch = url.match(/\/ocr-storage\/([^?]+)/);
            if (bucketMatch && bucketMatch[1]) {
                return decodeURIComponent(bucketMatch[1]);
            }
            return null;
        }
        
        const path = url.substring(index + storagePrefix.length);
        return decodeURIComponent(path.split('?')[0]); // Remove query parameters if any
    } catch (e) {
        console.error("Error extracting storage path:", e);
        return null;
    }
}