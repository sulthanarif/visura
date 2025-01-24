// src/components/atoms/Button.js
import React from 'react';

const Button = ({ children, onClick, type = 'button', className, ...props }) => (
  <button onClick={onClick} type={type} className={`${className}`} {...props}>
    {children}
  </button>
);

export default Button;
