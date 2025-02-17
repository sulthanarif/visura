//pages/api/auth/otpsignupconfirmation.js
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

    // Verifikasi OTP menggunakan Supabase //
    const { data: session, error: otpError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (otpError) {
      return res.status(401).json({
        message: "OTP tidak valid atau sudah kedaluwarsa. Silakan coba lagi.",
      });
    }
    const { data: emailCheck, error: emailCheckError } = await supabase
    .from("users")
    .select("email_verified")
    .ilike("email", `%${email}%`);

if (emailCheckError) {
    console.error("Error Email Check:", emailCheckError);
    return res.status(500).json({ message: 'Email yang Anda masukan telah terdaftar' });
}

if (emailCheck.some((entry) => entry.email_verified)) {
    return res.status(400).json({
        message: `Email yang Anda masukkan (${email}) telah terdaftar.`,
    });
}

    // Cek apakah nomor pegawai sudah digunakan dengan email yang statusnya verified
    const { data: existingPegawai, error: existingPegawaiError } = await supabase
      .from("users")
      .select("email, email_verified")
      .eq("nomor_pegawai", nomorPegawai);

    if (existingPegawaiError) {
      console.error("Error checking nomor pegawai:", existingPegawaiError);
      return res.status(500).json({
        message: "Terjadi kesalahan saat memeriksa nomor pegawai.",
      });
    }

    if (existingPegawai && existingPegawai.some((user) => user.email_verified)) {
      return res.status(400).json({
        message: "Nomor pegawai sudah digunakan.",
      });
    }

    // Cek kombinasi nomor pegawai dan email di database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("email_verified")
      .eq("email", email)
      .eq("nomor_pegawai", nomorPegawai)
      .single();

    if (userError || !userData) {
      return res.status(404).json({
        message: "Kombinasi email dan nomor pegawai tidak ditemukan.",
      });
    }

    // Jika email belum terverifikasi, perbarui status verifikasi
    if (!userData.email_verified) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ email_verified: true })
        .eq("nomor_pegawai", nomorPegawai);

      if (updateError) {
        console.error("Error updating email verification:", updateError);
        return res.status(500).json({
          message: "Gagal memperbarui status verifikasi email. Silakan coba lagi.",
        });
      }

      return res.status(200).json({
        message: "Email berhasil diverifikasi dan status diperbarui!",
      });
    }

    // Jika email sudah terverifikasi
    return res.status(400).json({
      message: "Email sudah terverifikasi sebelumnya.",
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}
