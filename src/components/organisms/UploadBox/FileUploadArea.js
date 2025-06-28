import React, { useRef, useState } from "react";
import Icon from "../../atoms/Icon";

const FileUploadArea = ({ handleFileChange, fileInputRef }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event object that matches the structure expected by handleFileChange
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files
        }
      };
      
      handleFileChange(syntheticEvent);
      e.dataTransfer.clearData();
    }
  };

  return (
    <>
      <h2>
        <Icon name="file-upload" />
        Upload File Here
      </h2>
      <div 
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onClick={handleUploadAreaClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Icon name={isDragOver ? "download" : "cloud-upload-alt"} />
        <p>{isDragOver ? "Drop files here" : "Click to upload or drag & drop files"}</p>
        {isDragOver && (
          <p className="drag-hint">Release to upload PDF files</p>
        )}
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
};

export default FileUploadArea;