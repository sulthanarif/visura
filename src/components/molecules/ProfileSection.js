// components/molecules/ProfileSection.js
import React from 'react';
import Icon from '../atoms/Icon';
import ProfileCard from './ProfileCard';

const ProfileSection = ({
    user,
    showProfile,
    setShowProfile,
    profileRef,
    handleLogout,
    handleProfileClick,
    handlePasswordChangeClick,
    handleAboutClick,
}) => {
    return (
        <div ref={profileRef} className="relative w-full sm:w-auto mt-4 sm:mt-0">
            <div
                className="user-info cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors flex items-center justify-center sm:justify-start space-x-2"
                onClick={() => setShowProfile(!showProfile)}
            >
                <Icon name="user-circle" />
                <span className="text-sm sm:text-base">
                    Halo, {user?.nama_pegawai || 'Guest'}
                </span>
            </div>

            {showProfile && (
                <div className="absolute right-0 sm:right-1 mt-2 w-full sm:w-64 rounded-lg shadow-xl transition-all duration-200 ease-in-out transform origin-top z-50">                    <ProfileCard
                        user={user}
                        onLogout={handleLogout}
                        onProfileClick={handleProfileClick}
                        onPasswordChangeClick={handlePasswordChangeClick}
                        onAboutClick={handleAboutClick}
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileSection;