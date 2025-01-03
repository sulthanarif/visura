import React, { useState, useRef, useEffect } from "react";
import Button from "../../atoms/Button";
import { useUpload } from "@/models/upload";
import { useRouter } from "next/router";
import ProjectInput from "./ProjectInput";
import FileUploadArea from "./FileUploadArea";
import FileListDisplay from "./FileListDisplay";
import UploadQueue from "./UploadQueue";
import PreviewTransmittal from "./PreviewTransmittal";
import IconWithText from "@/components/molecules/IconWithText";
import Icon from "@/components/atoms/Icon";

function UploadBox() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const {
    files,
    handleAddFile,
    handleRemoveFile,
    errorMessage,
    setErrorMessage,
    projectName,
    setProjectName,
    resetState,
    setFiles,
  } = useUpload();

  const [showPreview, setShowPreview] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [results, setResults] = useState([]);
  const [csvFileName, setCsvFileName] = useState(null);
  const [cleanupStatus, setCleanupStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadQueueFiles, setUploadQueueFiles] = useState([]);
  const [previewData, setPreviewData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const fileListContainerRef = useRef(null);
  const uploadQueueRef = useRef(null);
  const uploadQueueFileListContainerRef = useRef(null);
  const initialPreviewData = useRef({});
  const [errorMessageModal, setErrorMessageModal] = useState("");

  const [showTransmittalModal, setShowTransmittalModal] = useState(false);
  const [step, setStep] = useState(1);
  const [modalProjectName, setModalProjectName] = useState(projectName);
  const [modalDocumentName, setModalDocumentName] = useState("");
  const [transmittalNumber, setTransmittalNumber] = useState("");
  const [manualCsvFileName, setManualCsvFileName] = useState("");

  useEffect(() => {
    if (uploadStatus) {
      const timer = setTimeout(() => {
        setUploadStatus("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    resetState();
  }, []);

  useEffect(() => {
    if (files.length > 0) {
      if (fileListContainerRef.current) {
        console.log("useEffect: adding show class");
        fileListContainerRef.current.classList.add("show");
      }
    } else {
      if (fileListContainerRef.current) {
        console.log("useEffect: removing show class");
        fileListContainerRef.current.classList.remove("show");
      }
    }
  }, [files]);

  useEffect(() => {
    if (showQueue) {
      if (uploadQueueRef.current) {
        uploadQueueRef.current.classList.add("show");
      }
      if (uploadQueueFileListContainerRef.current) {
        uploadQueueFileListContainerRef.current.classList.add("show");
      }
    } else {
      if (uploadQueueRef.current) {
        uploadQueueRef.current.classList.remove("show");
      }
      if (uploadQueueFileListContainerRef.current) {
        uploadQueueFileListContainerRef.current.classList.remove("show");
      }
    }
  }, [showQueue]);

  const handleFileChange = (e) => {
    e.preventDefault();
    console.log("handleFileChange: files changed");
    const newFiles = Array.from(e.target.files);
    handleAddFile(newFiles);
    setErrorMessage("");
  };

  const handleScanButton = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (files.length === 0 && uploadQueueFiles.length === 0) {
      setErrorMessage("Tidak ada file yang diunggah");
      return;
    }
    setShowQueue(true);
    const newQueueItems = files.map((file) => ({
      file: { name: file.name },
      status: "Waiting...",
    }));
    setUploadQueueFiles((prev) => [...prev, ...newQueueItems]);
    const filesTemp = [...files];
    setFiles([]);
    try {
      setIsUploading(true);
      setUploadStatus("Uploading to Server...");
      const formData = new FormData();
      filesTemp.forEach((file) => {
        formData.append("pdfFile", file);
      });
      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        setUploadStatus(`${responseData.message}`);
        return;
      }
      const data = await responseData;
      if (data.uploadQueueFiles) {
        setUploadQueueFiles(data.uploadQueueFiles);
        if (data.uploadQueueFiles.length > 0) {
          if (
            data.uploadQueueFiles[0].status === "Done" ||
            data.uploadQueueFiles[0].status === "Failed"
          ) {
            setShowPreview(true);
          }
        }
      }
      if (data.data) {
        setResults((prev) => {
          const newResult = [...prev];
          data.data.forEach((item, index) => {
            newResult.push({ ...item, id: prev.length + index });
            initialPreviewData.current[prev.length + index] = {
              project: projectName,
              drawing: item.title,
              revision: item.revision,
              drawingCode: item.drawingCode,
              date: item.date,
              filename: item.filename,
            };
          });
          return newResult;
        });
        setPreviewData((prev) => ({ ...prev, ...initialPreviewData.current }));
        setIsScanning(true);
      }

      if (data.error) {
        setErrorMessage(data.error);
      }
      if (data.csvFileName) {
        setCsvFileName(data.csvFileName);
        setIsUploading(false);
        setUploadStatus("Upload and scanning successful.");
      }
    } catch (error) {
      console.error("Error during upload or processing:", error);
      setUploadStatus(
        `Upload failed: ${error.message || "An unexpected error occurred"}`
      );
      setUploadQueueFiles((prev) =>
        prev.map((item) =>
          filesTemp.includes(item.file) ? { ...item, status: "Failed" } : item
        )
      );
    } finally {
      setIsUploading(false);
      setIsScanning(false);
    }
  };

  const handleNext = () => {
    if (currentPage < results.length) {
      setCurrentPage((prev) => {
        const nextPage = prev + 1;
        return nextPage;
      });
    }
  };
  
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => {
        const newPage = prev - 1;
        return newPage;
      });
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };


  const handlePreviewChange = (index, field, value) => {
    setPreviewData((prev) => {
      const updatedPreview = { ...prev };
      updatedPreview[index] = { ...updatedPreview[index], [field]: value };
      return updatedPreview;
    });
  }

  const handleGenerateTransmittal = () => {
    setErrorMessageModal("");
    setModalProjectName(projectName);
    setShowTransmittalModal(true);
  };

  const confirmGenerateTransmittal = async () => {
    setErrorMessageModal("");
    if (
      !modalProjectName ||
      !modalDocumentName ||
      !transmittalNumber ||
      !manualCsvFileName
    ) {
      setErrorMessageModal("All fields are required.");
      return;
    }
    try {
      const transmittalData = Object.values(previewData);
      const response = await fetch("/api/generate-transmittal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transmittalData,
          projectName: modalProjectName,
          documentName: modalDocumentName,
          transmittalNumber,
          csvFileName: manualCsvFileName,
        }),
      });
      if (!response.ok) throw new Error("Failed to generate transmittal");
      const data = await response.json();
      setCsvFileName(data.csvFileName);

      // download file
      const link = document.createElement("a");
      link.href = `/output/${data.csvFileName}`;
      link.download = data.csvFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // we can use this cleanup function to remove the file from the server
      setCleanupStatus("Cleaning up files, please wait...");
      const cleanupResponse = await fetch("/api/cleanup", { method: "POST" });

      setShowTransmittalModal(false);

      if (!cleanupResponse.ok) {
        const errorData = await cleanupResponse.json();
        throw new Error(`Failed to clean up files ${errorData.message || ""}`);
      }
      setCleanupStatus("Cleanup completed, refreshing...");
      router.reload(); // Refresh halaman
    } catch (error) {
      console.error("Error during generate transmittal: ", error);
      setCleanupStatus(`Failed to generate transmittal ${error.message || ""}`);
    }
  };

  const handleHideQueue = () => {
    setShowQueue(false);
  };
  const handleModalClose = () => {
    setShowTransmittalModal(false);
    setStep(1); // Reset step to 1 when modal closes
  };

  function updatePageInfo() {
    console.log('updatePageInfo', { currentPage, totalPages: results.length });
    
    const pageInfo = document.getElementById("pageInfo");
    if (pageInfo) {
      const totalPages = results.length;
      pageInfo.textContent = `${currentPage} / ${totalPages}`;
      
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      
      // Update prev button state
      if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
      }
      
      // Update next button state
      if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
      }
    }
  }

  useEffect(() => {
    updatePageInfo();
  }, [currentPage, results]);

  return (
    <div className="upload-box">
      <ProjectInput projectName={projectName} setProjectName={setProjectName} />
      <FileUploadArea
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
      />
      <FileListDisplay
        files={files}
        onRemoveFile={handleRemoveFile}
        fileListContainerRef={fileListContainerRef}
      />
      <p className="note">
        *Mendukung file PDF (Maximal 20Mb per file, maksimal 20 file)
      </p>
      <p className="upload-status" id="uploadStatus">
        {uploadStatus}
      </p>
      <p className="error-message" id="errorMessage">
        {errorMessage}
      </p>
      <Button onClick={handleScanButton} id="scanButton">
        <IconWithText icon="paper-plane" text="Scan" />
      </Button>
      <PreviewTransmittal
        showPreview={showPreview}
        projectName={projectName}
        results={results}
        currentPage={currentPage}
        previewData={previewData}
        handlePreviewChange={handlePreviewChange}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleGenerateTransmittal={handleGenerateTransmittal}
      />
      {showTransmittalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative space-y-6">
            <h1 className="text-2xl font-semibold text center">
              A Few Action Needed
            </h1>
            {/* Close Button (X icon) */}
            <button
              className="top-1 right-4 text-gray-500 hover:text-gray-700 transition max-w-max mb-4 absolute"
              onClick={handleModalClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Stepper */}
            <ol className="flex items-center w-full mb-8">
              <li
                className={`flex w-full items-center transition-all duration-300 ease-in-out ${
                  step >= 1
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-gray-500 dark:text-gray-400"
                } after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${
                    step >= 1
                      ? "bg-blue-100 dark:bg-blue-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  } rounded-full lg:h-12 lg:w-12 shrink-0`}
                >
                  <svg
                    className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                      step >= 1
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-500 dark:text-gray-400"
                    } lg:w-6 lg:h-6`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                  </svg>
                </div>
              </li>
              <li
                className={`flex w-full items-center transition-all duration-300 ease-in-out ${
                  step >= 2
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-gray-500 dark:text-gray-400"
                } after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${
                    step >= 2
                      ? "bg-blue-100 dark:bg-blue-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  } rounded-full lg:h-12 lg:w-12 shrink-0`}
                >
                  <svg
                    className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                      step >= 2
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-500 dark:text-gray-400"
                    } lg:w-6 lg:h-6`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 14"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM2 12V6h16v6H2Z" />
                    <path d="M6 8H4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2Zm8 0H9a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2Z" />
                  </svg>
                </div>
              </li>
              <li
                className={`flex items-center transition-all duration-300 ease-in-out ${
                  step >= 3
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${
                    step >= 3
                      ? "bg-blue-100 dark:bg-blue-800"
                      : "bg-gray-100 dark:bg-gray-700"
                  } rounded-full lg:h-12 lg:w-12 shrink-0`}
                >
                  <svg
                    className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                      step >= 3
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-500 dark:text-gray-400"
                    } lg:w-6 lg:h-6`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 20"
                  >
                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                  </svg>
                </div>
              </li>
            </ol>

            {/* Step 1: Project Name */}
            {step === 1 && (
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  type="text"
                  value={modalProjectName}
                  onChange={(e) => setModalProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            )}

            {/* Step 2: Document Name + Transmittal Number */}
            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">
                  Document Name
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  type="text"
                  value={modalDocumentName}
                  onChange={(e) => setModalDocumentName(e.target.value)}
                  placeholder="Enter document name"
                />
                <label className="block text-lg font-medium text-gray-700">
                  Transmittal Number
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  type="text"
                  value={transmittalNumber}
                  onChange={(e) => setTransmittalNumber(e.target.value)}
                  placeholder="Enter transmittal number"
                />
              </div>
            )}

            {/* Step 3: CSV File Name */}
            {step === 3 && (
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">
                  CSV File Name
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                  type="text"
                  value={manualCsvFileName}
                  onChange={(e) => setManualCsvFileName(e.target.value)}
                  placeholder="Enter CSV file name"
                />
              </div>
            )}
            {errorMessageModal && (
              <p className="text-red-500 text-sm mb-4">{errorMessageModal}</p>
            )}
            {/* Step controls */}
            <div className="flex justify-end space-x-3">
              {step > 1 && (
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-700 bg-opacity-90 transition"
                  onClick={handlePrevStep}
                >
                  <IconWithText icon="arrow-left" text="Back" />
                </button>
              )}
              {step < 3 && (
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:opacity-90 transition"
                  onClick={handleNextStep}
                >
                  <span className="mr-2">
                    {step === 1 && "Set Details"}
                    {step === 2 && "Last Touch"}
                  </span>
                  <Icon name="arrow-right" />
                </button>
              )}
              {step === 3 && (
                <button
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white hover:opacity-90 transition"
                  onClick={confirmGenerateTransmittal}
                >
                  <IconWithText icon="download" text="Generate" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <UploadQueue
        showQueue={showQueue}
        uploadQueueFiles={uploadQueueFiles}
        uploadQueueRef={uploadQueueRef}
        uploadQueueFileListContainerRef={uploadQueueFileListContainerRef}
      />
    </div>
  );
}

export default UploadBox;
