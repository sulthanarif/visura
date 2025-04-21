// components/molecules/ProfileCard.js
import React from "react";
import Icon from "../atoms/Icon";
import { Badge } from "flowbite-react";

/**
 * ProfileCard Component
 * 
 * A stylish card displaying user profile information with action buttons
 * for profile management and authentication functions.
 * 
 * @param {Object} user - Current user data
 * @param {Function} onLogout - Function to handle user logout
 * @param {Function} onProfileClick - Function to handle profile edit action
 * @param {Function} onPasswordChangeClick - Function to handle password change action
 */
const ProfileCard = ({ user, onLogout, onProfileClick, onPasswordChangeClick }) => {
    const isThisAdmin = user?.role === "admin";
    
    if (!user) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-720 transition-all duration-300 hover:shadow-xl">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-[#E17218] to-[#EBA801] p-5">
                <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 shadow-md">
                        <img
                            className="w-12 h-12 rounded-full"
                            src={user?.profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                            alt="Profile"
                        />
                    </div>
                    <div className="ml-3 text-white">
                        <h3 className="font-bold text-lg truncate max-w-[160px]">
                            {user?.nama_pegawai || "User Name"}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm">
                            <Icon name="id-card" className="w-3.5 h-3.5 mr-1.5" />
                            <span className="truncate max-w-[140px]">
                                {user?.nomor_pegawai || "ID Number"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Role badge */}
            <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    {user?.email || "user@example.com"}
                </div>
                <Badge 
                    className={`rounded-full px-3 ${isThisAdmin ? 'bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white ' : 'bg-blue-100 text-blue-800'}`}
                    size="sm"
                    style={{ fontSize: '0.75rem' }}
                >
                    {isThisAdmin ? 'Admin' : 'User'}
                </Badge>
            </div>
            
            {/* Actions menu */}
            <div className="p-4 space-y-2">
                <button 
                    onClick={onProfileClick}
                    className="w-full flex items-center justify-between p-3 text-gray-700 rounded-lg hover:bg-[#E17218]/5 transition-colors duration-200"
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#E17218]/10 flex items-center justify-center mr-3">
                            <Icon name="user" className="text-[#E17218] w-4 h-4" />
                        </div>
                        <span className="font-medium">Edit Profile</span>
                    </div>
                    <Icon name="chevron-right" className="text-gray-400 w-4 h-4" />
                </button>
                
                <button 
                    onClick={onPasswordChangeClick}
                    className="w-full flex items-center justify-between p-3 text-gray-700 rounded-lg hover:bg-[#E17218]/5 transition-colors duration-200"
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#E17218]/10 flex items-center justify-center mr-3">
                            <Icon name="lock" className="text-[#E17218] w-4 h-4" />
                        </div>
                        <span className="font-medium">Change Password</span>
                    </div>
                    <Icon name="chevron-right" className="text-gray-400 w-4 h-4" />
                </button>
                
                <div className="pt-2 mt-2 border-t border-gray-100">
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 text-white bg-gradient-to-r from-[#E17218] to-[#EBA801] rounded-lg hover:from-[#E17218]/90 hover:to-[#EBA801]/90 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <Icon name="sign-out" className="w-4 h-4" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;