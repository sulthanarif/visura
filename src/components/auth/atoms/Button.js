import React from 'react';

export default function Button({ text, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="button-class"
    >
      {text}
    </button>
  );
}
