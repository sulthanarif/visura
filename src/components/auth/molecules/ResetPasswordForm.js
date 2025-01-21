import React, { useState } from "react";
import InputField from "../atoms/InputField";
import Button from "../atoms/Button";
import { useRouter } from "next/router";

const ResetPasswordForm = ({ onSubmit = () => {} }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleToggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleToggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Password harus diisi");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Password tidak cocok");
      return;
    }

    setErrorMessage("");
    onSubmit(newPassword); // Kirim email ke parent component untuk memproses pengiriman OTP
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {/* Input Email */}
      <label>Masukkan Password Baru</label>
      <div className="relative">
        <InputField
          type={showNewPassword ? "text" : "password"}
          placeholder="Masukkan Password Baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={handleToggleNewPassword}
          className="absolute top-4 right-3"
        >
          <img
            src={showNewPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
            className="w-6 h-6"
          />
        </button>
      </div>

      <label>Masukkan Konfirmasi Password Baru</label>
      <div className="relative">
        <InputField
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Masukkan Konfirmasi Password Baru"
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
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      <div className="flex justify-center items-center mt-6">
        <button
          type="submit"
          className={`w-full px-11 py-3 rounded-md ${
            !newPassword || !confirmPassword
              ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
              : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
          }`}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
          disabled={!confirmPassword}
        >
          Konfirmasi
        </button>
      </div>
    </form>
  );
}

export default ResetPasswordForm;


