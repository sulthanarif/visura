// components/organisms/UserModal.js
import React, { useState } from 'react';
import InputField from '../auth/atoms/InputField';

const UserModal = ({ isOpen, selectedUser, handleInputChange, handleSubmit, handleModalClose, title }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword(!showPassword);
   if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={handleModalClose}
                        type="button"
                        className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <svg
                            className="w-4 h-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close</span>
                    </button>
                </div>
                {selectedUser && (
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="nama_pegawai" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                Nama Pegawai
                            </label>
                            <InputField
                                type="text"
                                id="nama_pegawai"
                                name="nama_pegawai"
                                value={selectedUser.nama_pegawai || ""}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={selectedUser?.isCurrentUser}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                Email
                            </label>
                            <InputField
                                type="email"
                                id="email"
                                name="email"
                                value={selectedUser.email || ""}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={selectedUser?.isCurrentUser}
                            />
                        </div>
                        <div>
                            <label htmlFor="nomor_pegawai" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                Nomor Pegawai
                            </label>
                            <InputField
                                type="text"
                                id="nomor_pegawai"
                                name="nomor_pegawai"
                                value={selectedUser.nomor_pegawai || ""}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                 disabled={selectedUser?.isCurrentUser}
                            />
                        </div>
                            
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={selectedUser.role || "user"}
                                onChange={handleInputChange}
                                className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                disabled={selectedUser?.isCurrentUser}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="email_verified"
                                name="email_verified"
                                checked={selectedUser.email_verified || false}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                disabled={selectedUser?.isCurrentUser}
                            />
                            <label htmlFor="email_verified" className="ml-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                                Email Verified
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium"
                                disabled={selectedUser?.isCurrentUser}
                            >
                                Update
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
};

export default UserModal;