import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { verifyOtp, resendOtp } from "../../utils/authResetpassword";
import ResetPasswordComponent from "../../components/auth/organism/ResetPasswordComponent";
import { toast } from "react-hot-toast"; // Untuk notifikasi

const ResetPasswordPage = () => {
  const router = useRouter();
  const { email } = router.query; // Mengambil email dari query URL
  const [errorMessage, setErrorMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      setErrorMessage("Email tidak ditemukan. Silakan coba lagi.");
    }
  }, [email]);

  // Handler saat tombol submit ditekan
  const handleSubmit = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Password tidak cocok.");
      return;
    }

    try {
      const response = await verifyOtp({
        email,
        otp: formData.otp,
        password: formData.password,
      });

      if (response?.ok) {
        toast.success("Password berhasil diubah. Silakan login.", {
          duration: 5000,
          position: "top-center",
        });
        router.push("/login");
      } else {
        toast.error(response?.message || "Gagal memverifikasi OTP.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error during reset password:", error);
      setErrorMessage("Terjadi kesalahan. Silakan coba beberapa saat lagi.");
    }
  };

  // Handler untuk mengirim ulang OTP
  const handleResendOTP = async () => {
    if (!email) {
      setErrorMessage("Email tidak valid. Silakan daftar ulang.");
      return;
    }
  
    console.log("Memulai pengiriman ulang OTP untuk email:", email); // Debug log
    setErrorMessage("");
    setIsResending(true);
  
    try {
      const response = await resendOtp({ email });
      console.log("Respon dari API:", response); // Debug log
  
      if (response?.ok) {
        toast.success("Kode OTP baru telah dikirim ke email Anda.", {
          duration: 5000,
          position: "top-center",
        });
      } else {
        toast.error(response?.message || "Gagal mengirim ulang OTP.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error during resend OTP:", error);
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba beberapa saat lagi.");
    } finally {
      setIsResending(false);
    }
  };
  

  return (
    <div>
      {email ? (
        <ResetPasswordComponent
          email={email}
          onSubmit={handleSubmit}
          onResend={handleResendOTP}
          errorMessage={errorMessage}
          isResending={isResending}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResetPasswordPage;
