//pages/resetpassword/index.js
import React, { useState } from "react";
import ResetPasswordPage from "../../components/auth/organism/ResetPasswordComponent"; 
import { verifyOtp } from "../../utils/authResetpassword"; 
import { resendOtp } from "../../utils/authResetpassword"; 
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState(router.query.email || ""); 
  const [isResending, setIsResending] = useState(false); 

  const handleResetPassword = async (data) => {
    const { otp, password } = data; 

    if (!email || !otp || !password) {
      setErrorMessage("Semua kolom harus diisi.");
      return;
    }

    try {
      const { ok, message, redirectUrl } = await verifyOtp({ email, otp, password });

      if (ok) {
        toast.success(
          <div
            style={{
              minWidth: "350px",
              maxWidth: "600px",
              whiteSpace: "nowrap",
              textAlign: "center",
              textOverflow: "ellipsis",
            }}
          >
            Password berhasil diubah untuk akun {email.toLowerCase()}
          </div>,
          {
            duration: 8000,
            position: "top-center",
            style: {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: "400px",
              maxWidth: "600px",
            },
          }
        );

        if (redirectUrl) {
          setTimeout(() => router.push(redirectUrl), 0);
        }
      } else {
        toast.error(
          <div
            style={{
              minWidth: "350px",
              maxWidth: "600px",
              whiteSpace: "nowrap",
              textAlign: "center",
              textOverflow: "ellipsis",
            }}
          >
            {message || "Kode OTP tidak valid atau sudah kadaluarsa. "}
          </div>,
          {
            duration: 8000,
            position: "top-center",
            style: {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: "350px",
              maxWidth: "600px",
            },
          }
        );
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server.");
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setErrorMessage("Email tidak valid. Silakan daftar ulang.");
      return;
    }

    console.log("Memulai pengiriman ulang OTP untuk email:", email); 
    setErrorMessage("");
    setIsResending(true);

    try {
      const response = await resendOtp({ email });
      console.log("Respon dari API:", response); 

      if (response?.ok) {
        toast.success(
          <div style={{ minWidth: "300px", maxWidth: "600px" ,  whiteSpace: "nowrap", textAlign :"center", 
            textOverflow: "ellipsis",}}>
            Kode OTP telah dikirim ke email Anda.
          </div>,
          {
            duration: 8000,
            position: "top-center",
            style: {
              
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              minWidth: "300px", 
              maxWidth: "600px", 
            },
          }
        );
      } else {
        toast.success(
          <div style={{ minWidth: "300px", maxWidth: "600px" ,  whiteSpace: "nowrap", textAlign :"center", 
            textOverflow: "ellipsis",}}>
            {response?.message }
          </div>,
          {
            duration: 8000,
            position: "top-center",
            style: {
              
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              minWidth: "300px", 
              maxWidth: "600px", 
            },
          }
        );
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
      <ResetPasswordPage
        onSubmit={handleResetPassword}
        onResend={handleResendOTP}
        errorMessage={errorMessage}
        email={email} // Kirim email yang sudah didefinisikan
        isResending={isResending} // Kirim status pengiriman ulang OTP
      />
    </div>
  );
};

export default ResetPassword;
