import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
    const { projectId } = req.query;
    
    if (!projectId) {
        return res.status(400).json({ message: "Project ID is required" });
    }

     if (req.method === "DELETE") {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('projectId', projectId);

            if (error) {
                console.error("Error deleting project:", error);
                return res.status(500).json({ message: "Failed to delete project." });
            }

            res.status(200).json({ message: "Project deleted successfully" });
        } catch (error) {
            console.error("Error in DELETE /api/projects/[projectId]:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}