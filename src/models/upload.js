// src/models/upload.js
import { useState } from "react";

export const useUpload = () => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [projectName, setProjectName] = useState("");
  const handleAddFile = (newFiles) => {
    if (files.length + newFiles.length > 10) {
      setErrorMessage("Maximum 10 files allowed.");
      return;
    }
    
    const validFiles = [];
    
    for (const file of newFiles) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} exceeds 10MB!`);
      } else {
        // Check if file is a PDF
        const fileExtension = file.name.toLowerCase().split('.').pop();
        if (fileExtension !== 'pdf') {
          setErrorMessage(`File ${file.name} is not a PDF. Only PDF files are allowed.`);
        } else {
          validFiles.push(file);
        }
      }
    }
    
    if (validFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...validFiles]);
    }
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
  };
  const resetState = () => {
    setErrorMessage("");
    setProjectName("");
    setFiles([]);
  };
  const setFilesState = (fileList) => {
    setFiles(fileList);
  };

  return {
    files,
    handleAddFile,
    handleRemoveFile,
    errorMessage,
    setErrorMessage,
    projectName,
    setProjectName,
    resetState,
    setFiles: setFilesState,
  };
};
