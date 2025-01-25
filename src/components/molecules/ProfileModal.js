// components/molecules/ProfileModalTailwind.js
import React, { useState, useEffect } from "react";
import InputField from "../auth/atoms/InputField";
import Button from "../atoms/Button";
import { Spinner } from "flowbite-react";
 import { toast } from "react-hot-toast";

 const ProfileModalTailwind = ({ user, onClose, onUpdateUser }) => {
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
                toast.success("Profil berhasil diperbarui!", {
                    duration: 5000,
                    position: "top-center",
                });
                if (onUpdateUser) {
                    onUpdateUser();
                }
                onClose();
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
                            Update My Profile
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
                                    htmlFor="namaPegawai"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Nama Pegawai
                                </label>
                                <InputField
                                    type="text"
                                    id="namaPegawai"
                                    value={namaPegawai}
                                    onChange={(e) => setNamaPegawai(e.target.value)}
                                    placeholder="Masukkan Nama Pegawai"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="nomorPegawai"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Nomor Pegawai
                                </label>
                                <InputField
                                    type="text"
                                    id="nomorPegawai"
                                    value={nomorPegawai}
                                    onChange={(e) => setNomorPegawai(e.target.value)}
                                    placeholder="Masukkan Nomor Pegawai"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <InputField
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Masukkan Email"
                                />
                            </div>
                          <div className="flex justify-center items-center mt-6 space-x-4">
                                    <Button
                                        type="submit"
                                         className={`px-19 py-3 rounded-md flex items-center justify-center ${
                                         loading
                                            ? "bg-[#A6A6A6] text-gray-200 cursor-not-allowed border border-gray-400"
                                             : "bg-[#008C28] text-white hover:bg-green-600 border border-green-700"
                                         }`}
                                         style={{
                                             borderRadius: "30px",
                                            fontWeight: "normal",
                                            height: "48px",
                                             width: "172px",
                                         }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm"/>
                                                <span className="ml-2">Updating...</span>
                                            </>
                                        ) : (
                                            "Update Profile"
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

export default ProfileModalTailwind;