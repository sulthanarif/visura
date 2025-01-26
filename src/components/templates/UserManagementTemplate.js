import React from 'react';
import SectionHeader from '../organisms/SectionHeader';
import UsersTable from '../organisms/UsersTable';
import Pagination from '../organisms/Pagination';
import UserModal from '../organisms/UserModal';
import ModalConfirmation from '../molecules/ModalConfirmation';

const UserManagementTemplate = ({
    users,
    currentPage,
    usersPerPage,
    totalUsers,
    searchTerm,
    openModal,
    selectedUser,
    deleteModalOpen,
    userToDelete,
    editedUserData,
    handleEditClick,
    handleDeleteClick,
    handleSearchChange,
    handlePageChange,
    handleModalClose,
    handleSubmit,
    handleInputChange,
    handleDeleteConfirm,
    handleDeleteCancel,
    loggedInUserId
}) => (
    <section className="p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12 border-none">
        <div className="bg-white dark:bg-gray-800 relative shadow-none sm:rounded-xl overflow-hidden rounded-xl border-none">

        <SectionHeader title="Kelola Akun" onSearchChange={handleSearchChange} className="ml-30" />

                <div className="px-10 py-0 bg-white border-none"> 
                     <UsersTable
                         users={users}
                        currentPage={currentPage}
                         usersPerPage={usersPerPage}
                          handleEditClick={handleEditClick}
                        handleDeleteClick={handleDeleteClick}
                         loggedInUserId={loggedInUserId}
                     />
                </div>
                 <Pagination
                     currentPage={currentPage}
                    usersPerPage={usersPerPage}
                      totalUsers={totalUsers}
                      handlePageChange={handlePageChange}
                 />
            </div>
        </div>
       <UserModal
            isOpen={openModal === 'update-modal'}
             selectedUser={editedUserData}
             handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleModalClose={handleModalClose}
            title="Update User"
        />
         
        <ModalConfirmation
           isOpen={deleteModalOpen}
            icon="exclamation-triangle"
            title={`Hapus akun ${userToDelete?.nama_pegawai}?`}
             message={`Anda akan menghapus akun ${userToDelete?.nama_pegawai}. Data yang dihapus tidak dapat dikembalikan. Pastikan Anda telah mempertimbangkan keputusan ini.`}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
            confirmText="Ya, Hapus"
         />
    </section>
);

export default UserManagementTemplate;