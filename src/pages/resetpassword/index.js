import React, { useState, useEffect } from "react";
import ResetPasswordPage from "../../components/auth/organism/ResetPasswordComponent";
import { verifyOtp, resendOtp, fetchEmployeeData } from "../../utils/authResetpassword";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState(router.query.email || "");
  const [nomorPegawai, setNomorPegawai] = useState(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const getEmployeeData = async () => {
      if (!email || typeof email !== 'string') return;
  
      try {
        const response = await fetchEmployeeData(email);  
        if (response.ok && response.nomor_pegawai) {
          setNomorPegawai(response.nomor_pegawai);
        } else {
          setErrorMessage(response.message || "Data pegawai tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setErrorMessage("Terjadi kesalahan saat mengambil data pegawai.");
      }
    };
  
    getEmployeeData();
  }, [email]);
  
  
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
          <div style={{ minWidth: "350px", maxWidth: "600px", whiteSpace: "nowrap", textAlign: "center", textOverflow: "ellipsis" }}>
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

        router.push("/login");
      } else {
        toast.error(
          <div style={{ minWidth: "350px", maxWidth: "600px", whiteSpace: "nowrap", textAlign: "center", textOverflow: "ellipsis" }}>
            {message || "Kode OTP tidak valid atau sudah kadaluarsa."}
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
      console.error("Error during password reset:", error);
      setErrorMessage("Terjadi kesalahan pada server.");
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setErrorMessage("Email tidak valid. Silakan daftar ulang.");
      return;
    }

    setErrorMessage("");
    setIsResending(true);

    try {
      const response = await resendOtp({ email });

      if (response?.ok) {
        toast.success(
          <div style={{ minWidth: "300px", maxWidth: "600px", whiteSpace: "nowrap", textAlign: "center", textOverflow: "ellipsis" }}>
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
        setIsResending(true);
      } else {
        toast.success(
          <div style={{ minWidth: "300px", maxWidth: "600px", whiteSpace: "nowrap", textAlign: "center", textOverflow: "ellipsis" }}>
            {response?.message || "Gagal mengirim ulang OTP."}
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
        email={email}
        isResending={isResending}
        nomorPegawai={nomorPegawai}
      />
    </div>
  );
};

export default ResetPassword;
