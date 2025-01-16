import supabase from "../../../utils/supabaseClient"; // Import Supabase Client

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { pegawaiNumber, password } = req.body;

  try {
    // Validasi input
    if (!pegawaiNumber || !password) {
      return res.status(400).json({ message: "Nomor Pegawai dan Password harus diisi." });
    }

    // Cek user di database berdasarkan nomor_pegawai
    const { data: user, error } = await supabase
      .from("users")
      .select("password, email_verified")
      .eq("nomor_pegawai", pegawaiNumber)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Nomor Pegawai tidak ditemukan." });
    }

    // Validasi password
    if (password !== user.password) { // Ganti dengan hash comparison jika password di database di-hash
      return res.status(401).json({ message: "Password salah." });
    }

    // Validasi email terverifikasi
    if (!user.email_verified) {
      return res.status(403).json({ message: "Email belum terverifikasi." });
    }

    // Login berhasil
    res.status(200).json({ message: "Login berhasil!" });
  } catch (err) {
    console.error("Error in /api/auth/login:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}
