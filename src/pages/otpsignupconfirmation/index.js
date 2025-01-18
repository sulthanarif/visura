import { useRouter } from "next/router";
import OTPsignupconfirmationComponent from "../../components/auth/organism/OTPsignupconfirmationComponent";
import { verifyOtp } from "../../utils/authOTPsignup"; 

const OtpSignupConfirmationPage = () => {
  const router = useRouter();
  const { email } = router.query;  // Mengambil email dari URL query

  const handleOtpSubmit = async (otp) => {
    try {
      // Proses verifikasi OTP menggunakan helper
      const response = await verifyOtp({ email, otp });

      if (response.ok) {
        // Jika OTP valid, arahkan ke halaman selanjutnya (misal: sukses atau halaman login)
        router.push("/login");
      } else {
        // Jika OTP invalid
        alert("Kode OTP tidak valid. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error verifikasi OTP:", error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <OTPsignupconfirmationComponent
      onSubmit={handleOtpSubmit}
      email={email}  // Pass email ke komponen untuk menampilkan
    />
  );
};

export default OtpSignupConfirmationPage;
