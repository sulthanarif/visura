import React, { useState } from "react";
import SignupComponent from "../../components/auth/organism/SignupComponent";
import { signup } from "../../utils/authSignup";  // Impor signup helper
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const SignupPage = () => {
    const router = useRouter(); 
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (credentials) => {
    try {
      const { ok, message, redirectUrl } = await signup(credentials);

      if (ok) {
        toast.success(
          <div style={{ minWidth: "350px", maxWidth: "600px" ,  whiteSpace: "nowrap", textAlign :"center", 
            textOverflow: "ellipsis",}}>
            Kode OTP sukses terkirim ke {credentials.email.toLowerCase()}
          </div>,
          {
            duration: 8000,
            position: "top-center",
            style: {
              
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              minWidth: "400px", 
              maxWidth: "600px", 
            },
          }
        );
        if (redirectUrl) {
         
          setTimeout(() => router.push(redirectUrl), 0);
        }
      } else {
        setErrorMessage(message); 
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server.");
    }
  };

  return (
    <div style={{ 
    height: "100vh", 
    overflowY: "auto" 
  }}>
    <SignupComponent onSubmit={handleSignup} errorMessage={errorMessage} />
  </div>
  );
};

export default SignupPage;
