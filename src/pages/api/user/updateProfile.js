import supabase from "@/utils/supabaseClient";
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if(req.method !== 'PUT'){
        return res.status(405).json({ message: 'Method not allowed'});
    }

    const {userId, nama_pegawai, email, nomor_pegawai} = req.body;

    if(!userId || !nama_pegawai || !email || !nomor_pegawai){
         return res.status(400).json({ message: 'Semua field harus diisi.' });
    }

    try{
        // Update user profile
        const { error } = await supabase
            .from('users')
            .update({ nama_pegawai, email, nomor_pegawai })
            .eq('userId', userId);

        if (error) {
              console.error('Error update user profile:', error);
              return res.status(500).json({ message: 'Terjadi kesalahan saat update data pengguna.' });
        }

        // Fetch updated user data
        const { data: updatedUser, error: fetchError } = await supabase
            .from('users')
            .select('userId, role, nama_pegawai, nomor_pegawai, email')
            .eq('userId', userId)
            .single();

          if(fetchError || !updatedUser){
            console.error("Error Fetching updated user", fetchError)
              return res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data pengguna yang diperbarui.' });
        }


        // Create new token with updated data
        const newToken = jwt.sign(
            {
                userId: updatedUser.userId,
                role: updatedUser.role,
                nama_pegawai: updatedUser.nama_pegawai,
                nomor_pegawai: updatedUser.nomor_pegawai,
                email: updatedUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    
        res.status(200).json({ message: "Berhasil Update Profile!", token: newToken });

    } catch(err){
        console.error('Error update profile', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
}