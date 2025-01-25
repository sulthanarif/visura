// components/organisms/Header.js
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Icon from '../atoms/Icon';
import ProfileCard from '../molecules/ProfileCard';
import { useRouter } from 'next/router';
import { decodeToken } from '../../utils/authHelpers';
import ProfileModalTailwind from '../molecules/ProfileModal';
import ChangePasswordModal from '../molecules/ChangePasswordModal';

const Header = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const profileRef = useRef(null);
    const [user, setUser] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = decodeToken(token);
            setUser(decoded);
        }
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = decodeToken(token);
                setUser(decoded);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [updateTrigger]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        setShowProfileModal(true);
        setShowProfile(false);
    };

   const handlePasswordChangeClick = () => {
         setShowPasswordModal(true);
          setShowProfile(false);
     };

    const handleModalClose = () => {
        setShowProfileModal(false);
    };

     const handlePasswordModalClose = () => {
          setShowPasswordModal(false);
     };

     const handlePasswordUpdated = () => {
         localStorage.removeItem('token');
         router.push('/login');
     };

    const handleUpdateUser = () => {
        setUpdateTrigger(prev => prev + 1);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };
    const NavItem = ({ href, children }) => {
        const router = useRouter();
        const isActive = router.pathname === href;
        
        return (
            <a 
                href={href}
                className={`px-4 py-2 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors duration-200 ${
                    isActive ? 'text-black-600 font-bold' : 'text-gray-700'
                }`}
            >
                {children}
            </a>
        );
    };

    const renderNavItems = () => {
        if (user?.role === 'admin') {
            return (
                <>
                    <NavItem href="/admin">Dashboard</NavItem>
                    <NavItem href="/admin/users">Users</NavItem>
                    <NavItem href="/admin/library">Library</NavItem>
                </>
            );
        } else if (user?.role === 'user') {
            return (
                <>
                    <NavItem href="/upload-test">Scan Files</NavItem>
                    <NavItem href="/library">Library</NavItem>
                </>
            );
        }
        return null;
    };

    return (
        <header className="relative flex flex-col sm:flex-row items-center justify-between p-4 bg-white">
            {/* Logo Section */}
            <div className="flex items-center justify-between w-full sm:w-auto mb-4 sm:mb-0">
                <Image
                    alt="Summarecon Logo"
                    height={40}
                    src="/assets/Summarecon_Agung 1.svg"
                    width={150}
                    className="max-w-[120px] sm:max-w-[150px]"
                />
                {/* Mobile Menu Button - You can add a hamburger menu here if needed */}
                <button
                    className="sm:hidden"
                    onClick={() => {
                        const nav = document.querySelector('nav');
                        nav.classList.toggle('hidden');
                    }}
                >
                    <Icon name="bars" />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className="w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
                {renderNavItems()}
            </nav>

            {/* Profile Section */}
            <div ref={profileRef} className="relative w-full sm:w-auto mt-4 sm:mt-0">
                <div
                    className="user-info cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors flex items-center justify-center sm:justify-start space-x-2"
                    onClick={() => setShowProfile(!showProfile)}
                >
                    <Icon name='user-circle'/>
                    <span className="text-sm sm:text-base">Halo, {user?.nama_pegawai || 'Guest'}</span>
                </div>

                {showProfile && (
                    <div className="absolute right-0 sm:right-1 mt-2 w-full sm:w-64 rounded-lg shadow-xl transition-all duration-200 ease-in-out transform origin-top z-50">
                        <ProfileCard user={user} onLogout={handleLogout} onProfileClick={handleProfileClick} onPasswordChangeClick={handlePasswordChangeClick} />
                    </div>
                )}
            </div>

            {/* Modals */}
           {showProfileModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <ProfileModalTailwind user={user} onClose={handleModalClose} onUpdateUser={handleUpdateUser} />
                 </div>
            )}
            {showPasswordModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <ChangePasswordModal user={user} onClose={handlePasswordModalClose} onPasswordUpdated={handlePasswordUpdated} />
                 </div>
            )}
        </header>
    );
};

export default Header;