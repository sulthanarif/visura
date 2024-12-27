// src/models/upload.js
import { useState } from "react";

export const useUpload = () => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [projectName, setProjectName] = useState("");
  const handleAddFile = (newFiles) => {
    if (files.length + newFiles.length > 20) {
      setErrorMessage("Maksimal 20 file yang dapat diunggah.");
      return;
    }
    newFiles.forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} melebihi 20MB!`);
      } else {
        setFiles((prevFiles) => [...prevFiles, file]);
      }
    });
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
