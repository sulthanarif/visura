// components/atoms/NavLink.js
import React from 'react';
import { useRouter } from 'next/router';

const NavLink = ({ href, children }) => {
    const router = useRouter();
    const isActive = router.pathname === href;

    return (
        <a
            href={href}
            className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${
                isActive ? 'text-black font-semibold' : 'text-gray-700 hover:text-[#E17218] hover:bg-[#EBA801]/10'
            }`}
        >
            {children}
        </a>
    );
};

export default NavLink;