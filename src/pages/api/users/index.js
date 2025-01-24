import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select(
        "userId, nomor_pegawai, nama_pegawai, email, role, email_verified"
      )
      .order("nomor_pegawai", { ascending: true });

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Failed to fetch users" });
    }

    res.status(200).json(
      users.map((user, index) => ({
        userId: user.userId,
        nomor_pegawai: user.nomor_pegawai,
        nama_pegawai: user.nama_pegawai,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
        total: users.length,
      }))
    );
  } catch (error) {
    console.error("Error in /api/users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
