import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    const { email, nomorPegawai, otp } = req.body;
    try {
      if (!email || !otp || !nomorPegawai) {
        return res.status(400).json({ message: "Email, OTP, dan Nomor Pegawai harus diisi." });
      }
    
    // Verifikasi OTP menggunakan Supabase
      const { data: session, error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email", // Changed to 'email'
      });
    
      if (otpError) {
        console.log("debug:",otpError)
        return res.status(401).json({
          message: "OTP tidak valid atau sudah kedaluwarsa. Silakan coba lagi.",
        });
      }
      // Cari pengguna berdasarkan email dan nomor pegawai yang ada di query string
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("nomor_pegawai, email_verified")
        .eq("email", email)
        .eq("nomor_pegawai", nomorPegawai)
        .single();
      if (userError || !userData) {
        return res.status(404).json({
          message: "Pengguna dengan email atau nomor pegawai tersebut tidak ditemukan.",
        });
      }
  
      // Jika email sudah terverifikasi, kembalikan error
      if (userData.email_verified) {
        return res.status(400).json({
          message: "Email sudah terverifikasi sebelumnya.",
        });
      }
      // Perbarui status email_verified berdasarkan nomor pegawai
      const { error: updateError } = await supabase
        .from("users")
        .update({ email_verified: true })
        .eq("nomor_pegawai", nomorPegawai);
      if (updateError) {
        return res.status(500).json({
          message: "Gagal memperbarui status verifikasi email. Silakan coba lagi.",
        });
      }
      // Kembalikan pesan sukses setelah verifikasi dan update berhasil
      return res.status(200).json({
        message: "Email berhasil diverifikasi dan status diperbarui!",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
  }