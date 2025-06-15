// components/molecules/ChangePasswordModal.js
import React, { useState } from "react";
import Icon from "../atoms/Icon";
import { Spinner } from "flowbite-react";
import { toast } from "react-hot-toast";
import { useRouter } from 'next/router';
import ModalTemplate from "../templates/ModalTemplate";


const ChangePasswordModal = ({ user, onClose, onPasswordUpdated }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
    });

    const handleTogglePassword = () => setShowPassword(!showPassword);
    const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must include uppercase, lowercase, and numbers.";
        }
        return null;
    };

    const handleChangePassword = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        
        // Check criteria
        const criteria = {
            length: password.length >= 6,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password)
        };
        
        setPasswordCriteria(criteria);
        
        // Set overall error if needed
        const error = validatePassword(password);
        setPasswordError(error);
    };

    const handleConfirmPasswordChange = (e) => {
        const password = e.target.value;
        setConfirmPassword(password);
        
        if (newPassword !== password) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordError || confirmPasswordError) {
            toast.error("Please fix the errors in the form.", {
                duration: 5000,
                position: "top-center",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!", {
                duration: 5000,
                position: "top-center",
            });
            return;
        }
        setLoading(true);

        try {
            const response = await fetch('/api/user/updatePassword', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    newPassword: newPassword
                }),
            });

            if (response.ok) {
                onPasswordUpdated();
                toast.success("Password successfully updated!", {
                    duration: 5000,
                    position: "top-center",
                });
                onClose();
            } else {
                const { message } = await response.json();
                toast.error(message || "An error occurred. Please try again.", {
                    duration: 5000,
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error("A server error occurred.", {
                duration: 5000,
                position: "top-center",
            });
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = loading || !newPassword || !confirmPassword || passwordError || confirmPasswordError;

    const modalFooter = (
        <div className="flex space-x-3">
            <a
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-300"
            >
                Cancel
            </a>
            <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className={`px-5 py-2.5 text-white rounded-xl transition-all duration-300 flex items-center ${
                    isDisabled 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-[#E17218] to-[#EBA801] hover:from-[#E17218]/90 hover:to-[#EBA801]/90 shadow-lg shadow-[#E17218]/20"
                }`}
            >
                {loading ? (
                    <>
                        <Spinner size="sm" />
                        <span className="ml-2">Updating...</span>
                    </>
                ) : (
                    "Update Password"
                )}
            </button>
        </div>
    );

    return (
        <ModalTemplate
            isOpen={!!user}
            title="Change Password"
            icon="lock"
            size="md"
            onClose={onClose}
            blurBackground={true}
            className="bg-gradient-to-br from-white to-[#E17218]/5"
            footer={modalFooter}
        >
            <form className="space-y-5">
                <div>
                    <label
                        htmlFor="newPassword"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            className={`w-full border ${passwordError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition`}
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={handleChangePassword}
                        />
                        <a
                            type="button"
                            onClick={handleTogglePassword}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <Icon name={showPassword ? "eye-slash" : "eye"} className="w-5 h-5" />
                        </a>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                </div>
                
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className={`w-full border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition`}
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        <a
                            type="button"
                            onClick={handleToggleConfirmPassword}
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            <Icon name={showConfirmPassword ? "eye-slash" : "eye"} className="w-5 h-5" />
                        </a>
                    </div>
                    {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                </div>

                <div className="mt-2 p-4 bg-[#E17218]/5 rounded-lg border border-[#E17218]/10">
                    <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                            <Icon name="shield" className="text-[#E17218] w-5 h-5" />
                        </div>
                        <div className="text-sm text-gray-600 w-full">
                            <p className="mb-3 font-medium">Password requirements:</p>
                            
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${passwordCriteria.length ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                                        {passwordCriteria.length ? (
                                            <Icon name="check" className="w-3.5 h-3.5" />
                                        ) : (
                                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                        )}
                                    </div>
                                    <span className={`ml-2 ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                                        At least 6 characters
                                    </span>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${passwordCriteria.uppercase ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                                        {passwordCriteria.uppercase ? (
                                            <Icon name="check" className="w-3.5 h-3.5" />
                                        ) : (
                                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                        )}
                                    </div>
                                    <span className={`ml-2 ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        One uppercase letter (A-Z)
                                    </span>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${passwordCriteria.lowercase ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                                        {passwordCriteria.lowercase ? (
                                            <Icon name="check" className="w-3.5 h-3.5" />
                                        ) : (
                                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                        )}
                                    </div>
                                    <span className={`ml-2 ${passwordCriteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        One lowercase letter (a-z)
                                    </span>
                                </div>
                                
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${passwordCriteria.number ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                                        {passwordCriteria.number ? (
                                            <Icon name="check" className="w-3.5 h-3.5" />
                                        ) : (
                                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                        )}
                                    </div>
                                    <span className={`ml-2 ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                                        One number (0-9)
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${newPassword && confirmPassword && newPassword === confirmPassword ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
                                        {newPassword && confirmPassword && newPassword === confirmPassword ? (
                                            <Icon name="check" className="w-3.5 h-3.5" />
                                        ) : (
                                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                        )}
                                    </div>
                                    <span className={`ml-2 ${newPassword && confirmPassword && newPassword === confirmPassword ? 'text-green-600' : 'text-gray-500'}`}>
                                        Passwords match
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </ModalTemplate>
    );
};

export default ChangePasswordModal;