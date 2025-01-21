// src/components/molecules/FileList.js
import React from 'react';
import FileListItem from '../atoms/FileListItem';

const FileList = ({ files, onRemoveFile }) =>{
    return (
        <ul className="file-list">
            {files && files.map((file, index) => (
                <FileListItem
                    key={file.name}
                    file={file}
                    size={file.size}
                    index={index}
                    onRemove={() => onRemoveFile(file)}
                />
            ))}
        </ul>
    );
}

export default FileList;