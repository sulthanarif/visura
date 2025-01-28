import React, { useState } from "react";
import LoginComponent from "../../components/auth/organism/LoginComponent";
import { login } from "../../utils/authHelpers";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);

      if (response.ok) {
        toast.success("Anda berhasil login!", {
            duration: 2000,
            position: "top-center",
            style: {
                backgroundColor: "#34C759", 
                color: "#FFFFFF",
                borderRadius: "8px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
                padding: "16px", 
            },
            iconTheme: {
                primary: "#FFFFFF", 
                secondary: "#34C759", 
            },
        });
    
          setErrorMessage("");
         const { user } = response;
        if (user.role === "admin") {
            router.push("/admin");
        } else if (user.role === "user") {
            router.push("/upload-test");
        } else {
            router.push("/");
        }
        } else {
        toast.error(response?.message || "Terjadi kesalahan, coba lagi.", {
          duration: 5000,
          position: "top-center",
        });
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