import React, { useEffect, useState } from 'react';
import Icon from './Icon';

const FileListItem = ({ file, onRemove, index }) => {
    const [show, setShow] = useState(false);
    const [remove, setRemove] = useState(false);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, index * 150);
        return () => clearTimeout(timer);
    }, [index]);

    const handleRemove = () => {
        setRemove(true);
        setTimeout(() => {
            onRemove();
        }, 300);
    };

    return (
        <li className={`
            flex items-center justify-between
            p-3 mb-2
            bg-white rounded-lg
            border border-gray-200
            transform transition-all duration-300 ease-in-out
            hover:shadow-md hover:border-blue-200
            ${show ? 'show' : ''}
            ${remove ? 'remove' : ''}
        `}>
            <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                    <Icon name="file-pdf" className="w-3 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                    </p>
                </div>
            </div>
            <button
                type="button"
                onClick={handleRemove}
                className="ml-4 p-1.5 rounded-full
                    text-gray-400 hover:text-red-500
                    hover:bg-red-50
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
                <Icon name="trash" />
            </button>
        </li>
    );
};

export default FileListItem;