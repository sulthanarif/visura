import React, { useState } from "react";
import InputField from "../atoms/InputField";
import { useRouter } from "next/router";

const LoginForm = ({ onSubmit, errorMessage }) => {
  const [pegawaiNumber, setPegawaiNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const validateForm = () => {
    if (!pegawaiNumber.trim()) {
      alert("Nomor Pegawai harus diisi!");
      return false;
    }
    if (!password.trim()) {
      alert("Password harus diisi!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setIsDisabled(false);
      return;
    }

    setIsDisabled(true); // Disable tombol selama pengiriman
    try {
      if (onSubmit) {
        await onSubmit({ pegawaiNumber, password });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsDisabled(false), 1000); // Aktifkan kembali tombol setelah 1 detik
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* Input Nomor Pegawai */}
      <label>Masukkan Nomor Pegawai</label>
      <InputField
        type="text"
        placeholder="Masukkan Nomor Pegawai"
        value={pegawaiNumber}
        onChange={(e) => {
          const value = e.target.value;
          const onlyNumber = value.replace(/\D/g, "");
          setPegawaiNumber(onlyNumber);
        }}
        pattern="[0-9]*"
      />

      {/* Input Password */}
      <label>Masukkan Password</label>
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

      {/* Pesan Error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Tombol dan Link */}
      <div className="flex justify-between items-center mt-4">
        <p>
          Lupa password?{" "}
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-[#E17218] hover:underline"
          >
            Klik disini
          </button>
        </p>
      </div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          type="submit"
          className={`px-19 py-3 rounded-md flex items-center justify-center ${
            isDisabled || !pegawaiNumber || !password
              ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
              : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
          }`}
          style={{
            borderRadius: "30px",
            fontWeight: "normal",
            height: "48px", 
            width: "172px", 
          }}
          disabled={isDisabled || !pegawaiNumber || !password}
        >
          {isDisabled ? (
            <>
              <div
                className="loader w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin mr-2"
              ></div>
          
            </>
          ) : (
            "Masuk Akun"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="px-11 py-3 text-white bg-[#E17218] hover:bg-[#c35d14] rounded-md"
          style={{ borderRadius: "30px", fontWeight: "normal",  height: "48px", 
            width: "172px", }}
        >
          Daftar Akun
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
