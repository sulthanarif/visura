// src/components/atoms/Input.js
import React from 'react';

function Input({ type = 'text', placeholder, value, onChange, ...props }) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} {...props} />;
}

export default Input;