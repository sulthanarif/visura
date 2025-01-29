import React from "react";
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

  const calculateTimeEstimate = (fileSize, progress) => {
    // Assume 1MB takes ~2 seconds to process
    const baseRate = 1; // seconds per MB
    const fileSizeInMB = fileSize / (1024 * 1024);
    const totalEstimatedTime = fileSizeInMB * baseRate;
    const remainingTime = totalEstimatedTime * ((100 - progress) / 100);

    if (remainingTime < 60) {
      return `${Math.ceil(remainingTime)}s`;
    } else {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = Math.ceil(remainingTime % 60);
      return `${minutes}m ${seconds}s`;
    }
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
              className={`show ${item.status === "Done" ? "done-item" : ""}`}
            >
              <div className="flex flex-col w-full gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{item.file.name}</span>
                  <span
                    className={`status ${
                      item.status === "Done" ? "text-green-600" : ""
                    }  ${item.status === "Failed" ? "animate-shake" : ""}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* calculateTimeEstimate(item.file.size, item.progress) */}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    <span>File size: {formatFileSize(item.file.size)}</span>
                  </div>

                  <div className="text-xs text-gray-600">
                    <span>
                      Remaining time:{" "}
                      {calculateTimeEstimate(item.file.size, item.progress)}
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-1 bg-gray-200 rounded-full overflow-hidden ">
                  <div
                    className={`
                        absolute top-0 left-0 h-full 
                        bg-blue-500
                        before:absolute before:content-[''] 
                        before:top-0 before:left-0
                        before:w-full before:h-full 
                        before:bg-blue-500
                        transition-all duration-300
                        ${item.status === "Processing..." ? "animate-loading-bar" : ""}
                        ${item.status === "Failed" ? "animate-shake" : ""}
                    `}
                  />
                  <div
                    className={`
                        absolute top-0 left-0 h-full rounded-full
                        transition-all duration-300 ease-out
                        ${getProgressColor(item.status)}
                        ${item.status === "Failed" ? "animate-shake" : ""}
                    `}
                    style={{ width: `${item.progress || 0}%` }}
                  />
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