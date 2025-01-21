// src/components/organisms/UploadBox/FileUploadArea.js
import React, { useRef } from "react";
import Icon from "../../atoms/Icon";

const FileUploadArea = ({ handleFileChange, fileInputRef }) => {
  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };
  return (
    <>
      <h2>
        <Icon name="file-upload" />
        Upload File Here
      </h2>
      <div className="upload-area" onClick={handleUploadAreaClick}>
        <Icon name="cloud-upload-alt" />
        <p>Click to upload</p>
      </div>
        <input
          type="file"
          id="fileInput"
          accept="application/pdf"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileInputRef}
      />
    </>
  );
}

export default FileUploadArea;