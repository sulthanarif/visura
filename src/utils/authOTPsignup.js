export const verifyOtp = async ({ email, nomorPegawai, otp }) => {
  try {
    const response = await fetch("/api/auth/otpsignupconfirmation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, nomorPegawai }), // Menambahkan nomorPegawai
    });

    const data = await response.json(); // Parsing respons JSON dari backend

    if (!response.ok) {
      // Jika status respons bukan 2xx, anggap sebagai error
      return {
        ok: false,
        message: data.message || "Terjadi kesalahan saat verifikasi OTP.",
      };
    }

    return {
      ok: true,
      message: data.message || "OTP berhasil diverifikasi.",
    };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      ok: false,
      message: error.message || "Terjadi kesalahan yang tidak terduga.",
    };
  }
};
