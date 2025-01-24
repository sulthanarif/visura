// src/components/templates/DefaultLayout.js
import React from 'react';
import Header from '../../components/organisms/Header';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default AdminLayout;