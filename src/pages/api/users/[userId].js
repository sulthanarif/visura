//src/pages/api/users/[userId].js
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    if (req.method === "PUT") {
        const { role, email_verified } = req.body;

        try {
             if (!role) {
                 return res.status(400).json({ message: "Role is required" });
            }

            const { error } = await supabase
               .from('users')
               .update({ role, email_verified })
               .eq('userId', userId);

            if(error){
              console.error("Error updating user:", error);
                return res.status(500).json({ message: "Failed to update user." });
            }
           res.status(200).json({ message: 'User updated successfully' });
        } catch (error) {
             console.error("Error in /api/users/[userId]:", error);
            res.status(500).json({ message: "Internal server error" });
       }
    } else if (req.method === "DELETE") {
        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('userId', userId);

            if (error) {
                console.error("Error deleting user:", error);
                return res.status(500).json({ message: "Failed to delete user." });
            }

            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Error in DELETE /api/users/[userId]:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}