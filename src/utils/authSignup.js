// src/utils/auth/signupHelpers.js
export const signup = async ({ namaPegawai, nomorPegawai, email, password }) => {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaPegawai, nomorPegawai, email, password }),
    });

    const data = await response.json();
    return { ok: response.ok, message: data.message };
  } catch (error) {
    console.error("Error in signup helper:", error);
    return { ok: false, message: "Terjadi kesalahan pada server." };
  }
};
//untuk authHelper (best practicenya 1 file helpers, but here we separate it)