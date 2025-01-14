import React from "react";
import SignupPage from "../../components/auth/organism/SignupPage"; // Import SignupPage

const Signup = () => {
  const handleSignupSubmit = (data) => {
    // Logic untuk menangani pengiriman form signup
    console.log("Data submit:", data);
  };

  return (
    <SignupPage
      onSubmit={handleSignupSubmit}
      errorMessage="" // Jika ada error, bisa ditampilkan di sini
      showBackgroundImage={false} // Jika Anda ingin menambahkan background image
    />
  );
};

export default Signup;
