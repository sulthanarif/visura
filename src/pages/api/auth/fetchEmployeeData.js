import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  // Ambil data email dari request body
  const { email } = req.body;

  // Validasi input
  if (!email) {
    return res.status(400).json({
      ok: false,
      message: "Email harus diisi.",
    });
  }

  try {
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

    // Ambil nomor pegawai dari pengguna yang terverifikasi
    const verifiedUser = verifiedUsers[0];

    return res.status(200).json({
      ok: true,
      nomor_pegawai: verifiedUser.nomor_pegawai,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({
      ok: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi.",
    });
  }
}
