// pages/api/users/[userId].js
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
 if (req.method !== "PUT") {
     return res.status(405).json({ message: "Method not allowed" });
    }

   const { userId } = req.query;
    const { role, email_verified } = req.body;

    try {
       if (!userId) {
           return res.status(400).json({ message: "User userId is required" });
       }

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
}