import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Label, Select, Checkbox } from 'flowbite-react';
import Icon from '../../../components/atoms/Icon';
import { toast } from 'react-hot-toast';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [editedUserData, setEditedUserData] = useState({
        userId: '',
        role: '',
        email_verified: false
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`/api/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data);
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

    return (
        <div>
            <div className="container mx-auto p-8 w-full whitespace-nowrap overflow-x-auto pb-4 justify-center align-middle">
                <div className="mb-6 "></div>
                <Table hoverable={true}>
                    <Table.Head>
                        <Table.HeadCell>No</Table.HeadCell>
                        <Table.HeadCell>UUID</Table.HeadCell>
                        <Table.HeadCell>Nomor Pegawai</Table.HeadCell>
                        <Table.HeadCell>Nama Pegawai</Table.HeadCell>
                        <Table.HeadCell>Email</Table.HeadCell>
                        <Table.HeadCell>Role</Table.HeadCell>
                        <Table.HeadCell>Email Verified</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {users.map((user, index) => (
                            <Table.Row key={user.userId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {index + 1}
                                </Table.Cell>
                                <Table.Cell>{user.userId}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {user.nomor_pegawai}
                                </Table.Cell>
                                <Table.Cell>{user.nama_pegawai}</Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.role}</Table.Cell>
                                <Table.Cell>
                                    {user.email_verified ? <Icon name="check" className="text-green-500" /> : <Icon name="times" className="text-red-500" />}
                                </Table.Cell>
                                <Table.Cell>
                                    <Button onClick={() => handleEditClick(user)} color="info">Edit</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
            <Modal
                show={openModal === 'update-modal'}
                onClose={handleModalClose}
            >
                <Modal.Header>
                    Update User
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    id="role"
                                    name="role"
                                    value={editedUserData.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </Select>
                            </div>
                            <div className="mb-4 flex items-center gap-2">
                                <Label htmlFor="email_verified">Email Verified</Label>
                                <Checkbox
                                    id="email_verified"
                                    name="email_verified"
                                    checked={editedUserData.email_verified}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit">Update</Button>
                            </div>
                        </form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UsersPage;
