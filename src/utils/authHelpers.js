export const login = async ({ pegawaiNumber, password }) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pegawaiNumber, password }),
    });

    const data = await response.json();
    return { ok: response.ok, message: data.message };
  } catch (error) {
    console.error("Error in login helper:", error);
    return { ok: false, message: "Terjadi kesalahan pada server." };
  }
};

//untuk authHelper (best practicenya 1 file helpers, but here we separate it)