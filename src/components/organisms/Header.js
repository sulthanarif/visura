//component/organisms/Header.js
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Icon from '../atoms/Icon';
import ProfileCard from '../molecules/ProfileCard';

function Header() {
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header relative">
      <Image 
        alt="Summarecon Logo" 
        height={40} 
        src="/assets/Summarecon_Agung 1.svg" 
        width={150} 
      />
      <nav>
        <a href="/upload">Scan Files</a>
        <a href="#">Library</a>
      </nav>
      <div 
        ref={profileRef}
        className="relative"
      >
        <div 
          className="user-info cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors"
          onClick={() => setShowProfile(!showProfile)}
        >
          <Icon name='user-circle'/>
          <span>Halo, Setiabudi</span>
        </div>
        
        {showProfile && (
          <div className="absolute right-1 mt-4 w-100 rounded-lg shadow-xl transition-all duration-200 ease-in-out transform origin-top">
            <ProfileCard />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;