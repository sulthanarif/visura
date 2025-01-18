// src/pages/signup.js

import React, { useState } from "react";
import SignupComponent from "../../components/auth/organism/SignupComponent";
import { signup } from "../../utils/authSignup";  // Import helper signup

const SignupPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (credentials) => {
    try {
      const response = await signup(credentials);  

      if (response.ok) {
       
        window.location.href = "/otpsignupconfirmation"; 
      } else {
        setErrorMessage(response.message);  
      }
    } catch (error) {
      setErrorMessage("Error");
    }
  };

  return (
    <div>
      <SignupComponent onSubmit={handleSignup} errorMessage={errorMessage} />
    </div>
  );
};

export default SignupPage;
