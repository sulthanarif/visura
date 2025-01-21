// src/components/templates/DefaultLayout.js
import React from 'react';
import HeaderAdmin from '../admin/organism/HeaderAdmin';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <HeaderAdmin />
      <main>{children}</main>
    </div>
  );
}

export default AdminLayout;