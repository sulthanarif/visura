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
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); 
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
           style={{ backgroundImage: `url(${images[currentIndex]})` }}>
      </div>
    );
  };
  
  export default WallpaperSlider;
  