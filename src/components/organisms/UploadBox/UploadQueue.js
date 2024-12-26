// src/components/organisms/UploadBox/UploadQueue.js
import React from "react";
import Icon from "../../atoms/Icon";

function UploadQueue({ showQueue, uploadQueueFiles, uploadQueueRef, uploadQueueFileListContainerRef, onQueueItemClick, activeQueueItem }) {
    return (
        <div className={`upload-queue ${showQueue ? "show" : ""}`} id="uploadQueue" ref={uploadQueueRef}>
            <h3>
                <Icon name="cloud-arrow-up" />
                Upload Queue
            </h3>
            <div
                className="file-list-container"
                id="uploadQueueFileListContainer"
                ref={uploadQueueFileListContainerRef}
            >
                <ul className="file-list" id="uploadQueueFileList">
                    {uploadQueueFiles.map(({ file, status }, index) => (
                        <li
                            key={file.name}
                            className={`show ${status === "Done" ? "done-item" : "" } ${activeQueueItem === index ? "active" : ""}`}
                            onClick={() => onQueueItemClick(index, file)}
                        >
                             <span>{file.name}</span>
                            <span className={`status ${status === "Done" ? "done-item" : "" }`}>{status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UploadQueue;