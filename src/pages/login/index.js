import React, { useState } from "react";
import LoginComponent from "../../components/auth/organism/LoginComponent";

import { login } from "../../utils/authHelpers"; 

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (credentials) => {
    const response = await login(credentials);

    if (response.ok) {
   
      window.location.href = "/dashboard";
    } else {
      
      setErrorMessage(response.message);
    }
  };

  return (
    <div>
      <LoginComponent onSubmit={handleLogin} errorMessage={errorMessage} />
    </div>
  );
};

export default LoginPage;
