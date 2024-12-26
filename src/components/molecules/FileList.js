// src/components/molecules/FileList.js
import React from 'react';
import FileListItem from '../atoms/FileListItem';

function FileList({ files, onRemoveFile }) {
    console.log('from file list FileList: files received', files);
    return (
        <ul className="file-list">
            {files && files.map((file, index) => (
                <FileListItem
                    key={file.name}
                    file={file}
                    index={index}
                    onRemove={() => onRemoveFile(file)}
                />
            ))}
        </ul>
    );
}

export default FileList;