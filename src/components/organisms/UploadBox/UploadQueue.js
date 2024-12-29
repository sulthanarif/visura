import React from "react";
import Icon from "../../atoms/Icon";

function UploadQueue({
    showQueue,
    uploadQueueFiles,
    uploadQueueRef,
    uploadQueueFileListContainerRef,
    onQueueItemClick,
    activeQueueItem,
}) {
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
                    {uploadQueueFiles.map((item, index) => (
                        <li
                            key={item.file.name}
                            className={`show ${item.status === "Done" ? "done-item" : "" } ${item.status === "Failed" ? "failed-item" : ""} ${activeQueueItem === index ? "active" : ""}`}
                            onClick={() => onQueueItemClick(index, item.file)}
                        >
                            <span>{item.file.name}</span>
                            <span className={`status ${item.status === "Done" ? "done-item" : "" }  ${item.status === "Failed" ? "failed-item" : ""}`}>{item.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UploadQueue;