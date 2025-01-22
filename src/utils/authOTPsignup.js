// Fungsi untuk memvalidasi email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fungsi untuk memverifikasi OTP
export const verifyOtp = async ({ email, nomorPegawai, otp }) => {
  if (!email || !otp || !nomorPegawai) {
    return {
      ok: false,
      message: "Email, nomor pegawai, dan OTP harus diisi.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: "Format email tidak valid.",
    };
  }

  try {
    const response = await fetch("/api/auth/otpsignupconfirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, nomorPegawai, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: data.message || "Verifikasi OTP gagal.",
      };
    }

    return {
      ok: true,
      message: data.message,
      data,
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      ok: false,
      message: "Terjadi kesalahan saat verifikasi OTP.",
    };
  }
};

// Fungsi untuk mengirim ulang OTP
export const resendOtp = async ({ email }) => {
  if (!email) {
    return {
      ok: false,
      message: "Email harus diisi.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      ok: false,
      message: "Format email tidak valid.",
    };
  }

  try {
    const response = await fetch("/api/auth/otpresendsignupconfirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return { ok: true, message: data.message };
    }

    return { ok: false, message: data.message || "Gagal mengirim ulang OTP." };
  } catch (error) {
    console.error("Error in resend OTP helper:", error);
    return { ok: false, message: "Terjadi kesalahan pada server." };
  }
};
