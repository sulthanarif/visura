import React from 'react';
import Icon from '../atoms/Icon';
import { Badge } from 'flowbite-react';
import IconWithText from '../molecules/IconWithText';
import Button from '../atoms/Button';
import Popover from '../atoms/Popover';

const UsersTable = ({ users, currentPage, usersPerPage, handleEditClick, handleDeleteClick, loggedInUserId }) => (
  <div className="overflow-x-auto w-full">
    <div className="max-h-[370px] sm:max-h-[500px] overflow-y-auto">
      <table className="w-full text-sm text-left text-gray-900 border-collapse border border-orange-500">
        <thead className="bg-white text-black">
          <tr>
            <th scope="col" className="px-4 py-3 border border-orange-500">No</th>
            <th scope="col" className="px-4 py-3 border border-orange-500">Nomor Pegawai</th>
            <th scope="col" className="px-4 py-3 border border-orange-500">Nama Pegawai</th>
            <th scope="col" className="px-4 py-3 border border-orange-500">Email</th>
            <th scope="col" className="px-4 py-3 border border-orange-500">Role</th>
            <th scope="col" className="px-4 py-3 border border-orange-500">Email Verified</th>
            <th scope="col" className="px-4 py-3 border border-orange-500 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const isCurrentUser = loggedInUserId === user.userId;
            return (
              <tr
                key={user.userId}
                className={`${index % 2 === 0 ? 'bg-orange-50' : 'bg-orange-100'}`}
              >
                <td className="px-4 py-3 border border-orange-500 bg-white">
                  {index + 1 + (currentPage - 1) * usersPerPage}
                </td>
                <td className="px-4 py-3 border border-orange-500">{user.nomor_pegawai}</td>
                <td className="px-4 py-3 border border-orange-500">
                  <div className="flex items-center gap-2">
                    {isCurrentUser ? (
                      <div>
                        <span className="cursor-pointer flex items-center gap-2">
                          {user.nama_pegawai}
                          <Badge className="font-bold" color="success">You</Badge>
                        </span>
                      </div>
                    ) : (
                      <span>{user.nama_pegawai}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 border border-orange-500">{user.email}</td>
                <td className="px-4 py-3 border border-orange-500">{user.role}</td>
                <td className="px-4 py-3 border border-orange-500 text-center">
                  {user.email_verified ? (
                    <Icon name="check" className="text-green-500 mx-auto" />
                  ) : (
                    <Icon name="times" className="text-red-500 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 border border-orange-500 text-center">
                  {!isCurrentUser && (
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() => handleEditClick(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Edit
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