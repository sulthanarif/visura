// src/components/atoms/Button.js
import React from 'react';

function Button({ children, onClick, type = 'button', ...props }) {
  return (
    <button onClick={onClick} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;