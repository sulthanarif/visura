//src/pages/api/getocrdatabyprojectid/index.js
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { projectIds } = req.query;

     if (!projectIds) {
       return res.status(400).json({ message: "projectIds parameter is required" });
   }

    let parsedProjectIds;
     try {
        parsedProjectIds = JSON.parse(projectIds)
        if (!Array.isArray(parsedProjectIds)) {
          return res.status(400).json({ message: "Invalid projectIds format. Must be an array" });
       }
    } catch (error) {
      return res.status(400).json({ message: "Invalid projectIds parameter. Must be a valid JSON array." });
    }

    try {
        let query = supabase
            .from("ocr_results")
            .select(
                `*,
                projects (
                   projectName
                )
            `
            )
           .in('projectId', parsedProjectIds);


        const { data, error } = await query;
        if (error) {
            console.error("Error fetching OCR results:", error);
            return res.status(500).json({ message: "Failed to fetch OCR results" });
        }
         const ocrResultsWithProjectName = data.map(ocr => ({
              ...ocr,
              projectName: ocr.projects?.projectName
         }))

        res.status(200).json(ocrResultsWithProjectName);
    } catch (error) {
        console.error("Error in /api/getocrdatabyprojectid:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}