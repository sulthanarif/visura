import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { pegawaiNumber, password } = req.body;

  try {
    if (!pegawaiNumber || !password) {
      return res.status(400).json({ message: "Nomor Pegawai dan Password harus diisi." });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("userId, password, email_verified, role, nama_pegawai, nomor_pegawai") // Ambil data yg dibutuhkan
      .eq("nomor_pegawai", pegawaiNumber)
      .single();

    if (error || !user) {
      return res.status(401).json({ message: "Nomor atau password salah, coba lagi." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Nomor atau password salah, coba lagi." });
    }

    if (!user.email_verified) {
      return res.status(403).json({ message: "Email belum terverifikasi, silahkan daftarkan ulang." });
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        userId: user.userId,
        role: user.role,
        nama_pegawai: user.nama_pegawai,
        nomor_pegawai: user.nomor_pegawai,
      },
      process.env.JWT_SECRET, // Pastikan JWT_SECRET ada di .env.local
      { expiresIn: "1h" } // Token berlaku 1 jam, bisa diubah
    );

    res.status(200).json({ message: "Login berhasil!", token });
  } catch (err) {
    console.error("Error in /api/auth/login:", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}