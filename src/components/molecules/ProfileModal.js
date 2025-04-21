// components/molecules/ProfileModal.js
import React, { useState, useEffect } from "react";
import InputField from "../auth/atoms/InputField";
import Button from "../atoms/Button";
import { Spinner } from "flowbite-react";
import { toast } from "react-hot-toast";
import ModalTemplate from "../templates/ModalTemplate";
import Icon from "../atoms/Icon";

/**
 * ProfileModal Component
 * 
 * A modal dialog that allows users to update their profile information.
 * Includes form validation and server communication for profile updates.
 * 
 * @param {Object} user - Current user data
 * @param {Function} onClose - Function to call when closing the modal
 * @param {Function} onUpdateUser - Callback function after successful profile update
 */
const ProfileModal = ({ user, onClose, onUpdateUser }) => {
    const [namaPegawai, setNamaPegawai] = useState("");
    const [email, setEmail] = useState("");
    const [nomorPegawai, setNomorPegawai] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setNamaPegawai(user.nama_pegawai || "");
            setEmail(user.email || "");
            setNomorPegawai(user.nomor_pegawai || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/user/updateProfile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    nama_pegawai: namaPegawai,
                    email: email,
                    nomor_pegawai: nomorPegawai,
                }),
            });
   
            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                toast.success("Profile successfully updated!", {
                    duration: 5000,
                    position: "top-center",
                });
                if (onUpdateUser) {
                    onUpdateUser();
                }
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
                disabled={loading}
                className={`px-5 py-2.5 text-white rounded-xl transition-all duration-300 flex items-center ${
                    loading 
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
                    "Update Profile"
                )}
            </button>
        </div>
    );

    return (
        <ModalTemplate
            isOpen={!!user}
            title="Update My Profile"
            icon="user-circle"
            size="md"
            onClose={onClose}
            blurBackground={true}
            className="bg-gradient-to-br from-white to-[#E17218]/5"
            footer={modalFooter}
        >
            <form className="space-y-5">
                <div>
                    <label
                        htmlFor="namaPegawai"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Employee Name
                    </label>
                    <input
                        type="text"
                        id="namaPegawai"
                        value={namaPegawai}
                        onChange={(e) => setNamaPegawai(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition"
                    />
                </div>
                <div>
                    <label
                        htmlFor="nomorPegawai"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Employee ID
                    </label>
                    <input
                        type="text"
                        id="nomorPegawai"
                        value={nomorPegawai}
                        onChange={(e) => setNomorPegawai(e.target.value)}
                        placeholder="Enter your employee ID number"
                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition"
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition"
                    />
                </div>
                <div className="mt-2 p-4 bg-[#E17218]/5 rounded-lg border border-[#E17218]/10">
                    <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                            <Icon name="info-circle" className="text-[#E17218] w-5 h-5" />
                        </div>
                        <p className="text-sm text-gray-600">
                            Your profile information will be used throughout the application to personalize your experience and for document attribution.
                        </p>
                    </div>
                </div>
            </form>
        </ModalTemplate>
    );
};

export default ProfileModal;