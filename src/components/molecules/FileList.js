// src/components/molecules/FileList.js
import React from 'react';
import FileListItem from '../atoms/FileListItem';

function FileList({ files, onRemoveFile }) {
    return (
        <ul className="file-list">
            {files && files.map(file => (
                <FileListItem
                    key={file.name}
                    file={file}
                    onRemove={() => onRemoveFile(file)}
                />
            ))}
        </ul>
    );
}

export default FileList;