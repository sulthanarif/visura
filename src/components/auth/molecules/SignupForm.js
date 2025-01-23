import React, { useState } from "react"; 
import InputField from "../atoms/InputField";
import { useRouter } from "next/router";
import { CheckCircle, XCircle } from "lucide-react";

const SignupForm = ({ onSubmit, errorMessage }) => {
  const [namaPegawai, setNamaPegawai] = useState("");
  const [nomorPegawai, setNomorPegawai] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd) => {
    return {
      length: pwd.length >= 6,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      match: password === confirmPassword
    };
  };

  const passwordValidation = validatePassword(password);

  const renderValidationIcon = (isValid) => 
    isValid 
      ? <CheckCircle className="text-green-500 inline-block ml-2" size={20} /> 
      : <XCircle className="text-red-500 inline-block ml-2" size={20} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = Object.values(passwordValidation).every(v => v);
    if (!isValid) return;

    setIsLoading(true); 
    try {
      if (onSubmit) {
        await onSubmit({ namaPegawai, nomorPegawai, email, password });
      }
    } catch (error) {
      console.error(error);
      setIsButtonDisabled(true); 
      setTimeout(() => setIsButtonDisabled(false), 1000); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <InputField
          type="text"
          placeholder="Nama Pegawai"
          value={namaPegawai}
          onChange={(e) => setNamaPegawai(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <InputField
          type="text"
          placeholder="Nomor Pegawai"
          value={nomorPegawai}
          onChange={(e) => {
            const value = e.target.value;
            const onlyNumber = value.replace(/\D/g, "");
            setNomorPegawai(onlyNumber);
          }}
          pattern="[0-9]*"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <InputField
          type="email"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="relative space-y-2">
        <InputField
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-2 right-3"
        >
          <img
            src={showPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
            className="w-6 h-6"
          />
        </button>
      </div>
<div className="relative space-y-2">
        <InputField
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute top-2 right-3"
        >
          <img
            src={showConfirmPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
            className="w-6 h-6"
          />
        </button>
      </div>
      {password && (
        <div className="space-y-0">
          <p className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
            Minimal 6 karakter {renderValidationIcon(passwordValidation.length)}
          </p>
          <p className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
            Mengandung huruf kapital {renderValidationIcon(passwordValidation.uppercase)}
          </p>
          <p className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}`}>
            Mengandung huruf kecil {renderValidationIcon(passwordValidation.lowercase)}
          </p>
          <p className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-red-500'}`}>
            Mengandung angka {renderValidationIcon(passwordValidation.number)}
          </p>
        </div>
      )}

      {password && confirmPassword && !passwordValidation.match && (
        <p className="text-red-500">
          Password dan konfirmasi password tidak sesuai
        </p>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex justify-between items-center">
        <p>
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => router.push("login")}
            className="text-[#E17218] hover:underline"
          >
            Masuk Akun
          </button>
        </p>
      </div>
      <button
  type="submit"
  className={`w-full px-11 py-3 rounded-full text-white transition-colors duration-300 ${
    isLoading || isButtonDisabled
      ? "bg-gray-400 cursor-not-allowed"
      : (namaPegawai &&
          nomorPegawai &&
          email &&
          password &&
          confirmPassword &&
          Object.values(passwordValidation).every((v) => v)) // Memastikan semua field terisi dan validasi password
      ? "bg-[#008C28] hover:bg-green-700"
      : "bg-[#A6A6A6] cursor-not-allowed"
  }`}
  disabled={
    isLoading ||
    isButtonDisabled ||
    !namaPegawai ||
    !nomorPegawai ||
    !email ||
    !password ||
    !confirmPassword ||
    !Object.values(passwordValidation).every((v) => v) // Pastikan validasi password terpenuhi
  }
>
  {isLoading ? (
    <div className="loader"></div>
  ) : (
    "Buat Akun"
  )}
</button>

    </form>
  );
};

export default SignupForm;