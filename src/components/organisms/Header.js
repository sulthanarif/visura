// components/organisms/Header.js
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { decodeToken } from '../../utils/authHelpers';
import ProfileModal from '../molecules/ProfileModal';
import ChangePasswordModal from '../molecules/ChangePasswordModal';
import Logo from '../molecules/Logo';
import Nav from '../molecules/Nav';
import ProfileSection from '../molecules/ProfileSection';


const Header = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const profileRef = useRef(null);
    const [user, setUser] = useState(null);
    const [updateTrigger, setUpdateTrigger] = useState(0);
    const router = useRouter();
    const [isNavOpen, setIsNavOpen] = useState(false);


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
     const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
        const nav = document.querySelector('nav');
        nav.classList.toggle('hidden');
    };
    return (
        <header className="relative flex flex-col sm:flex-row items-center justify-between p-4 bg-white">
            {/* Logo Section */}
             <Logo onMenuToggle={toggleNav} />


            {/* Navigation Section */}
            <Nav user={user}  />

            {/* Profile Section */}
            <ProfileSection
                    user={user}
                    showProfile={showProfile}
                    setShowProfile={setShowProfile}
                    profileRef={profileRef}
                    handleLogout={handleLogout}
                    handleProfileClick={handleProfileClick}
                    handlePasswordChangeClick={handlePasswordChangeClick}
                />

            {/* Modals */}
           {showProfileModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <ProfileModal user={user} onClose={handleModalClose} onUpdateUser={handleUpdateUser} />
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