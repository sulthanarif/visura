import supabase from "../../../utils/supabaseClient";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Format email tidak valid.";
  }
  return null;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email: rawEmail } = req.body;
  const email = rawEmail?.toLowerCase();

  if (!email) {
    return res.status(400).json({ message: "Email harus diisi." });
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return res.status(400).json({ message: emailError });
  }

  try {
    // Query semua pengguna dengan email tersebut
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("nomor_pegawai, email_verified")
      .ilike("email", email);

    if (userError) {
      console.error("Error fetching users:", userError);
      return res.status(500).json({ message: "Kesalahan server." });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ message: `Email ${email} tidak ditemukan.` });
    }

    // Pisahkan berdasarkan status verifikasi
    const verifiedUsers = users.filter((user) => user.email_verified);
    const unverifiedUsers = users.filter((user) => !user.email_verified);

    // Logika keputusan
    if (verifiedUsers.length > 1) {
      return res.status(400).json({
        message: `Terdapat lebih dari satu pengguna dengan email ${email} dan status verifikasi. Periksa data pengguna.`,
      });
    }

    if (verifiedUsers.length === 0) {
      return res.status(400).json({
        message: `Tidak ada pengguna dengan email ${email} yang telah terverifikasi.`,
      });
    }

    if (verifiedUsers.length === 1 && unverifiedUsers.length >= 0) {
      const verifiedUser = verifiedUsers[0];

      // Kirim OTP ke pengguna yang terverifikasi
      const { error: otpError } = await supabase.auth.signInWithOtp({ email });

      if (otpError) {
        console.error("Error sending OTP:", otpError);
        return res.status(500).json({
          message: `Gagal mengirim OTP ke email. Penyebab: ${otpError.message}`,
        });
      }

      return res.status(200).json({
        message: `OTP berhasil dikirim ke email ${email}.`,
        
      });
    }
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server. Silakan coba lagi beberapa saat.",
    });
  }
}
