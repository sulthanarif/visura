import supabase from "../../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { page = 1, limit =10, search = "" } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ message: "Invalid page or limit parameter." });
  }

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber - 1;



  try {
    let query = supabase
      .from("users")
      .select(
        "userId, nomor_pegawai, nama_pegawai, email, role, email_verified",
        {count: 'exact'}
      )
      .order("nomor_pegawai", { ascending: true });

      if (search) {
          query = query.ilike('nama_pegawai', `%${search}%`);
      }

     const { data, error, count } = await query
     .range(startIndex, endIndex)

    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Failed to fetch users" });
    }

      const usersWithTotal = data.map((user) => ({
          ...user,
           total: count,
      }))


    res.status(200).json(usersWithTotal);
  } catch (error) {
    console.error("Error in /api/users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}