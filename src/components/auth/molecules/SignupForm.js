import React, { useState } from "react"; 
import InputField from "../atoms/InputField";
import { useRouter } from "next/router";

const SignupForm = ({ onSubmit, errorMessage }) => {
  const [namaPegawai, setNamaPegawai] = useState("");
  const [nomorPegawai, setNomorPegawai] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State untuk loading
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State debounce tombol
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validateForm = () => password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    <form onSubmit={handleSubmit} className="p-4">
      {/* Input Nama Pegawai */}
      <InputField
        type="text"
        placeholder="Nama Pegawai"
        value={namaPegawai}
        onChange={(e) => setNamaPegawai(e.target.value)}
      />

      {/* Input Nomor Pegawai */}
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
      />

      {/* Input Email */}
      <InputField
        type="email"
        placeholder="Masukkan Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Input Password */}
      <div className="relative">
        <InputField
          type={showPassword ? "text" : "password"}
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute top-4 right-3"
        >
          <img
            src={showPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Input Konfirmasi Password */}
      <div className="relative">
        <InputField
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={handleToggleConfirmPassword}
          className="absolute top-4 right-3"
        >
          <img
            src={showConfirmPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Pesan Error */}
      {password && confirmPassword && password !== confirmPassword && (
        <p className="text-red-500 mt-2">
          Password dan konfirmasi password tidak sesuai
        </p>
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Link ke halaman login dan Tombol */}
      <div className="flex justify-between items-center mt-4">
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

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          type="submit"
          className={`w-full px-11 py-3 rounded-md ${
            isLoading || isButtonDisabled
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : !namaPegawai ||
                !nomorPegawai ||
                !email ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
              : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
          }`}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
          disabled={
            isLoading ||
            isButtonDisabled ||
            !namaPegawai ||
            !nomorPegawai ||
            !email ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword
          }
        >
          {isLoading ? (
            <div className="loader"></div> 
          ) : (
            "Buat Akun"
          )}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
