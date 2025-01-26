import React, { useState, useEffect } from 'react';
import Icon from '../../../components/atoms/Icon';
import { toast } from 'react-hot-toast';
import IconWithText from '@/components/molecules/IconWithText';
import ModalConfirmation from '@/components/molecules/ModalConfirmation';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
     const [usersPerPage, setUsersPerPage] = useState(7);
    const [openModal, setOpenModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalUsers, setTotalUsers] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);


    const [editedUserData, setEditedUserData] = useState({
        ...selectedUser,
        userId: '',
        role: '',
        email_verified: false
    });

     useEffect(() => {
        const handleResize = () => {
            setUsersPerPage(window.innerWidth < 740 ? 5 : 7); // sm breakpoint
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm, usersPerPage]);


    const fetchUsers = async () => {
         try {
             const response = await fetch(`/api/users?page=${currentPage}&limit=${usersPerPage}&search=${searchTerm}`);
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             const data = await response.json();
             if (data.length > 0) {
                 setUsers(data);
                 setTotalUsers(data[0].total);
             } else {
                setUsers([]);
                setTotalUsers(0);
            }
         } catch (error) {
             console.error("Error fetching users:", error);
              toast.error("Terjadi kesalahan saat mengambil data user.", {
                duration: 5000,
                position: "top-center",
            });
         }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditedUserData({
            ...user,
            userId: user.userId,
            role: user.role,
            email_verified: user.email_verified,
        });
        setOpenModal('update-modal');
    };

    const handleModalClose = () => {
        setOpenModal(null);
        setEditedUserData({
            ...selectedUser,
            userId: '',
            role: '',
            email_verified: false
        });
        setSelectedUser(null);
    };
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${editedUserData.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: editedUserData.userId,
                    password: editedUserData.password,
                    email: editedUserData.email,
                    nomor_pegawai: editedUserData.nomor_pegawai,
                    nama_pegawai: editedUserData.nama_pegawai,
                    role: editedUserData.role,
                    email_verified: editedUserData.email_verified,
                }),
            });

            if (response.ok) {
                toast.success("User Berhasil di Update", {
                    duration: 5000,
                    position: "top-center",
                });
                fetchUsers();
                setOpenModal(null);
            } else {
                const errorData = await response.json();
                toast.error(errorData?.message || "Terjadi kesalahan, coba lagi.", {
                    duration: 5000,
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Terjadi kesalahan, coba lagi.", {
                duration: 5000,
                position: "top-center",
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedUserData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/users/${userToDelete.userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success("User Berhasil di Hapus", {
                    duration: 5000,
                    position: "top-center",
                });
                fetchUsers();
            } else {
                 const errorData = await response.json();
                toast.error(errorData?.message || "Terjadi kesalahan, coba lagi.", {
                    duration: 5000,
                     position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Terjadi kesalahan, coba lagi.", {
                duration: 5000,
                position: "top-center",
            });
        } finally {
            setDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };
    const renderTable = () => (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">No</th>
                        <th scope="col" className="px-4 py-3">Nomor Pegawai</th>
                        <th scope="col" className="px-4 py-3">Nama Pegawai</th>
                        <th scope="col" className="px-4 py-3">Email</th>
                        <th scope="col" className="px-4 py-3">Role</th>
                        <th scope="col" className="px-4 py-3">Email Verified</th>
                        <th scope="col" className="px-4 py-3 text-center">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.userId} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1 + (currentPage - 1) * usersPerPage}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.nomor_pegawai}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{user.nama_pegawai}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{user.email}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{user.role}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white text-center">
                                {user.email_verified ? <Icon name="check" className="text-green-500 mx-auto" /> : <Icon name="times" className="text-red-500 mx-auto" />}
                            </td>
                            <td className="px-4 py-3 flex items-center justify-center space-x-2">
                                 <button onClick={() => handleEditClick(user)} className="bg-[#EBA801] text-white font-bold py-2 px-4 rounded flex items-center"><IconWithText icon="edit" text={"Edit"} /></button>
                                  <button onClick={() => handleDeleteClick(user)} className="text-white font-bold py-2 px-4 rounded flex items-center"><Icon name="trash" className={"text-red-500"} /></button>
                           </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderModal = () => (
        openModal === 'update-modal' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Update User
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
                                <input
                                    type="text"
                                    id="nama_pegawai"
                                    name="nama_pegawai"
                                    value={editedUserData.nama_pegawai}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={editedUserData.email}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="nomor_pegawai" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                    Nomor Pegawai
                                </label>
                                <input
                                    type="text"
                                    id="nomor_pegawai"
                                    name="nomor_pegawai"
                                    value={editedUserData.nomor_pegawai}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-800 dark:text-gray-200">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={editedUserData.role}
                                    onChange={handleInputChange}
                                    className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-blue-500 focus:border-blue-500"
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
                                    checked={editedUserData.email_verified}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="email_verified" className="ml-2 block text-sm font-medium text-gray-800 dark:text-gray-200">
                                    Email Verified
                                </label>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        )
    );

    return (
        <section className="p-3 sm:p-5">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-xl overflow-hidden rounded-xl">
                    <header className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Kelola Akun</h1>
                        <div className="mt-4 md:mt-0">
                            <input
                                type="text"
                                id="simple-search"
                                className="placeholder:italic placeholder:text-gray-400 block bg-gray-50 w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-white"
                                placeholder="Search..."
                                onChange={handleSearchChange}
                            />
                        </div>
                    </header>

                    <div>
                        {renderTable()}
                    </div>

                    <footer className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Showing
                            <span className="font-semibold text-gray-900 dark:text-white mx-1">
                                {users.length > 0 ? ((currentPage - 1) * usersPerPage + 1) : 0} -
                                {users.length > 0 ? (currentPage * usersPerPage > totalUsers ? totalUsers : currentPage * usersPerPage) : 0}
                            </span>
                            of
                            <span className="font-semibold text-gray-900 dark:text-white mx-1">{totalUsers}</span>
                        </span>
                        <div className="inline-flex items-center space-x-1 mt-4 md:mt-0">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-500 rounded-l-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage * usersPerPage >= totalUsers}
                                className="px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-500 rounded-r-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </footer>
                </div>
            </div>

            {renderModal()}

            <ModalConfirmation
                isOpen={deleteModalOpen}
                icon="exclamation-triangle"
                iconColor="red"
                title="Konfirmasi Penghapusan"
                message={`Apakah Anda yakin ingin menghapus user ${userToDelete?.nama_pegawai}?`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText="Hapus"
            />
        </section>
    );
};

export default UsersPage;