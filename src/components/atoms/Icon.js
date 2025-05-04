// src/components/atoms/Icon.js
import React from 'react';

const Icon = ({ 
  name, 
  className = '', 
  size = null, 
  color = null,
  ...props 
}) => {
  let sizeClass = '';
  if (size) {
    sizeClass = `fa-${size}`;
  }
  
  const style = {};
  if (color) {
    style.color = color;
  }
  
  return (
    <i 
      className={`fa fa-${name} ${sizeClass} ${className}`} 
      style={style}
      {...props} 
    />
  );
};

export default Icon;