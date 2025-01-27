import React from 'react';
import Icon from '../atoms/Icon';
import { Badge } from 'flowbite-react';
import IconWithText from '../molecules/IconWithText';
import Button from '../atoms/Button';
import Popover from '../atoms/Popover';

const UsersTable = ({ users, currentPage, usersPerPage, handleEditClick, handleDeleteClick, loggedInUserId }) => (
  <div className="overflow-x-auto w-full">
    <div className="max-h-[45vh] sm:max-h-[65vh] overflow-y-auto">
      <table className="w-full text-sm text-left text-gray-900 border-collapse border border-orange-300">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
          <tr>
            <th scope="col" className="px-4 py-3 border border-orange-300">No</th>
            <th scope="col" className="px-4 py-3 border border-orange-300">Nomor Pegawai</th>
            <th scope="col" className="px-4 py-3 border border-orange-300">Nama Pegawai</th>
            <th scope="col" className="px-4 py-3 border border-orange-300">Email</th>
            <th scope="col" className="px-4 py-3 border border-orange-300">Role</th>
            <th scope="col" className="px-4 py-3 border border-orange-300">Email Verified</th>
            <th scope="col" className="px-4 py-3 border border-orange-300 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isCurrentUser = loggedInUserId === user.userId;
            return (
              <tr
                key={user.userId}
                className={`${index % 2 === 0 ? 'bg-orange-100' : 'bg-orange-200'}`}  
              >
                <td className="px-4 py-3 border border-orange-300 bg-white">
                  {index + 1 + (currentPage - 1) * usersPerPage}
                </td>
                <td className="px-4 py-3 border border-orange-300">{user.nomor_pegawai}</td>
                <td className="px-4 py-3 border border-orange-300">
                  <div className="flex items-center gap-2">
                    {isCurrentUser ? (
                      <div>
                        <span className="cursor-pointer flex items-center gap-2">
                          {user.nama_pegawai}
                          <Badge className="font-bold" color="dark">You</Badge>
                        </span>
                      </div>
                    ) : (
                      <span>{user.nama_pegawai}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 border border-orange-300">{user.email}</td>
                <td className="px-4 py-3 border border-orange-300">{user.role}</td>
                <td className="px-4 py-3 border border-orange-300 text-center">
                  {user.email_verified ? (
                    <Icon name="check" className="text-green-500 mx-auto" />
                  ) : (
                    <Icon name="times" className="text-red-500 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 border border-orange-300 text-center">
                  {!isCurrentUser && (
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() => handleEditClick(user)}
                        className="bg-[#EBA801] hover:bg-[#F5C076]/90 text-white font-bold py-1 px-3 rounded"
                      >
                        <Icon name="edit" className="text-white mr-2" /> Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(user)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Remove Account
                      </Button>
                    </div>
                  )}
                  {isCurrentUser && (
                    <Popover content="Tidak dapat diubah/hapus, karena ini adalah akun anda">
                      <Icon name="info-circle" className="text-gray-500" />
                    </Popover>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersTable;
