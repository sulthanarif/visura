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

    const renderNavItems = () => {
        if (user?.role === 'admin') {
            return (
                <>
                    <a href="/admin">Dashboard</a>
                    <a href="/admin/users">Users</a>
                    <a href="/admin/library">Library</a>
                </>
            );
        } else if (user?.role === 'user') {
            return (
                <>
                    <a href="/upload-test">Scan Files</a>
                    <a href="/library">Library</a>
                </>
            );
        }
        return null;
    };

    return (
        <header className="header relative">
            <Image
                alt="Summarecon Logo"
                height={40}
                src="/assets/Summarecon_Agung 1.svg"
                width={150}
            />
            <nav>
                {renderNavItems()}
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
                    <span>Halo, {user?.nama_pegawai || 'Guest'}</span>
                </div>

                {showProfile && (
                    <div className="absolute right-1 mt-4 w-100 rounded-lg shadow-xl transition-all duration-200 ease-in-out transform origin-top">
                        <ProfileCard user={user} onLogout={handleLogout} onProfileClick={handleProfileClick} onPasswordChangeClick={handlePasswordChangeClick} />
                    </div>
                )}
            </div>
            {showProfileModal && (
                <ProfileModalTailwind user={user} onClose={handleModalClose} onUpdateUser={handleUpdateUser} />
            )}
            {showPasswordModal && (
                <ChangePasswordModal user={user} onClose={handlePasswordModalClose} onPasswordUpdated={handlePasswordUpdated} />
            )}
        </header>
    );
};

export default Header;