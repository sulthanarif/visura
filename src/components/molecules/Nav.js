// components/molecules/Nav.js
import React, { useState, useRef, useEffect } from 'react';
import NavLink from '../atoms/NavLink';
import Icon from '../atoms/Icon';

const NavItem = ({ href, label, subItems }) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    const handleMouseEnter = () => {
      setDropdownVisible(true);
  };

    const handleDropdownMouseEnter = () => {
         setDropdownVisible(true);
     };

   const handleDropdownMouseLeave = () => {
      setDropdownVisible(false);
   };


    useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
           setDropdownVisible(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);
    return (
         <div
            className="relative group"
            onMouseEnter={handleMouseEnter}

        >
            <NavLink href={href} className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-200">
                {label}
              {subItems && subItems.length > 0 && (
                <Icon name="chevron-down" className="ml-1 w-4 h-4 transition-transform transform group-hover:rotate-180" />
               )}
            </NavLink>
            {subItems && subItems.length > 0 && isDropdownVisible && (
            <div
               ref={dropdownRef}
                className="absolute  bg-white shadow-lg mt-2 rounded-md min-w-[160px] z-10"
                 onMouseEnter={handleDropdownMouseEnter}
                 onMouseLeave={handleDropdownMouseLeave}
            >
              {subItems.map((subItem, index) => (
                  <NavLink
                      key={index}
                      href={subItem.href}
                     className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition-colors duration-200 rounded-md"
                   >
                      {subItem.label}
                  </NavLink>
               ))}
           </div>
            )}
        </div>
    );
};

const Nav = ({ user }) => {
    const navItems = [
        {
            role: 'admin',
            items: [
                { href: '/admin/users', label: 'Users' },
                { href: '/admin/scanfile', label: 'Scan Files' },
                {
                    label: 'Library',
                    subItems: [
                        { href: '/admin/library/myprojects', label: 'My Projects' },
                        { href: '/admin/library/projects', label: 'All Projects' },
                        
                    ],
                },
            ],
        },
        {
            role: 'user',
            items: [
                { href: '/scanfile', label: 'Scan Files' },
                { href: '/myprojects', label: 'My Projects' },
            ],
        },
    ];

    const renderNavItems = () => {
        const userNavItems = navItems.find((nav) => nav.role === user?.role);
        if (userNavItems) {
            return userNavItems.items.map((item, index) => (
                <NavItem key={index} href={item.href} label={item.label} subItems={item.subItems} />
            ));
        }
        return null;
    };

    return (
        <nav className="w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
            {renderNavItems()}
        </nav>
    );
};

export default Nav;