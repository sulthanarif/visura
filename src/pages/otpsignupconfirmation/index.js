import { useRouter } from "next/router";
import OTPsignupconfirmationComponent from "../../components/auth/organism/OTPsignupconfirmationComponent";
import { verifyOtp } from "../../utils/authOTPsignup"; 
import { useState } from "react";

const OtpSignupConfirmationPage = () => {
  const router = useRouter();
  const { email: emailFromQuery, nomorPegawai } = router.query; // Mengambil email dan nomorPegawai dari URL query
  const email = emailFromQuery?.toLowerCase();
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menyimpan error message

  const handleOtpSubmit = async (otp) => {
    if (!email || !nomorPegawai) {
      setErrorMessage("Email dan nomor pegawai tidak ditemukan.");
      return;
    }

    const response = await verifyOtp({ email, nomorPegawai, otp });

    if (response.ok) {
      // Jika OTP berhasil diverifikasi, arahkan ke halaman login
      router.push("/login");
    } else {
      // Set error message dari response
      setErrorMessage(response.message);
    }
  };

  return (
    <OTPsignupconfirmationComponent
      onSubmit={handleOtpSubmit}
      email={email} 
      errorMessage={errorMessage} // Pass error message ke komponen
    />
  );
};

export default OtpSignupConfirmationPage;
