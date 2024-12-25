// src/components/molecules/InputWithLabel.js
import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

function InputWithLabel({ label, type, placeholder, value, onChange, htmlFor, ...props }) {
    return (
        <div>
            <Label htmlFor={htmlFor} {...props}>{label}</Label>
            <Input type={type} placeholder={placeholder} value={value} onChange={onChange} {...props} />
        </div>
    );
}

export default InputWithLabel;