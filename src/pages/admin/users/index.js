import React, { useState, useEffect } from 'react';
 import Icon from '../../../components/atoms/Icon';
import { toast } from 'react-hot-toast';
import IconWithText from '@/components/molecules/IconWithText';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
   const [usersPerPage] = useState(10);
     const [openModal, setOpenModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
     const [totalUsers, setTotalUsers] = useState(0);


     const [editedUserData, setEditedUserData] = useState({
         userId: '',
         role: '',
         email_verified: false
     });

     useEffect(() => {
         fetchUsers();
     }, [currentPage, searchTerm]);

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
         }
     };

    const handleEditClick = (user) => {
        setSelectedUser(user);
         setEditedUserData({
            userId: user.userId,
             role: user.role,
             email_verified: user.email_verified,
        });
        setOpenModal('update-modal');
    };

     const handleModalClose = () => {
         setOpenModal(null);
        setEditedUserData({
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

     const renderTable = () => (
         <div className="overflow-x-auto">
             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                 <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                     <tr>
                        <th scope="col" className="px-4 py-3">No</th>
                        <th scope="col" className="px-4 py-3">Nomor Pegawai</th>
                         <th scope="col" className="px-4 py-3">Nama Pegawai</th>
                        <th scope="col" className="px-4 py-3">Email</th>
                         <th scope="col" className="px-4 py-3">Role</th>
                        <th scope="col" className="px-4 py-3">Email Verified</th>
                         <th scope="col" className="px-4 py-3">
                             <span className="sr-only">Actions</span>
                        </th>
                     </tr>
                </thead>
                 <tbody>
                    {users.map((user, index) => (
                        <tr key={user.userId} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                             <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1 + (currentPage -1) * usersPerPage}</td>
                              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.nomor_pegawai}</td>
                              <td className="px-4 py-3 text-gray-900 dark:text-white">{user.nama_pegawai}</td>
                               <td className="px-4 py-3 text-gray-900 dark:text-white">{user.email}</td>
                              <td className="px-4 py-3 text-gray-900 dark:text-white">{user.role}</td>
                                <td className="px-4 py-3 text-gray-900 dark:text-white">
                                      {user.email_verified ? <Icon name="check" className="text-green-500" /> : <Icon name="times" className="text-red-500" />}
                                 </td>
                                  <td className="px-4 py-3 flex items-center justify-end">
                                       <button onClick={() => handleEditClick(user)} className="bg-[#EBA801] text-white font-bold py-2 px-4 rounded"><IconWithText icon="edit" text={"Edit"} /></button>
                                       <button className="text-white font-bold py-2 px-4 rounded ml-2"><Icon name="trash" className={"text-red-500"}/></button>
                                  </td>
                                  
                             </tr>
                         ))}
                  </tbody>
             </table>
         </div>
     );

    const renderModal = () => (
        openModal === 'update-modal' && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                 <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-5">
                      <div className="flex items-center justify-between p-4 border-b rounded-t md:p-5 dark:border-gray-600">
                             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                 Update User
                            </h3>
                              <button
                                     onClick={handleModalClose}
                                type="button"
                                className="ms-auto inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
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
                     {selectedUser && (
                       <div className="p-4 md:p-5">
                          <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                 <label htmlFor="role" className="block text-sm font-medium text-gray-900 dark:text-white">Role</label>
                               <select
                                       id="role"
                                     name="role"
                                     value={editedUserData.role}
                                     onChange={handleInputChange}
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  >
                                    <option value="user">User</option>
                                     <option value="admin">Admin</option>
                                 </select>
                             </div>
                            <div className="mb-4">
                                 <label htmlFor="email_verified" className="block text-sm font-medium text-gray-900 dark:text-white">Email Verified</label>
                                <input
                                     type="checkbox"
                                       id="email_verified"
                                       name="email_verified"
                                      checked={editedUserData.email_verified}
                                      onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                            </div>
                              <div className="flex justify-end">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update</button>
                              </div>
                          </form>
                         </div>
                      )}
                 </div>
             </div>
        )
     );

     return (
         <section className="p-5 sm:p-5 mt-10">
            <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                 <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                     <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="w-full md:w-1/2">
                             <h1 className="text-2xl font-bold inline-block">Users</h1>
                       </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                             <div className="relative w-full">
                                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                         <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                      </svg>
                                 </div>
                                 <input type="text"
                                      id="simple-search"
                                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                     placeholder="Search"
                                     onChange={handleSearchChange}
                                    />
                             </div>
                         </div>
                    </div>
                     {renderTable()}
                    <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-2 p-4 gap-0.5 mr-2" aria-label="Table navigation">
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mr-2">
                              Showing
                             <span className="font-semibold text-gray-900 dark:text-white ">
                                     {users.length > 0 ? ((currentPage - 1) * usersPerPage + 1) : 0} -
                                 {users.length > 0 ? (currentPage * usersPerPage > totalUsers ? totalUsers : currentPage * usersPerPage ) : 0}
                              </span>
                              of
                              <span className="font-semibold text-gray-900 dark:text-white gap-0.5">{totalUsers}</span>
                         </span>
                        <ul className="inline-flex items-stretch -space-x-px">
                            <li>
                                <button
                                   onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                    className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                     <span className="sr-only">Previous</span>
                                     <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                </button>
                            </li>
                         <li>
                                <button
                                 onClick={() => handlePageChange(currentPage + 1)}
                                 disabled={currentPage * usersPerPage >= totalUsers}
                                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                   <span className="sr-only">Next</span>
                                     <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                     </svg>
                                </button>
                             </li>
                         </ul>
                    </nav>
                  </div>
               </div>
              {renderModal()}
          </section>
     );
 };

export default UsersPage;