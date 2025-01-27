import React, { useEffect, useState } from "react";

const WallpaperSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("left");
  const wallpapers = [
    "/assets/Property 1=Frame 48.png",
    "/assets/Property 2.png",
    "/assets/Property 3.png",
    "/assets/Property 4.png",
    "/assets/Property 1=Frame 48.png", //fix lagging issue throttle screen
    "/assets/Property 2.png",
    "/assets/Property 3.png",
    "/assets/Property 4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % wallpapers.length;
        if (nextIndex === 0) {
          setDirection("right");
        } else {
          setDirection("right");
        }
        return nextIndex;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const getSlideClass = (index) => {
    if (index === currentIndex) {
      return "translate-x-0";
    }
    
    if (direction === "left") {
      return index < currentIndex ? "-translate-x-full" : "translate-x-full";
    } else {
      return index < currentIndex ? "-translate-x-full" : "translate-x-full";
    }
  };

  return (
    <div className="wallpaper-slider">
      {wallpapers.map((wallpaper, index) => (
        <img
          key={wallpaper}
          src={wallpaper}
          alt={`Wallpaper ${index + 1}`}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-in-out ${getSlideClass(index)}`}
          style={{
            position: 'absolute',
            left: 0,
            top: 0
          }}
        />
      ))}
    </div>
  );
};

export default WallpaperSlider;