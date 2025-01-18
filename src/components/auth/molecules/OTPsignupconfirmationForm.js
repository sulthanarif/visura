import React, { useState } from "react";
import InputOtpField from "../atoms/InputOtpField"; // Import field untuk input OTP
import Button from "../atoms/Button"; // Pastikan Button diimpor dengan benar
import { useRouter } from "next/router";

const OTPsignupconfirmationForm = ({ onSubmit = () => {}, email = "" }) => {
  const [otp, setOtp] = useState(""); // State untuk menyimpan OTP yang dimasukkan
  const [errorMessage, setErrorMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false); // Untuk menonaktifkan tombol saat sedang dalam proses pengiriman
  const router = useRouter();

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setErrorMessage("Kode OTP harus terdiri dari 6 digit.");
      return;
    }

    setErrorMessage("");
    setIsDisabled(true); // Menonaktifkan tombol selama pengiriman
    // Kirim OTP dan email untuk diproses
    onSubmit(otp, email);
  };

  return (
    <form onSubmit={handleOtpSubmit} className="p-4">
      {/* Input OTP */}
      <InputOtpField
        type="number"
        placeholder="Masukkan Kode OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6} // Membatasi panjang input hingga 6 digit
      />

      {/* Pesan Error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Tombol dan Link */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          type="submit"
          className={`w-full px-11 py-3 rounded-md ${isDisabled || otp.length !== 6
            ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
            : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
            }`}
          disabled={isDisabled || otp.length !== 6}
          style={{ borderRadius: "30px", fontWeight: "normal" }}
        >
          {isDisabled ? (
            <div className="loader w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </form>
  );
};

export default OTPsignupconfirmationForm;
