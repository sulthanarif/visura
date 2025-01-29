//src/pages/api/delete-file.js
import supabase from "@/utils/supabaseClient";
import { decodeToken } from "@/utils/authHelpers";

export default async function handler(req, res) {
      const authHeader = req.headers.authorization;

     if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authenticated: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if(!token) {
       return res.status(401).json({ message: 'Not authenticated: Invalid token format' });
    }

    try {
        const decoded = decodeToken(token);
        if (!decoded) {
             return res.status(401).json({ message: 'Not authenticated: Invalid token' });
        }

        if (req.method !== 'DELETE') {
            return res.status(405).json({ message: 'Method Not Allowed' });
         }
          const { fileId, projectID } = req.body;
        if(!fileId || !projectID) {
             return res.status(400).json({ message: 'Missing file or project' });
        }
      try {
             const { data, error } = await supabase.from('ocr_results').select('*').eq('project_id', projectID).eq('result_id', fileId).single();
              if (error) {
                  console.error('Error fetching ocr results:', error);
                  return res.status(500).json({ message: `Error fetching ocr results: ${error.message}` });
              }

              const paths = [
                  data.original_image_path,
                  data.hidpi_image_path,
                  data.rotated_image_path,
                 data.cropped_image_path
               ];

                 //delete all related image in storage
              const removeStorage =  await supabase.storage.from('ocr-storage').remove(paths.filter(path => path != null))
               if(removeStorage.error) {
                  console.error('Error remove file in storage:', removeStorage.error);
                return res.status(500).json({ message: 'Error removing storage' });
               }
              //delete all related entry in table
              const deleteResult = await supabase.from('ocr_results').delete().eq('result_id', fileId);
              if(deleteResult.error) {
                 console.error('Error removing ocr result in table', deleteResult.error)
                return res.status(500).json({ message: `Error deleting ocr results: ${deleteResult.error}` });
              }
              res.status(200).json({ message: 'Successfully delete data' });
      } catch(err) {
          console.error("Error while delete data: ", err);
            res.status(500).json({ message: 'Error while delete data', error: err.message });
      }

       } catch (error) {
        console.error("Authentication error: ", error);
         res.status(401).json({ message: 'Not authenticated, invalid token'});
       }
}