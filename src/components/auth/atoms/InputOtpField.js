import React, { useState } from "react";

export default function InputOtpField({
    label,
    type = "number",
    name,
    value,
    onChange,
    placeholder,
}) {
    const [isFilled, setIsFilled] = useState(false);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(e);
        setIsFilled(newValue !== "");
    };

    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={`block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    isFilled ? "bg-white" : "bg-gray-100"
                }`}
            />
        </div>
    );
}
