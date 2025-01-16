import React from "react";
import SignupComponent from "../../components/auth/organism/SignupComponent"; // Import SignupComponent

const SignupPage = () => {
  const handleSignupSubmit = (data) => {
    // Logic untuk menangani pengiriman form signup
    console.log("Data submit:", data);
  };

  return (
    <SignupComponent
      onSubmit={handleSignupSubmit}
      errorMessage="" // Jika ada error, bisa ditampilkan di sini
      showBackgroundImage={false} // Jika Anda ingin menambahkan background image
    />
  );
};

export default SignupPage;
