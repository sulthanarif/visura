import React, { useState } from "react";
import InputField from "../atoms/InputField";
import InputOtpField from "../atoms/InputOtpField";
import Button from "../atoms/Button";
import { useRouter } from "next/router";

const ForgotPasswordForm = ({ onSubmit = () => {} }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Email harus diisi");
      return;
    }

    setErrorMessage("");
    onSubmit(email); // Kirim email ke parent component untuk memproses pengiriman OTP
    setShowOtp(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMessage("Kode OTP harus diisi");
      return;
    }

    setErrorMessage("");
    onSubmit(otp); // Kirim OTP ke parent component untuk memproses
    router.push("/reset-password"); // Redirect ke halaman reset-password
  };

  return (
    <form
      onSubmit={showOtp ? handleOtpSubmit : handleSubmit}
      className="p-4"
    >
      {/* Input Email */}
      {!showOtp && (
        <InputField
          type="email"
          placeholder="Masukkan Email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      {/* Input OTP */}
      {showOtp && (
        <InputOtpField
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Masukkan Kode OTP"
        />
      )}

      {/* Pesan Error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      <div className="flex justify-center items-center mt-6">
        <button
          type="submit"
          className={`w-full px-11 py-3 rounded-md ${
            !email && !showOtp
              ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
              : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
          }`}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
          disabled={!email && !showOtp}
        >
          {showOtp ? "Verifikasi Kode OTP" : "Kirim Kode OTP Lewat Email"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;

