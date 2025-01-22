import React, { useState } from "react";
import LoginComponent from "../../components/auth/organism/LoginComponent";
import { login } from "../../utils/authHelpers"; 
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);

      if (response.ok) {
        toast.success("Anda berhasil login!", {
          duration: 5000,
          position: "top-center",
        });
        setErrorMessage('');
        router.push("/upload-test");
      } else {
        setErrorMessage(response?.message || "Terjadi kesalahan, coba lagi.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server.");
    }
  };

  return (
    <div>
      <LoginComponent onSubmit={handleLogin} errorMessage={errorMessage} />
    </div>
  );
};

export default LoginPage;
