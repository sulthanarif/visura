// src/components/atoms/Icon.js
import React from 'react';

function Icon({ name, ...props }) {
  return <i className={`fa fa-${name}`}  {...props} />;
}

export default Icon;