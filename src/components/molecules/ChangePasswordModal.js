// components/molecules/ChangePasswordModal.js
import React, { useState } from "react";
import InputField from "../auth/atoms/InputField";
import Button from "../atoms/Button";
import { Spinner } from "flowbite-react";
 import { toast } from "react-hot-toast";
 import { useRouter } from 'next/router';

const ChangePasswordModal = ({ user, onClose, onPasswordUpdated }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    const handleTogglePassword = () => setShowPassword(!showPassword);
    const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password minimal harus 6 karakter.";
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            return "Password harus ada huruf kapital, kecil, dan angka.";
        }
        return null;
    };

   const handleChangePassword = (e) => {
        const password = e.target.value;
        const error = validatePassword(password);
        setNewPassword(password);
        setPasswordError(error);
    };

   const handleConfirmPasswordChange = (e) => {
        const password = e.target.value;
        const error = validatePassword(password);
        setConfirmPassword(password);
        setConfirmPasswordError(error);
    };

 const handleSubmit = async (e) => {
     e.preventDefault();
     if (passwordError || confirmPasswordError) {
         toast.error("Perbaiki kesalahan pada form!", {
         duration: 5000,
         position: "top-center",
        });
        return;
     }

     if (newPassword !== confirmPassword) {
         toast.error("Password tidak cocok!", {
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
             toast.success("Password berhasil diperbarui!", {
                 duration: 5000,
                 position: "top-center",
             });

         } else {
             const { message } = await response.json();
             toast.error(message || "Terjadi kesalahan, coba lagi.", {
                 duration: 5000,
                 position: "top-center",
             });
         }
     } catch (error) {
         toast.error("Terjadi kesalahan pada server.", {
             duration: 5000,
             position: "top-center",
         });
     } finally {
         setLoading(false);
     }
 };

    return (
        <div
            id="authentication-modal"
            tabIndex="-1"
            aria-hidden="true"
           className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50"
        >
            <div className="relative w-full max-w-md max-h-full p-4">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Change Password
                        </h3>
                        <button
                            onClick={onClose}
                            type="button"
                            className="ms-auto inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="authentication-modal"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
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
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <InputField
                                        type={showPassword ? "text" : "password"}
                                        id="newPassword"
                                        placeholder="Masukkan Password"
                                        value={newPassword}
                                        onChange={handleChangePassword}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleTogglePassword}
                                        className="absolute top-2 right-3"
                                    >
                                        <img
                                            src={showPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>
                                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            </div>
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <InputField
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="Konfirmasi Password"
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleToggleConfirmPassword}
                                        className="absolute top-2 right-3"
                                    >
                                        <img
                                            src={showConfirmPassword ? "/assets/eye_close.svg" : "/assets/eye_open.svg"}
                                            className="w-6 h-6"
                                        />
                                    </button>
                                </div>
                                {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                            </div>
                             <div className="flex justify-center items-center mt-6 space-x-4">
                                <Button
                                     type="submit"
                                      className={`px-19 py-3 rounded-md flex items-center justify-center ${
                                        loading || !newPassword || !confirmPassword ||  passwordError || confirmPasswordError
                                            ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
                                             : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
                                      }`}
                                      style={{
                                         borderRadius: "30px",
                                          fontWeight: "normal",
                                         height: "48px",
                                          width: "172px",
                                      }}
                                     disabled={loading || !newPassword || !confirmPassword ||  passwordError || confirmPasswordError}
                                 >
                                  {loading ? (
                                         <>
                                           <Spinner/>
                                           <span className="ml-2">Updating...</span>
                                         </>
                                      ) : (
                                         "Update Password"
                                     )}
                                 </Button>
                                   <Button
                                         type="button"
                                         onClick={onClose}
                                         className="px-11 py-3 text-white bg-[#E17218] hover:bg-[#c35d14] rounded-md"
                                         style={{ borderRadius: "30px", fontWeight: "normal",  height: "48px",
                                             width: "172px", }}
                                    >
                                     Cancel
                                     </Button>
                             </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;