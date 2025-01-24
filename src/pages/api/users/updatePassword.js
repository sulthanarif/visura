// pages/api/users/updatePassword.js
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { userId, newPassword } = req.body;

    try {
        if (!userId || !newPassword) {
            return res.status(400).json({ message: "User ID and new password are required." });
        }

         const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password di database
        const { error } = await supabase
            .from("users")
            .update({ password: hashedPassword })
            .eq("userId", userId);

        if (error) {
           console.error("Error updating password:", error);
            return res.status(500).json({ message: "Failed to update password." });
        }


    const { data: user, error: userError } = await supabase
    .from("users")
    .select("userId, nomor_pegawai, role, nama_pegawai, email")
    .eq("userId", userId)
    .single();

     if (userError) {
         console.error("Error fetching user data:", error);
       return res.status(404).json({ message: "User not found." });
      }

      const newToken = jwt.sign(
                 {
                     userId: user.userId,
                     role: user.role,
                     nama_pegawai: user.nama_pegawai,
                     nomor_pegawai: user.nomor_pegawai,
                     email: user.email
                 },
                 process.env.JWT_SECRET,
                 { expiresIn: '1h' }
             );
    
        res.status(200).json({ message: "Password updated successfully!", token:newToken });
    } catch (err) {
        console.error("Error in /api/users/updatePassword:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}