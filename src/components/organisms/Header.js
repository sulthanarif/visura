// src/components/organisms/Header.js
import React from 'react';
import Image from 'next/image';
import Icon from '../atoms/Icon';
function Header() {
  return (
    <header className="header">
        <Image alt="Summarecon Logo" height={40} src="/assets/Summarecon_Agung 1.svg" width={150} />
      <nav>
          <a href="#">Scan Files</a>
          <a href="#">Library</a>
      </nav>
      <div className="user-info">
        <Icon name='user-circle'/>
        <span>Halo, Setiabudi</span>
      </div>
    </header>
  );
}

export default Header;