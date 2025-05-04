import React, { useState, useEffect, useRef } from "react";
import Icon from "../../atoms/Icon";
import IconWithText from "@/components/molecules/IconWithText";

const UploadQueue = ({
  showQueue,
  uploadQueueFiles,
  uploadQueueRef,
  uploadQueueFileListContainerRef,
}) => {
  
  const getProgressColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-500";
      case "Failed":
        return "bg-red-500";
      case "Processing...":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const [remainingTimeDisplay, setRemainingTimeDisplay] = useState({});
  const intervalRefs = useRef({});
  const [expandedItems, setExpandedItems] = useState({});

  // Stores start times per file name
  const uploadStartTimes = {};

  const calculateTimeEstimate = (fileSize, progress, fileName) => {
    // Record start time when progress first becomes non-zero
    if (progress > 0 && !uploadStartTimes[fileName]) {
      uploadStartTimes[fileName] = Date.now();
    }

    // Estimate remaining time (same as before)
    const averageTimePerPage = 10; // seconds per page
    const estimatedPages = Math.ceil(fileSize / (100 * 1024));
    const totalEstimatedTime = estimatedPages * averageTimePerPage;
    const remainingTime = totalEstimatedTime * ((100 - progress) / 100);

    // If finished, show actual time spent
    if (progress >= 100 && uploadStartTimes[fileName]) {
      const actualSeconds = Math.floor((Date.now() - uploadStartTimes[fileName]) / 1000);
      return `Done in ${actualSeconds}s`;
    }

    // Otherwise, return remaining time estimate
     if (remainingTime < 60) {
      return `${Math.ceil(remainingTime)}s`;
    } else {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = Math.ceil(remainingTime % 60);
      return `${minutes}m ${seconds}s`;
    }
  };

  useEffect(() => {
    const timer = {};

    uploadQueueFiles.forEach((item) => {
      if (item.status === "Processing...") {
        timer[item.file.name] = setInterval(() => {
          setRemainingTimeDisplay((prev) => ({
            ...prev,
            [item.file.name]: calculateTimeEstimate(item.file.size, item.progress, item.file.name)
          }));
        }, 1000);
      }
    });

    return () => {
      Object.values(timer).forEach(clearInterval);
    };
  }, [uploadQueueFiles]);


  useEffect(() => {
    return () => {
      // Clear intervals when component unmounts or uploadQueueFiles changes
      if(intervalRefs.current) {
        Object.values(intervalRefs.current).forEach(clearInterval);
      }
    };
  }, [uploadQueueFiles]);

  const toggleExpand = (fileName) => {
    setExpandedItems(prev => ({
      ...prev,
      [fileName]: !prev[fileName]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done":
        return <Icon name="check-circle" className="text-green-500" />;
      case "Failed":
        return <Icon name="x" className="text-red-500" />;
      case "Processing...":
        return <Icon name="spinner" className="text-blue-500 animate-spin" />;
      case "Waiting...":
        return <Icon name="clock" className="text-gray-400" />;
      default:
        return <Icon name="question-circle" className="text-gray-500" />;
    }
  };

  const getErrorMessage = (item) => {
    if (!item.error) return null;
    
    let errorMessage = item.error;
    let suggestion = "";
    let errorTitle = "Processing Error";
    
    // Add helpful suggestions based on common errors
    if (errorMessage.includes("timeout")) {
      errorTitle = "Connection Timeout";
      suggestion = "The server took too long to respond. Try uploading a smaller file or check your internet connection.";
    } else if (errorMessage.includes("permission") || errorMessage.includes("access")) {
      errorTitle = "Access Restricted";
      suggestion = "The file appears to be password-protected or has restricted permissions. Please unlock the PDF and try again.";
    } else if (errorMessage.includes("corrupt") || errorMessage.includes("invalid") || errorMessage.includes("damaged")) {
      errorTitle = "File Corruption Detected";
      suggestion = "The PDF file appears to be damaged. Try opening it in a PDF reader first to verify it works, then save a fresh copy and upload again.";
    } else if (errorMessage.includes("size") || errorMessage.includes("large")) {
      errorTitle = "File Size Exceeded";
      suggestion = "This file exceeds our size limits. Please compress it using a tool like Adobe Acrobat or split it into smaller documents.";
    } else if (errorMessage.includes("format") || errorMessage.includes("unsupported")) {
      errorTitle = "Unsupported Format";
      suggestion = "Only standard PDF documents are supported. Please convert your file to PDF format and try again.";
    } else if (errorMessage.includes("encrypt")) {
      errorTitle = "Encrypted Document";
      suggestion = "This PDF is encrypted or password-protected. Please remove security restrictions and try again.";
    } else {
      suggestion = "Please ensure you're uploading a valid PDF file. If this problem persists, contact our support team for assistance.";
    }
    
    return (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-start">
          <Icon name="alert-triangle" className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{errorTitle}</p>
            <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
            <p className="text-xs text-gray-600 mt-2 italic">{suggestion}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const getFileStatus = (item) => {
    if (item.status === "Done") {
      return (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start">
            <Icon name="check-circle" className="text-green-500 mr-2 mt-0.1 flex-shrink-0 size-sm" />
            <div>
              <p className="text-sm font-medium text-green-800">Processing Complete</p>
              <p className="text-xs text-green-700 mt-1">
                Your file has been successfully processed and is ready for review.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (item.status === "Processing...") {
      return (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <Icon name="spinner" className="text-blue-500 mr-2 mt-0.5 flex-shrink-0 animate-spin" />
            <div>
              <p className="text-sm font-medium text-blue-800">Processing in Progress</p>
              <p className="text-xs text-blue-700 mt-1">
                We're analyzing your document and extracting information. This might take a minute.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (item.status === "Waiting...") {
      return (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-start">
            <Icon name="clock" className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-800">Waiting in Queue</p>
              <p className="text-xs text-gray-700 mt-1">
                Your file is waiting to be processed. It will begin automatically.
              </p>
            </div>
          </div>
        </div>
      );
    } else if (item.status === "Failed") {
      return getErrorMessage(item);
    }
    
    return null;
  };

  return (
    <div
      className={`upload-queue ${showQueue ? "show" : ""}`}
      id="uploadQueue"
      ref={uploadQueueRef}
    >
      <h2>
        <IconWithText icon="upload" text="Upload Queue" />
      </h2>
      <div
        className="file-list-container"
        ref={uploadQueueFileListContainerRef}
      >
        <ul className="file-list">
          {uploadQueueFiles.map((item, index) => (
            <li
              key={item.file.name}
              className={`show ${item.status === "Done" ? "done-item" : ""} mb-3 border-b pb-4`}
            >
              <div className="flex flex-col w-full gap-2">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(item.file.name)}
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="text-sm">{item.file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    
                    <Icon 
                      name={expandedItems[item.file.name] ? "chevron-up" : "chevron-down"} 
                      className="text-gray-600 transition-transform duration-200" 
                    />
                  </div>
                </div>

                {/* Expandable content */}
                <div className={`transition-all duration-300 overflow-hidden ${expandedItems[item.file.name] ? "max-h-80" : "max-h-0"}`}>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-600">
                      <span>File size: {formatFileSize(item.file.size)}</span>
                    </div>

                    <div className="text-xs text-gray-600">
                      <span>
                        {item.status === "Processing..." ? "Remaining time: " : "Time: "}
                        {calculateTimeEstimate(item.file.size, item.progress, item.file.name)}
                      </span>
                    </div>
                  </div>

                  {getFileStatus(item)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default UploadQueue;