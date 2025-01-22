export const forgotPassword = async ({ email }) => {
    try {
      const response = await fetch("/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { ok: true, message: data.message, redirectUrl: data.redirectUrl };
      }
  
      return { ok: false, message: data.message };
    } catch (error) {
      console.error("Error in forgotPassword helper:", error);
      return { ok: false, message: "Terjadi kesalahan pada server." };
    }
  };
  