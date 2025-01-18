import React, { useState, useEffect } from "react";
import InputOtpField from "../atoms/InputOtpField";
import { useRouter } from "next/router";

const OTPsignupconfirmationForm = ({ onSubmit = () => {}, email = "" }) => {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLinkDisabled, setIsLinkDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const router = useRouter();

  useEffect(() => {
    let interval;
    if (isLinkDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsLinkDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); 
  }, [isLinkDisabled]);

  const handleResendOtp = () => {
    setIsLinkDisabled(true); 
    setTimer(30); 
  
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
  
    if (!otp || otp.length !== 6) {
      setErrorMessage("Kode OTP harus terdiri dari 6 digit.");
      return;
    }
  
    setErrorMessage(""); // Reset pesan error sebelum memulai
    setIsLinkDisabled(true); // Disable link untuk resend OTP sementara
  
    try {
      const result = await onSubmit(otp, email); // Menunggu hasil dari fungsi onSubmit
  
      console.log("Result from onSubmit:", result); // Log hasil dari onSubmit
  
      if (result && !result.ok) {
        console.error("Error result:", result.message); // Log error result jika ada masalah
        setErrorMessage(result.message || "Terjadi kesalahan saat verifikasi OTP.");
        setIsLinkDisabled(false); // Re-enable resend link jika error
      }
    } catch (error) {
      console.error("Error submitting OTP:", error);
      setErrorMessage(error.message || "Terjadi kesalahan yang tidak terduga.");
      setIsLinkDisabled(false); // Re-enable resend link jika error
    }
  };
  
  

 return (
  <form onSubmit={handleOtpSubmit} className="p-4">
    {/* Input OTP */}
    <InputOtpField
      type="tel"
      inputMode="numeric"
      placeholder="Masukkan Kode OTP"
      value={otp}
      onChange={(e) => {
        // Hanya menerima angka, menghapus karakter yang tidak diinginkan
        const input = e.target.value.replace(/[^0-9]/g, '').slice(0, 6); // Menghapus karakter non-angka
        setOtp(input);
      }}
      maxLength={6}
    />
  

      {/* Pesan Error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Resend OTP Link */}
      <div className="text-left mt-2 ml-1">
        <button
          type="button"
          className={`text-[#E17218] underline ${
            isLinkDisabled ? "cursor-not-allowed text-gray-400" : "hover:text-orange-600"
          }`}
          onClick={handleResendOtp}
          disabled={isLinkDisabled}
        >
          Kirim ulang kode OTP {isLinkDisabled && `(${timer})`}
        </button>
      </div>

      {/* Tombol Submit */}
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
