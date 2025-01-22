import { useRouter } from "next/router";
import React, { useState } from "react";
import ForgotPasswordComponent from "../../components/auth/organism/ForgotPasswordComponent";
import { forgotPassword } from "../../utils/authForgotpassword";
import { toast } from "react-hot-toast";

const ForgotPasswordPage = () => {
  const router = useRouter(); // Inisialisasi useRouter
  const [errorMessage, setErrorMessage] = useState("");

  const handleForgotPassword = async ({ email }) => {
    try {
      const { ok, message, redirectUrl } = await forgotPassword({ email });

      if (ok) {
        toast.success(
          <div style={{ minWidth: "400px", maxWidth: "600px" ,  whiteSpace: "nowrap", textAlign :"center", 
            textOverflow: "ellipsis",}}>
            Kode OTP sukses terkirim ke {email}
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
        toast.error(message, {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Email tidak valid atau belum terverifikasi.", {
        duration: 5000,
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <ForgotPasswordComponent onSubmit={handleForgotPassword} errorMessage={errorMessage} />
    </div>
  );
};

export default ForgotPasswordPage;
