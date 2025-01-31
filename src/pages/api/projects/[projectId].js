// pages/api/projects/[projectId].js
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
    const { projectId } = req.query;

    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

    if (req.method === "PUT") {
        const { projectName } = req.body;

        try {
            if (!projectName) {
                return res.status(400).json({ message: "Project Name is required" });
            }

            const { error } = await supabase
                .from('projects')
                .update({ projectName })
                .eq('projectId', projectId);

            if (error) {
                console.error("Error updating project:", error);
                return res.status(500).json({ message: "Failed to update project." });
            }

            res.status(200).json({ message: 'Project updated successfully' });
        } catch (error) {
            console.error("Error in /api/projects/[projectId]:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
      else if(req.method === "DELETE"){
           try {
                const { error } = await supabase
                    .from('projects')
                    .delete()
                   .eq('projectId', projectId);

                if (error) {
                    console.error("Error deleting user:", error);
                    return res.status(500).json({ message: "Failed to delete user." });
                }

                res.status(200).json({ message: "User deleted successfully" });
            } catch (error) {
                console.error("Error in DELETE /api/projects/[projectId]:", error);
                res.status(500).json({ message: "Internal server error" });
            }
     }
     else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}