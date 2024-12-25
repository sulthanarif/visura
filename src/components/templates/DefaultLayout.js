// src/components/templates/DefaultLayout.js
import React from 'react';
import Header from '../organisms/Header';

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default DefaultLayout;