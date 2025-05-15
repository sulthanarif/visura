// src/utils/authHelpers.js
export const login = async ({ pegawaiNumber, password }) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pegawaiNumber, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      const tokenData = decodeToken(data.token);
      return { ok: true, message: data.message, user: tokenData };
    }
    return { ok: false, message: data.message };
  } catch (error) {
    console.error("Error in login helper:", error);
    return { ok: false, message: "Terjadi kesalahan pada server." };
  }
};


export function decodeToken(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
}
//untuk authHelper (best practicenya 1 file helpers, but here we separate it)