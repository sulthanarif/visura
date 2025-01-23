import React, { useState, useEffect } from "react";
import InputField from "../atoms/InputField";
import InputOtpField from "../atoms/InputOtpField";

const ResetPasswordForm = ({ email, onResend, onSubmit }) => {
  // State untuk OTP, password, dan konfirmasi password
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLinkDisabled, setIsLinkDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  // Timer countdown logic
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

  // Validasi password
  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password harus minimal 6 karakter.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password harus ada huruf kapital, kecil, dan angka.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password harus ada huruf kapital, kecil, dan angka.";
    }
    if (!/\d/.test(password)) {
      return "Password harus ada huruf kapital, kecil, dan angka.";
    }
    return "";
  };

  // Menangani perubahan OTP
  const handleOtpChange = (e) => {
    setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
  };

  // Menangani perubahan password
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    const validationError = validatePassword(value);
    if (validationError) {
      setErrorMessage(validationError);
    } else if (confirmPassword && value !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak sesuai.");
    } else {
      setErrorMessage("");
    }
  };

  // Menangani perubahan confirm password
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (newPassword && value !== newPassword) {
      setErrorMessage("Password dan konfirmasi password tidak sesuai.");
    } else {
      const validationError = validatePassword(newPassword);
      setErrorMessage(validationError || "");
    }
  };

  // Menangani pengiriman OTP
  const handleResendOtp = (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setIsLinkDisabled(true);
      setTimer(60);
      onResend(email);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Menangani submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp && newPassword && confirmPassword && newPassword === confirmPassword) {
      onSubmit(otp, newPassword);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* Input OTP */}
      <InputOtpField
        type="tel"
        inputMode="numeric"
        placeholder="Masukkan Kode OTP"
        value={otp}
        onChange={handleOtpChange}
        maxLength={6}
      />

      {/* Tombol Kirim Ulang OTP */}
      <div className="text-left mt-2">
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

      {/* Input Password Baru */}
      <div className="relative mt-4">
        <InputField
          type="password"
          placeholder="Masukkan Password Baru"
          value={newPassword}
          onChange={handlePasswordChange}
        />
      </div>

      {/* Input Konfirmasi Password Baru */}
      <div className="relative mt-4">
        <InputField
          type="password"
          placeholder="Konfirmasi Password Baru"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>

      {/* Pesan Error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Tombol Reset Password */}
      <button
        type="submit"
        className={`w-full px-11 py-3 mt-6 rounded-md  ${
          !otp || !newPassword || !confirmPassword || newPassword !== confirmPassword
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            :  "bg-[#008C28] text-white hover:bg-green-600"
        }`}
        style={{ borderRadius: "30px" }}
        disabled={!otp || !newPassword || !confirmPassword || newPassword !== confirmPassword}
      >
        Reset Password
       
      </button>
    </form>
  );
};

export default ResetPasswordForm;
