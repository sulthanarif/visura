import React, { useState } from "react";
import WallpaperSlider from "../molecules/WallpaperSlider";
import ResetPasswordWithOTPForm from "../molecules/ResetPasswordForm";

const ResetPasswordComponent = ({
  email,
  onSubmit,
  onResend,
  errorMessage,
  containerStyles = "",
}) => {
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // Update form data
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validasi tombol submit
  const isSubmitDisabled =
    !formData.otp ||
    !formData.password ||
    !formData.confirmPassword ||
    formData.password !== formData.confirmPassword;

  return (
    <div className="relative min-h-screen">
      {/* Slider Wallpaper */}
      <WallpaperSlider />

      {/* Kontainer Form */}
      <div className={`absolute inset-0 flex items-start justify-start ${containerStyles}`}>
        <div
          className={`w-full max-w-md p-7 bg-[#FDFBF8] shadow-md rounded-lg relative`}
          style={{
            borderRadius: "20px",
            marginLeft: "75px",
            marginTop: "50px",
            paddingTop: "40px",
            zIndex: 10,
          }}
        >
          {/* Decoration header */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "18px",
              display: "flex",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <div style={{ flex: "0 0 25%", height: "100%", backgroundColor: "#005919", borderRadius: "20px 0 0 0" }}></div>
            <div style={{ flex: "0 0 15%", height: "100%", backgroundColor: "#f1de03" }}></div>
            <div style={{ flex: "0 0 10%", height: "100%", backgroundColor: "#eba900" }}></div>
            <div style={{ flex: "0 0 50%", height: "100%", backgroundColor: "#e07318", borderRadius: "0 20px 0 0" }}></div>
          </div>


          {/* Logo dan Deskripsi */}
          <div className="mb-6">
            <img
              src="/assets/Summarecon_Agung 1.svg"
              alt="Logo Summarecon Agung"
              className="w-50 h-20 mb-2"
            />
            <img
              src="/assets/Summarecon_Scanner.svg"
              alt="Logo Scanner"
              className="w-31 h-15 mb-4"
            />
            <p className="ml-2 text-left text-sm">
              Masukkan kode OTP dan password baru Anda
            </p>
            <p className="text-xs text-gray-500">Email: {email}</p>
          </div>

          {/* Form Gabungan (OTP dan Reset Password) */}
          <ResetPasswordWithOTPForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={onSubmit}
            onResend={onResend}
            errorMessage={errorMessage}
            isSubmitDisabled={isSubmitDisabled}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
