import React, { useState } from "react";
import ResetPasswordForm from "../molecules/ResetPasswordForm";
import OTPsignupconfirmationForm from "../molecules/OTPsignupconfirmationForm";
import WallpaperSlider from "../molecules/WallpaperSlider";
import { useRouter } from "next/router";

const ResetPasswordComponent = ({
  onSubmit,
  errorMessage,
  onResend,
  email,
  containerStyles = "",
}) => {
  const router = useRouter();
  const [currentForm, setCurrentForm] = useState(0); // 0: OTP form, 1: Reset Password form

  // Fungsi untuk berpindah antar form
  const handleSwipe = (index) => {
    setCurrentForm(index);
  };

  return (
    <div className={`relative min-h-screen`}>
      {/* Wallpaper Slider */}
      <WallpaperSlider />
      <div
        className={`absolute inset-0 flex items-start justify-start ${containerStyles}`}
      >
        <div
          className={`w-full max-w-md p-7 bg-[#FDFBF8] shadow-md rounded-lg relative`}
          style={{
            borderRadius: "20px",
            marginLeft: "75px", // Posisi kiri
            marginTop: "50px", // Jarak dari atas
            zIndex: 10, // Form berada di atas wallpaper
          }}
        >
          {/* Header dan Logo */}
          <div className="flex flex-col items-start justify-start">
            <div className="mb-1 ml-4">
              <img
                src="/assets/Summarecon_Agung 1.svg"
                alt="Logo Summarecon Agung"
                className="w-50 h-20"
              />
            </div>
            <div className="mt-1 flex justify-start ml-4 mb-4">
              <img
                src="/assets/Summarecon_Scanner.svg"
                alt="Logo Scanner"
                className="w-31 h-15"
              />
            </div>
          </div>

          {/* Form Swipe */}
          <div className="mt-6">
            {currentForm === 0 && (
              <OTPsignupconfirmationForm
                onSubmit={onSubmit}
                onResend={onResend}
                email={email}
                initialErrorMessage={errorMessage}
              />
            )}
            {currentForm === 1 && (
              <ResetPasswordForm onSubmit={onSubmit} errorMessage={errorMessage} />
            )}
          </div>

          {/* Navigation Indicators */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              className={`w-3 h-3 rounded-full ${
                currentForm === 0 ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => handleSwipe(0)}
            ></button>
            <button
              className={`w-3 h-3 rounded-full ${
                currentForm === 1 ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => handleSwipe(1)}
            ></button>
          </div>

          {/* Link Back to Signup */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              type="button"
              onClick={() => router.push("signup")}
              className="text-[#E17218] hover:underline flex items-center"
            >
              <img
                src="/assets/arrow_left.svg"
                className="w-6 h-6 mr-2"
                alt="Arrow Left"
              />
              Kembali ke Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
