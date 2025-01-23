import React, { useEffect, useState } from "react";
import InputOtpField from "../atoms/InputOtpField"; // Pastikan Anda sudah membuat komponen InputOtpField

const OTPResetForm = ({ otp, onOtpChange, onResend, email }) => {
  const [isLinkDisabled, setIsLinkDisabled] = useState(true);
  const [timer, setTimer] = useState(60); // Timer countdown mulai dari 60 detik

  // Timer countdown logic
  useEffect(() => {
    if (!isLinkDisabled) return; // Hanya jalankan timer jika tombol masih disabled

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLinkDisabled(false); // Aktifkan tombol setelah timer selesai
          return 60;
        }
        return prev - 1;
      });
    }, 1000); // Update setiap detik

    return () => clearInterval(interval); // Hentikan timer saat komponen dibuang
  }, [isLinkDisabled]);

  // Handler untuk tombol kirim ulang OTP
  const handleResendOtp = async (e) => {
    e.preventDefault(); // Mencegah form melakukan submit
    if (!email) return; // Pastikan email ada
    try {
      setIsLinkDisabled(true); // Nonaktifkan tombol kirim ulang
      setTimer(60); // Setel timer ke 60 detik
      await onResend(email); // Panggil fungsi untuk mengirim OTP ulang
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  return (
    <form className="p-4">
      {/* Input OTP menggunakan InputOtpField */}
      <InputOtpField
        type="tel"
        inputMode="numeric"
        placeholder="Masukkan Kode OTP"
        value={otp}
        onChange={(e) =>
          onOtpChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 6)) // Hanya menerima angka 6 digit
        }
        maxLength={6} // Hanya menerima 6 karakter
      />

      <div className="text-left mt-2">
        <button
          type="button"
          className={`text-[#E17218] underline ${
            isLinkDisabled
              ? "cursor-not-allowed text-gray-400"
              : "hover:text-orange-600"
          }`}
          onClick={handleResendOtp}
          disabled={isLinkDisabled} // Menonaktifkan tombol jika timer belum selesai
        >
          Kirim ulang kode OTP {isLinkDisabled && `(${timer})`} {/* Menampilkan countdown */}
        </button>
      </div>
    </form>
  );
};

export default OTPResetForm;
