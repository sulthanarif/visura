// components/molecules/Logo.js
import React from 'react';
import Image from 'next/image';
import Icon from '../atoms/Icon';

const Logo = ({ onMenuToggle }) => {
  return (
     <div className="flex items-center justify-between w-full sm:w-auto mb-2 sm:mb-0">
         <Image
            alt="Summarecon Logo"
            height={40}
            src="/assets/Summarecon_Agung 1.svg"
            width={150}
            className="max-w-[100px] sm:max-w-[100px]"
        />
        {/* Mobile Menu Button */}
        <button
            className="sm:hidden"
            onClick={onMenuToggle}
         >
            <Icon name="bars" />
        </button>
    </div>
    )
}
export default Logo;