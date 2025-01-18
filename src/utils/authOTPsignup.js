// utils/authOTPsignup.js
export const verifyOtp = async ({ email, otp }) => {
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
  
      if (!response.ok) {
        throw new Error("OTP verification failed.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  };
  