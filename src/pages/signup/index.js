import React, { useState } from "react";
import SignupComponent from "../../components/auth/organism/SignupComponent";
import { signup } from "../../utils/authSignup";  // Impor signup helper

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (credentials) => {
    try {
      const { ok, message, redirectUrl } = await signup(credentials);

      if (ok) {
        // Jika pendaftaran berhasil, arahkan ke halaman OTP
        if (redirectUrl) {
          window.location.href = redirectUrl;  // Redirect ke halaman yang mengandung OTP
        }
      } else {
        setErrorMessage(message);  // Menampilkan pesan error jika gagal
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server.");
    }
  };

  return (
    <div>
      <SignupComponent onSubmit={handleSignup} errorMessage={errorMessage} />
    </div>
  );
};

export default SignupPage;
