import React, { useState, useEffect } from "react";
import InputField from "../auth/atoms/InputField";
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
              const response = await fetch('/api/users/updateProfile', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({
                      userId: user.userId,
                       nama_pegawai: namaPegawai,
                      email: email,
                        nomor_pegawai: nomorPegawai,
                    }),
              });

              if(response.ok){
                 const {token} = await response.json();
                 localStorage.setItem('token', token)
                    toast.success("Profil berhasil diperbarui!", {
                      duration: 5000,
                      position: "top-center",
                    });
                    if (onUpdateUser) {
                     onUpdateUser();
                   }
                   onClose();
              } else {
                const {message} = await response.json();
                toast.error(message || "Terjadi kesalahan, coba lagi.", {
                    duration: 5000,
                    position: "top-center",
                  });
              }
          } catch(error) {
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
    >
      <div className="relative w-full max-w-md max-h-full p-4">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Profile
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

              <button
                  type="submit"
                  disabled={loading}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                {loading ? "Loading..." : "Update Profile"}
                </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModalTailwind;