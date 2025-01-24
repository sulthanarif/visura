import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import InputField from "../atoms/InputField";
import InputOtpField from "../atoms/InputOtpField";
import { CheckCircle, XCircle } from "lucide-react";

const ResetPasswordForm = ({ email, nomorPegawai, onResend, onSubmit, errorMessage }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLinkDisabled, setIsLinkDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

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

  const validatePassword = (pwd) => ({
    length: pwd.length >= 6,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /\d/.test(pwd),
    match: pwd === confirmPassword,
  });

  const passwordValidation = validatePassword(password);

  const renderValidationIcon = (isValid) =>
    isValid ? (
      <CheckCircle className="text-green-500 inline-block ml-2" size={20} />
    ) : (
      <XCircle className="text-red-500 inline-block ml-2" size={20} />
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword || !Object.values(passwordValidation).every((v) => v)) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ otp, password });
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLinkDisabled(true);
      setTimer(60);
      await onResend(email);
    } catch (error) {
      console.error("Resend OTP Error:", error);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentStage === 0 && otp.length === 6) {
        setCurrentStage(1);
      }
    },
    onSwipedRight: () => {
      if (currentStage === 1) {
        setCurrentStage(0);
      }
    }
  });

  return (
    <div {...swipeHandlers} className="relative overflow-hidden w-full">
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentStage * 50}%)`, width: '200%' }}
      >
        {/* OTP Stage */}
        <div className="w-1/2 p-4 space-y-4">
          <h1 className="text-2xl text-left ml-1">Masukkan Kode 6 Digit (OTP)</h1>
          <p className="text-left ml-1 mt-1 text-sm">
            Kode Anda telah terkirim ke email yang terdaftar <strong style={{ color: "#E17218" }}>{email}</strong>.
          </p>

          <InputOtpField
            type="tel"
            inputMode="numeric"
            placeholder="Masukkan Kode OTP (6 Digit)"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            maxLength={6}
          />
          <div className="text-left ml-1 mt-2">
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

          <button
            className={`w-full px-11 py-3 rounded-full text-white transition-colors duration-300 ${
              otp.length === 6 ? "bg-[#008C28] hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => setCurrentStage(1)}
            disabled={otp.length !== 6}
          >
            Lanjut
          </button>
        </div>

        {/* Password Stage */}
        <div className="w-1/2 p-4 space-y-4">
          <h1 className="text-2xl text-left ml-1">Buat Password Baru</h1>
          <p className="text-left ml-1 mt-1 text-sm">
            Buat Password untuk <strong style={{ color: "#E17218" }}>{email}</strong>, email terdaftar dengan nomor pegawai <strong style={{ color: "#E17218" }}>{nomorPegawai}</strong>.
          </p>

          <div className="relative space-y-2">
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan Password Baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-3"
            >
              <img
                src={showPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
                className="w-6 h-6"
                alt="Toggle Password Visibility"
              />
            </button>
          </div>

          <div className="relative space-y-2">
            <InputField
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password Baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-2 right-3"
            >
              <img
                src={showConfirmPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
                className="w-6 h-6"
                alt="Toggle Confirm Password Visibility"
              />
            </button>
          </div>

          {password && (
            <div className="space-y-0">
              <p className={`flex items-center ${passwordValidation.length ? "text-green-600" : "text-red-500"}`}>
                ◉ Minimal 6 karakter {renderValidationIcon(passwordValidation.length)}
              </p>
              <p className={`flex items-center ${passwordValidation.uppercase ? "text-green-600" : "text-red-500"}`}>
                ◉ Mengandung huruf kapital {renderValidationIcon(passwordValidation.uppercase)}
              </p>
              <p className={`flex items-center ${passwordValidation.lowercase ? "text-green-600" : "text-red-500"}`}>
                ◉ Mengandung huruf kecil {renderValidationIcon(passwordValidation.lowercase)}
              </p>
              <p className={`flex items-center ${passwordValidation.number ? "text-green-600" : "text-red-500"}`}>
                ◉ Mengandung angka {renderValidationIcon(passwordValidation.number)}
              </p>
            </div>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div className="flex space-x-4">
            <button
              type="button"
              className="w-1/2 px-11 py-3 rounded-full text-white transition-colors duration-300 bg-[#E17218] hover:bg-orange-700"
              onClick={() => setCurrentStage(0)}
            >
              Kembali
            </button>
            <button
              type="submit"
              className={`w-1/2 px-11 py-3 rounded-full text-white transition-colors duration-300 ${
                isLoading || !Object.values(passwordValidation).every((v) => v)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#008C28] hover:bg-green-700"
              }`}
              onClick={handleSubmit}
              disabled={isLoading || !Object.values(passwordValidation).every((v) => v)}
            >
              {isLoading ? <div className="loader"></div> : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;