// src/components/atoms/Icon.js
import React from 'react';

function Icon({ name, ...props }) {
  return <i className={`fas fa-${name}`} {...props} />;
}

export default Icon;