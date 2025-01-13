// src/components/organisms/UploadBox/UploadQueue.js
import React from "react";
import Icon from "../../atoms/Icon";
import IconWithText from "@/components/molecules/IconWithText";

function UploadQueue({
    showQueue,
    uploadQueueFiles,
    uploadQueueRef,
    uploadQueueFileListContainerRef,
}) {
    // Fungsi untuk menentukan warna progress bar berdasarkan status
    const getProgressColor = (status) => {
        switch(status) {
            case "Done": return "bg-green-500";
            case "Failed": return "bg-red-500";
            case "Processing...": return "bg-blue-500";
            default: return "bg-gray-300";
        }
    };

    return (
        <div className={`upload-queue ${showQueue ? "show" : ""}`} id="uploadQueue" ref={uploadQueueRef}>
            <h2>
                <IconWithText icon="upload" text="Upload Queue" />
            </h2>
            <div
                className="file-list-container"
                id="uploadQueueFileListContainer"
                ref={uploadQueueFileListContainerRef}
            >
                <ul className="file-list" id="uploadQueueFileList">
                    {uploadQueueFiles.map((item, index) => {
                        // Menghitung estimasi waktu jika status "Processing..."
                        const progress = item.progress || 0;
                        const elapsedTime = item.elapsedTime || 0; // Waktu yang telah berlalu dalam detik
                        const remainingTime = elapsedTime > 0 ? (100 - progress) * (elapsedTime / progress) : 0;
                        const remainingTimeInMinutes = Math.ceil(remainingTime / 60);

                        return (
                            <li
                                key={item.file.name}
                                className={`show ${item.status === "Done" ? "done-item" : ""} ${item.status === "Failed" ? "failed-item" : ""}`}
                            >
                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">{item.file.name}</span>
                                        <span className={`status text-sm ${
                                            item.status === "Done" ? "text-green-600" : ""} 
                                            ${item.status === "Failed" ? "text-red-600" : ""}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${getProgressColor(item.status)} 
                                                    transition-all duration-300 ease-in-out`}
                                            style={{ 
                                                width: `${progress}%`,
                                                transition: 'width 0.3s ease-in-out'
                                            }}
                                        />
                                    </div>

                                    {/* Estimation */}
                                    {item.status === "Processing..." && (
                                        <span className="text-xs text-gray-500">
                                            Estimated time: ~{remainingTimeInMinutes} min
                                        </span>
                                    )}

                                    {/* Error message */}
                                    {item.status === "Failed" && item.error && (
                                        <span className="text-xs text-red-500">
                                            Error: {item.error}
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default UploadQueue;
