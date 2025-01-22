// pages/otpSignupConfirmation.js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import OTPsignupconfirmationComponent from "../../components/auth/organism/OTPsignupconfirmationComponent";
import { verifyOtp, resendOtp } from "../../utils/authOTPsignup";
import toast from 'react-hot-toast';

const OtpSignupConfirmationPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nomorPegawai, setNomorPegawai] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect ke halaman signup jika tidak ada email atau nomorPegawai
    if (router.isReady && (!router.query?.email || !router.query?.nomorPegawai)) {
      router.push("/signup");
      return;
    }

    if (router.query?.email && router.query?.nomorPegawai) {
      setEmail(router.query.email.toLowerCase());
      setNomorPegawai(router.query.nomorPegawai);
    }
  }, [router.isReady, router.query]);

  const handleOtpSubmit = async (otp) => {
    if (!email || !nomorPegawai) {
      setErrorMessage("Email dan nomor pegawai tidak ditemukan.");
      return;
    }

    const response = await verifyOtp({ email, nomorPegawai, otp });

    if (response.ok) {
      
      toast.success('Akun berhasil terdaftar!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#008C28',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
      });
      
      // Tunggu sebentar sebelum redirect
      setTimeout(() => {
        router.push("/login");
      },0);
    } else {
      setErrorMessage(response.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      if (!email) {
        throw new Error("Email tidak ditemukan.");
      }

      console.log('Sending OTP to:', email);
      
      const response = await resendOtp({ email });

      if (!response?.ok) {
        setErrorMessage(response?.message || "Gagal mengirim ulang OTP.");
      }

      setErrorMessage("OTP telah berhasil dikirim ulang ke email Anda.");
      
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Jika masih loading initial data
  if (!router.isReady) {
    return null;
  }

  return (
    <OTPsignupconfirmationComponent
      onSubmit={handleOtpSubmit}
      onResend={handleResendOtp}
      email={email}
      errorMessage={errorMessage}
      isLoading={isLoading}
    />
  );
};

export default OtpSignupConfirmationPage;