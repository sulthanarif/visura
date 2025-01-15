// src/components/auth/molecules/WallpaperSlider.js
import React, { useEffect, useState } from "react";

const WallpaperSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const wallpapers = [
    "/assets/Property 1=Frame 48.png",
    "/assets/Property 2.png",
    "/assets/Property 3.png",
    "/assets/Property 4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % wallpapers.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wallpaper-slider">
      <img
        src={wallpapers[currentIndex]}
        alt="Wallpaper"
        className="w-full h-full object-cover transition-opacity duration-6000 ease-in-out"
      />
    </div>
  );
};

export default WallpaperSlider;