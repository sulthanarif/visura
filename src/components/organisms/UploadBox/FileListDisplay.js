// src/components/organisms/UploadBox/FileListDisplay.js
import React from "react";
import FileList from "../../molecules/FileList";

const FileListDisplay = ({ files, onRemoveFile, fileListContainerRef }) => {
  return (
    <div className="file-list-container" id="fileListContainer" ref={fileListContainerRef}>
      <FileList files={files} onRemoveFile={onRemoveFile} />
    </div>
  );
}

export default FileListDisplay;