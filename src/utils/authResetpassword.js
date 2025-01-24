// Fungsi untuk memverifikasi OTP
export const verifyOtp = async ({ email, otp, password }) => {
    try {
      const response = await fetch("/api/auth/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { ok: false, message: "Terjadi kesalahan." };
    }
  };
  

  export const resendOtp = async ({ email }) => {
    try {
      const response = await fetch("/api/auth/otpresendresetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      return await response.json();
    } catch (error) {
      console.error("Error resending OTP:", error);
      return { ok: false, message: "Gagal mengirim ulang OTP." };
    }
  };
  
export const fetchEmployeeData = async (email) => {
  try {
    const response = await fetch("/api/auth/fetchEmployeeData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return { ok: false, message: "Gagal mengambil data pegawai." };
  }
};
