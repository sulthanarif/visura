import React, { useState } from "react";
import SignupComponent from "../../components/auth/organism/SignupComponent";
import { signup } from "../../utils/authSignup";  // Impor signup helper

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (credentials) => {
    try {
      const { ok, message, redirectUrl } = await signup(credentials);

      if (ok) {
        
        if (redirectUrl) {
          window.location.href = redirectUrl;  
        }
      } else {
        setErrorMessage(message); 
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
