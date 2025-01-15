import React, { useState } from "react";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { useRouter } from "next/router";

const LoginForm = ({ onSubmit, errorMessage }) => {
  const [pegawaiNumber, setPegawaiNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah form melakukan reload
    if (!validateForm()) return; // Pastikan form valid
  
    // Panggil onSubmit dari props untuk mengirimkan data
    if (onSubmit) {
      onSubmit({ pegawaiNumber, password });
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
        onChange={(e) => setPegawaiNumber(e.target.value)}
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
          className={`px-11 py-3 rounded-md ${
            !pegawaiNumber || !password
              ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
              : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
          }`}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
          disabled={!pegawaiNumber || !password}
        >
          Masuk Akun
        </button>
        <button
          type="button"
          onClick={() => router.push("/signup")}
          className={`px-11 py-3 text-white bg-[#E17218] hover:bg-[#c35d14] rounded-md`}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
        >
          Daftar Akun
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
