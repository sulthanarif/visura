// src/utils/authOTPsignup.js
export const verifyOtp = async ({ email, nomorPegawai, otp }) => {
  try {
    const response = await fetch('/api/auth/otpsignupconfirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, nomorPegawai, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        message: data.message || 'Verifikasi OTP gagal'
      };
    }

    return {
      ok: true,
      message: data.message,
      data: data
    };

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      ok: false,
      message: 'Terjadi kesalahan saat verifikasi OTP'
    };
  }
};