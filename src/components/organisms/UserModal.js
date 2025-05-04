// components/organisms/UserModal.js
import React, { useState } from 'react';
import InputField from '../auth/atoms/InputField';
import ModalTemplate from '@/components/templates/ModalTemplate';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';

const UserModal = ({ isOpen, selectedUser, handleInputChange, handleSubmit, handleModalClose, title }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword(!showPassword);
    
    if (!isOpen) return null;
    
    const isDisabled = selectedUser?.isCurrentUser;
    
    const modalFooter = (
        <div className="flex items-center justify-end space-x-3">
            <Button 
                onClick={handleModalClose}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-300"
            >
                Cancel
            </Button>
            <Button 
                onClick={handleSubmit}
                disabled={isDisabled}
                className={`px-5 py-2.5 text-white rounded-xl shadow-lg transition-all duration-300 ${
                    isDisabled 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#E17218] to-[#EBA801] hover:from-[#E17218]/90 hover:to-[#EBA801]/90 shadow-[#E17218]/20'
                }`}
            >
                {selectedUser?.userId ? 'Update User Details' : 'Create New User'}
            </Button>
        </div>
    );
    
    return (
        <ModalTemplate 
            isOpen={isOpen}
            onClose={handleModalClose}
            title={title || (selectedUser?.userId ? 'Edit User Profile' : 'Create New User')}
            icon="user-edit"
            size="lg"
            footer={modalFooter}
            footerAlign="right"
        >
            {selectedUser && (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                    {isDisabled && (
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <div className="flex items-start">
                                <Icon name="info-circle" className="text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-amber-700">
                                    You cannot edit your own profile through this interface. Please use the profile settings page instead.
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="nama_pegawai" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <InputField
                            type="text"
                            id="nama_pegawai"
                            name="nama_pegawai"
                            value={selectedUser.nama_pegawai || ""}
                            onChange={handleInputChange}
                            placeholder="Enter user's full name"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#E17218] focus:border-[#E17218]"
                            disabled={isDisabled}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <InputField
                            type="email"
                            id="email"
                            name="email"
                            value={selectedUser.email || ""}
                            onChange={handleInputChange}
                            placeholder="user@example.com"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#E17218] focus:border-[#E17218]"
                            disabled={isDisabled}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            The email address will be used for login and notifications.
                        </p>
                    </div>
                    
                    <div>
                        <label htmlFor="nomor_pegawai" className="block text-sm font-medium text-gray-700">
                            Employee ID
                        </label>
                        <InputField
                            type="text"
                            id="nomor_pegawai"
                            name="nomor_pegawai"
                            value={selectedUser.nomor_pegawai || ""}
                            onChange={handleInputChange}
                            placeholder="Enter employee ID number"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#E17218] focus:border-[#E17218]"
                            disabled={isDisabled}
                        />
                    </div>
                        
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            User Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={selectedUser.role || "user"}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-[#E17218] focus:border-[#E17218]"
                            disabled={isDisabled}
                        >
                            <option value="user">Standard User</option>
                            <option value="admin">Administrator</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Administrators have full access to manage users and system settings.
                        </p>
                    </div>
                    
                    <div className="pt-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="email_verified"
                                name="email_verified"
                                checked={selectedUser.email_verified || false}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-[#E17218] bg-gray-100 border-gray-300 rounded focus:ring-[#E17218]"
                                disabled={isDisabled}
                            />
                            <label htmlFor="email_verified" className="ml-2 block text-sm text-gray-700">
                                Email Verified
                            </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 ml-6">
                            Mark as verified if the user has confirmed their email address or if verification is not required.
                        </p>
                    </div>
                </form>
            )}
        </ModalTemplate>
    );
};

export default UserModal;