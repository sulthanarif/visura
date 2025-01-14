import React from "react";

const AuthLayout = ({ children, showBackgroundImage }) => {
  return (
    <div className="relative min-h-screen">
      {showBackgroundImage && <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" />}
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
