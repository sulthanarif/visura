// src/components/atoms/Icon.js
import React from 'react';

const Icon = ({ name, className, ...props }) => (
  <i className={`fa fa-${name} ${className}`} {...props} />
);

export default Icon;