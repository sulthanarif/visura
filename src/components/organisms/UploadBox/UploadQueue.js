import React from "react";
import Icon from "../../atoms/Icon";
import IconWithText from "@/components/molecules/IconWithText";

function UploadQueue({
    showQueue,
    uploadQueueFiles,
    uploadQueueRef,
    uploadQueueFileListContainerRef,
}) {
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
                    {uploadQueueFiles.map((item, index) => (
                        <li
                            key={item.file.name}
                            className={`show ${item.status === "Done" ? "done-item" : "" } ${item.status === "Failed" ? "failed-item" : "" }`}
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