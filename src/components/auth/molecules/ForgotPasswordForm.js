import React, { useState } from "react";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { useRouter } from "next/router";

const ForgotPasswordForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
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
    router.push("/auth/reset-password"); // Redirect ke halaman reset-password
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* Input Email */}
      <InputField
        type="email"
        placeholder="Masukkan Email Anda"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Pesan Error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      <div className="flex justify-center items-center mt-6">
  <button
    type="submit"
    className={`w-full px-11 py-3 rounded-md ${
      !email
        ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
        : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
    }`}
    style={{ borderRadius: "30px", fontWeight: "normal" }}
    disabled={!email}
  >
    Kirim Kode OTP Lewat Email
  </button>
</div>

   
    </form>
  );
};

export default ForgotPasswordForm;
