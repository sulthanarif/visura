import supabase from "../../../utils/supabaseClient";
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { page = 1, limit = 10, search = "", userId, startDate, endDate } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
        return res.status(400).json({ message: "Invalid page or limit parameter." });
    }

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber - 1;

    try {
        let query = supabase
            .from("projects")
            .select(
                 `*,
                users (
                   nama_pegawai
                )
            ` ,
                { count: 'exact' }
            )
            .order("created_at", { ascending: false });

          if (search) {
            query = query.ilike('projectName', `%${search}%`);
          }


        if (userId) {
            query = query.eq('userId', userId);
        }
        if(startDate && endDate){
             query = query.gte('created_at', startDate).lte('created_at', endDate);
          } else if (startDate){
            query = query.gte('created_at', startDate);
        } else if(endDate){
             query = query.lte('created_at', endDate);
        }


        const { data, error, count } = await query
            .range(startIndex, endIndex)

        if (error) {
            console.error("Error fetching projects:", error);
            return res.status(500).json({ message: "Failed to fetch projects" });
        }
        
      const projectsWithUserName = data.map(project => ({
           ...project,
            userName: project.users?.nama_pegawai
      }))

        const projectsWithTotal = projectsWithUserName.map((project) => ({
            ...project,
            total: count,
        }))

        res.status(200).json(projectsWithTotal);
    } catch (error) {
        console.error("Error in /api/projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}