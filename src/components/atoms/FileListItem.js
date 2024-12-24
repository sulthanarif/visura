// src/components/atoms/FileListItem.js
import React from 'react';

function FileListItem({ file, onRemove }) {
    return (
        <li>
            <span>{file.name}</span>
            <button type="button" onClick={onRemove}>Hapus</button>
        </li>
    );
}

export default FileListItem;