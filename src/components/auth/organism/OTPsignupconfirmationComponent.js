import React from "react";
import OTPsignupconfirmationForm from "../molecules/OTPsignupconfirmationForm";
import WallpaperSlider from "../molecules/WallpaperSlider";
import { useRouter } from "next/router";

const OTPsignupconfirmationComponent = ({
  onResend,
  onSubmit,
  errorMessage,
  email,
  containerStyles = "",
  titleStyles = "",
  backgroundStyles = "",
  showBackgroundImage = false,
  backgroundImage = "",
}) => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen">
      <WallpaperSlider />
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

            <div className="ml-5 mt-2 mb-2">
              <h1 className="text-2xl text-left">Masukkan Kode 6 Digit (OTP)</h1>
            </div>

            <div className="ml-5 mt-2 mb-2 text-left text-sm">
              <p>
                Kode Anda telah terkirim ke email yang terdaftar{" "}
                <strong style={{ color: "#E17218" }}>{email}</strong>
              </p>
            </div>
          </div>

          <OTPsignupconfirmationForm
            onSubmit={onSubmit}
            onResend={onResend}
            email={email}
            initialErrorMessage={errorMessage}
          />

          <div className="flex justify-center items-center mt-2 mr-3 space-x-4">
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-[#E17218] hover:underline flex items-center"
            >
              <img
                src="/assets/arrow_left.svg"
                className="w-6 h-6 mr-2"
                alt="Arrow Left"
              />
              Kembali Ke Daftar Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPsignupconfirmationComponent;