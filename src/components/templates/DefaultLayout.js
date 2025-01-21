// src/components/templates/DefaultLayout.js
import React from 'react';
import Header from '../organisms/Header';

const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
}

export default DefaultLayout;