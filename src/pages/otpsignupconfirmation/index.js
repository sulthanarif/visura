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
  const [isResending, setIsResending] = useState(false);
  const [isLinkDisabled, setIsLinkDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query?.email || !router.query?.nomorPegawai) {
      toast.error("Data tidak lengkap. Silakan daftar ulang.");
      router.push("/signup");
      return;
    }

    setEmail(router.query.email.toLowerCase());
    setNomorPegawai(router.query.nomorPegawai);
});

  const handleOtpSubmit = async (otp) => {
   
    setErrorMessage("");
   
    if (!otp || otp.length !== 6) {
      setErrorMessage("Kode OTP harus terdiri dari 6 digit.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyOtp({ 
        email, 
        nomorPegawai, 
        otp 
      });

      if (response.ok) {
       
        toast.success("Akun berhasil terdaftar! Silakan login.", {
          duration: 8000,
          position: "top-center",
          
        });
        
       
        setTimeout(() => router.push("/login"));
      } else {
        toast.error(
          <div style={{ minWidth: "300px", maxWidth: "600px" ,  whiteSpace: "nowrap", textAlign :"center", 
            textOverflow: "ellipsis",}}>
            Kode OTP tidak valid atau link ini sudah expired.
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
      // Error network/server
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
   
    if (!email) {
      setErrorMessage("Email tidak valid. Silakan daftar ulang.");
      router.push("/signup");
      return;
    }

    setErrorMessage("");
    setIsResending(true);

    try {
      const response = await resendOtp({ email });

      if (response?.ok) {
      
        toast.success("Kode OTP baru telah dikirim ke email Anda.", {
          duration: 5000,
          position: "top-center",
        });
        
        setIsLinkDisabled(true);
      } else {
       
        toast.error("Gagal mengirim ulang OTP. Coba lagi.", {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba beberapa saat lagi.");
    } finally {
      setIsResending(false);
    }
  };

  if (!router.isReady) {
    return null;
  }

  return (
    <OTPsignupconfirmationComponent
      onSubmit={handleOtpSubmit}
      onResend={handleResendOtp}
      email={email}
      errorMessage={errorMessage}
      isLinkDisabled={isLinkDisabled || isResending}
      isLoading={isLoading || isResending}
      timer={timer}
    />
  );
};

export default OtpSignupConfirmationPage;