// src/components/auth/organism/ResetPasswordPage.js
import React from "react";
import router from "next/router"; // Import router
import ResetPasswordForm from "../molecules/ResetPasswordForm"; // Import ResetPasswordForm
import WallpaperSlider from "../molecules/WallpaperSlider"; // Import WallpaperSlider
import { useRouter } from "next/router";
const ResetPasswordPage = ({
  onSubmit,
  onResend,
  errorMessage,
  containerStyles = "",
  titleStyles = "",
  backgroundStyles = "",
  email,
  nomorPegawai, 
}) => {
  const router = useRouter();
  return (
    <div className={`relative min-h-screen`}>
      {/* Menampilkan WallpaperSlider secara langsung tanpa pengecekan */}
      <WallpaperSlider />
      <div
        className={`absolute inset-0 flex items-start justify-start ${containerStyles}`}
      >
        <div
          className={`w-full max-w-md p-7 bg-[#FDFBF8] shadow-md rounded-lg relative`}
          style={{
            borderRadius: "20px",
            marginLeft: "75px",
            marginTop: "50px",
            paddingTop: "40px",
            zIndex: 10, // Pastikan form di atas wallpaper
          }}
        >
          {/* Pseudo-element for decoration */}
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
            <div
              style={{
                flex: "0 0 25%",
                height: "100%",
                backgroundColor: "#005919",
                borderRadius: "20px 0 0 0",
              }}
            ></div>
            <div
              style={{
                flex: "0 0 15%",
                height: "100%",
                backgroundColor: "#f1de03",
              }}
            ></div>
            <div
              style={{
                flex: "0 0 10%",
                height: "100%",
                backgroundColor: "#eba900",
              }}
            ></div>
            <div
              style={{
                flex: "0 0 50%",
                height: "100%",
                backgroundColor: "#e07318",
                borderRadius: "0 20px 0 0",
              }}
            ></div>
          </div>

          <div className="flex flex-col items-start justify-start">
            {/* <div className="mb-1 ml-4">
              <img
                src="/assets/Summarecon_Agung 1.svg"
                alt="Logo Summarecon Agung"
                className="w-50 h-20"
              />
            </div> */}

            <div className="mt-1 flex justify-start ml-4 mb-2">
              <img
                src="/assets/visura_logo.png"
                alt="Logo Scanner"
                className="w-31 h-15"
              />
            </div>
          </div>
          
     
    

          {/* Form Reset Password */}
          <ResetPasswordForm
            onSubmit={onSubmit}
            onResend={onResend}
            errorMessage={errorMessage}
            email={email}
         
            nomorPegawai={nomorPegawai || ""}
          />

 {/* Link Kembali ke Login */}
 <div className="flex justify-center items-center mt-5 space-x-4">
            <button
              type="button"
              onClick={() => router.push("login")}
              className="text-[#E17218] hover:underline flex items-center"
            >
              <img
                src="/assets/arrow_left.svg"
                className="w-6 h-6 mr-2"
                alt="Arrow Left"
              />
              Kembali ke Login
            </button>
          </div>

        </div>
        
      </div>
    </div>
  );
};

export default ResetPasswordPage;
