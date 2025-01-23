import supabase from "../../../utils/supabaseClient";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  // Ambil data email, OTP, dan password dari request body
  const { email, otp, password } = req.body;

  try {
    // Validasi input
    if (!email) {
      return res.status(400).json({
        ok: false,
        message: "Email harus diisi.",
      });
    }

    if (!otp) {
      return res.status(400).json({
        ok: false,
        message: "OTP harus diisi.",
      });
    }

    if (!password) {
      return res.status(400).json({
        ok: false,
        message: "Password harus diisi.",
      });
    }

    // Verifikasi OTP
    const { data: session, error: otpError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (otpError) {
      console.error("OTP verification error:", otpError);
      return res.status(401).json({
        ok: false,
        message: "OTP tidak valid atau sudah kedaluwarsa.",
      });
    }

    // Query untuk mencari pengguna dengan email tersebut
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("nomor_pegawai, email_verified")
      .ilike("email", email);

    if (userError) {
      console.error("Error fetching users:", userError);
      return res.status(500).json({
        ok: false,
        message: "Kesalahan server. Gagal mencari pengguna.",
      });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({
        ok: false,
        message: `Email ${email} tidak ditemukan.`,
      });
    }

    // Pisahkan pengguna yang terverifikasi dan yang tidak
    const verifiedUsers = users.filter((user) => user.email_verified);

    // Pastikan hanya ada satu pengguna terverifikasi dengan email ini
    if (verifiedUsers.length > 1) {
      return res.status(400).json({
        ok: false,
        message: `Terdapat lebih dari satu pengguna dengan email ${email} yang terverifikasi. Periksa data pengguna.`,
      });
    }

    if (verifiedUsers.length === 0) {
      return res.status(400).json({
        ok: false,
        message: `Tidak ada pengguna dengan email ${email} yang telah terverifikasi.`,
      });
    }

    // Ambil data pengguna yang terverifikasi
    const verifiedUser = verifiedUsers[0];

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password pengguna yang terverifikasi di tabel 'users'
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("nomor_pegawai", verifiedUser.nomor_pegawai);

    if (updateError) {
      console.error("Password update failed:", updateError);
      return res.status(500).json({
        ok: false,
        message: "Gagal memperbarui password. Silakan coba lagi.",
      });
    }

    // Kembalikan respons berhasil
    return res.status(200).json({
      ok: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      ok: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi.",
    });
  }
}
