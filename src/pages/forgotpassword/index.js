import React, { useState } from "react";
import ForgotPasswordComponent from "../../components/auth/organism/ForgotPasswordComponent";
import { forgotPassword } from "../../utils/authForgotpassword";
import { toast } from 'react-hot-toast';
const ForgotPasswordPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleForgotPassword = async ({ email }) => {
    try {
      const { ok, message, redirectUrl } = await forgotPassword({ email });

      if (ok) {
        if (redirectUrl) {
          window.location.href = redirectUrl; // Redirect ke halaman reset password
        }
      } else {
        toast.error(message, {
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Email invalid atau belum terverifikasi.", {
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
