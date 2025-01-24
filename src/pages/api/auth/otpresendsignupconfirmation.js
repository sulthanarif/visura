// pages/api/auth/otpresendsignupconfirmation.js
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      ok: false, 
      message: "Method not allowed" 
    });
  }

  const { email: rawEmail } = req.body;
  
  try {
    // Validasi email
    if (!rawEmail) {
      return res.status(400).json({ 
        ok: false, 
        message: "Email harus diisi." 
      });
    }

    const email = rawEmail.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        ok: false, 
        message: "Format email tidak valid." 
      });
    }

    // Cek user di database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email_verified, nama_pegawai, nomor_pegawai")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      console.error("Database query error:", userError);
      return res.status(404).json({ 
        ok: false, 
        message: "Email tidak terdaftar dalam sistem." 
      });
    }

    // Cek status verifikasi
    if (userData.email_verified) {
      return res.status(400).json({
        ok: false,
        message: "Email ini sudah diverifikasi sebelumnya.",
      });
    }

    // Kirim OTP
    const { error: otpError } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}`
      }
    });

    if (otpError) {
      console.error("OTP sending error:", otpError);
      return res.status(500).json({
        ok: false,
        message: "Gagal mengirim OTP. Silakan coba lagi dalam beberapa saat.",
      });
    }

    // Success response
    return res.status(200).json({
      ok: true,
      message: "Kode OTP telah berhasil dikirim ke email Anda.",
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ 
      ok: false, 
      message: "Terjadi kesalahan pada server. Silakan coba lagi." 
    });
  }
}