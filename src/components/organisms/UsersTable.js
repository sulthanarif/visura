import React from 'react';
import Icon from '../atoms/Icon';
import { Badge } from 'flowbite-react';
import IconWithText from '../molecules/IconWithText';
import Button from '../atoms/Button';
import Popover from '../atoms/Popover';


const UsersTable = ({ users, currentPage, usersPerPage, handleEditClick, handleDeleteClick, loggedInUserId }) => (
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
                {users.map((user, index) => {
                    const isCurrentUser = loggedInUserId === user.userId;
                    return (
                        <tr key={user.userId} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{index + 1 + (currentPage - 1) * usersPerPage}</td>
                            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.nomor_pegawai}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">
                                <div className="flex items-center gap-2">
                                    {isCurrentUser ? (
                                        <div>
                                            <span className='cursor-pointer flex items-center gap-2'>
                                                {user.nama_pegawai}
                                                <Badge className='font-bold' color="success">You</Badge>
                                               
                                            </span>
                                        </div>
                                    ) : (
                                        <span>{user.nama_pegawai}</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{user.email}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{user.role}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white text-center">
                                {user.email_verified ? <Icon name="check" className="text-green-500 mx-auto" /> : <Icon name="times" className="text-red-500 mx-auto" />}
                            </td>
                            <td className="px-4 py-3 flex items-center justify-center space-x-2">
                                {!isCurrentUser && (
                                    <>
                                        <Button onClick={() => handleEditClick(user)} className="bg-[#EBA801] text-white font-bold py-2 px-4 rounded flex items-center">
                                            <IconWithText icon="edit" text={"Edit"} />
                                        </Button>
                                        <Button onClick={() => handleDeleteClick(user)} className="text-white font-bold py-2 px-4 rounded flex items-center">
                                            <Icon name="trash" className={"text-red-500"} />
                                        </Button>
                                    </>
                                )}
                                {isCurrentUser && (
                                    <Popover content="Tidak dapat diubah/hapus, karena ini adalah akun anda" className="relative">
                                       <Icon name="info-circle" className="text-gray-500" />
                                    </Popover>
                                )}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
);

export default UsersTable;