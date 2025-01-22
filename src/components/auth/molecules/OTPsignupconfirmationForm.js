import React, { useState, useEffect } from "react";
import InputOtpField from "../atoms/InputOtpField";
import { useRouter } from "next/router";

const OTPsignupconfirmationForm = ({
  onSubmit,
  onResend,
  email, 
  initialErrorMessage = ""
}) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage);
  const [isLinkDisabled, setIsLinkDisabled] = useState(true); 
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  
  useEffect(() => {
    if (!isLinkDisabled) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLinkDisabled(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLinkDisabled]);

  // Handle resend OTP
  const handleResendOtp = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage("Email tidak ditemukan.");
      return;
    }

    try {
      setIsLinkDisabled(true);
      setErrorMessage("");
      
      const response = await onResend(email);
      
      if (response?.ok) {
        
        setTimer(60); 
      } 
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsLinkDisabled(false); 
      setErrorMessage(error.message || "Terjadi kesalahan pada server.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setErrorMessage("Kode OTP harus terdiri dari 6 digit.");
      return;
    }
    try {
      const result = await onSubmit(otp, email);

      if (result?.ok) {
        setErrorMessage(<span style={{color: "green"}}>Verfikasi berhasil, silahkan login.</span>);

       
      } else {
        setErrorMessage( result.message );
      }
    } catch (error) {
    
    //  setErrorMessage("Kode OTP tidak valid atau sudah expired.");
    
    }
  };

  return (
    <form onSubmit={handleOtpSubmit} className="p-4">
      <InputOtpField
        type="tel"
        inputMode="numeric"
        placeholder="Masukkan Kode OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
        maxLength={6}
      />

      {errorMessage && (
        <p className="text-red-500 mt-2 ml-1">{errorMessage}</p>
      )}

      <div className="text-left mt-2 ml-1">
        <button
          type="button"
          className={`text-[#E17218] underline ${
            isLinkDisabled 
              ? "cursor-not-allowed text-gray-400" 
              : "hover:text-orange-600"
          }`}
          onClick={handleResendOtp}
          disabled={isLinkDisabled}
        >
          Kirim ulang kode OTP {isLinkDisabled && `(${timer})`}
        </button>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          type="submit"
          className={`w-full px-11 py-3 rounded-md ${
            otp.length !== 6
              ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
              : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
          }`}
          disabled={otp.length !== 6}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default OTPsignupconfirmationForm;