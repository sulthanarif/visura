// src/components/organisms/UploadBox/index.js
import React, { useState, useRef, useEffect } from "react";
import Button from "../../atoms/Button";
import { useUpload } from "@/models/upload";
import { useRouter } from "next/router";
import ProjectInput from "./ProjectInput";
import FileUploadArea from "./FileUploadArea";
import FileListDisplay from "./FileListDisplay";
import UploadQueue from "./UploadQueue";
import PreviewTransmittal from "./PreviewTransmittal";


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
     const [activeQueueItem, setActiveQueueItem] = useState(null);
    const initialPreviewData = useRef({});

    useEffect(() => {
        resetState();
    }, []);

    useEffect(() => {
        if (files.length > 0) {
            if(fileListContainerRef.current){
                console.log("useEffect: adding show class");
                fileListContainerRef.current.classList.add("show");
            }
        } else {
            if(fileListContainerRef.current){
                console.log("useEffect: removing show class");
                fileListContainerRef.current.classList.remove("show");
            }
        }
    }, [files]);

    useEffect(() => {
        if(showQueue){
            if(uploadQueueRef.current){
                uploadQueueRef.current.classList.add("show");
            }
            if(uploadQueueFileListContainerRef.current){
                uploadQueueFileListContainerRef.current.classList.add("show");
            }
        } else {
            if(uploadQueueRef.current){
                uploadQueueRef.current.classList.remove("show");
            }
            if(uploadQueueFileListContainerRef.current){
                uploadQueueFileListContainerRef.current.classList.remove("show");
            }
        }
    }, [showQueue]);


    const handleFileChange = (e) => {
        console.log("handleFileChange: files changed");
        const newFiles = Array.from(e.target.files);
        handleAddFile(newFiles);
        setErrorMessage("");
    };
    const handleScanButton = async () => {
        if (files.length === 0 && uploadQueueFiles.length === 0) {
            setErrorMessage("Tidak ada file yang diunggah");
            return;
        }
        setShowQueue(true);
        const newQueueItems = files.map((file) => ({ file, status: "Waiting..." }));
        setUploadQueueFiles((prev) => [...prev, ...newQueueItems]);
        const filesTemp = [...files];
        setFiles([]);

        try {
            setUploadStatus("Uploading to Server...");
            setIsUploading(true);

            setUploadQueueFiles((prev) =>
                prev.map((item) =>
                    filesTemp.includes(item.file)
                        ? { ...item, status: "Uploading..." }
                        : item
                )
            );
            const formData = new FormData();
            filesTemp.forEach((file) => {
                formData.append("pdfFile", file);
            });
            const response = await fetch("/api/ocr", {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Upload failed: ${errorData.message}`);
            }

            setUploadQueueFiles((prev) =>
                prev.map((item) =>
                    filesTemp.includes(item.file)
                        ? { ...item, status: "Scanning..." }
                        : item
                )
            );
            setUploadStatus("Scanning...");
            setIsScanning(true);
            const data = await response.json();
            setResults(prev => {
                const newResult = [...prev];
                data.data.forEach((item, index) => {
                    newResult.push({...item, id: prev.length + index})
                    initialPreviewData.current[prev.length + index] = {
                        project: projectName,
                        drawing: item.title,
                        revision: item.revision,
                        drawingCode: item.drawingCode,
                        date: item.date,
                    };
                });
                return newResult
            });
            setPreviewData(initialPreviewData.current);
            setCsvFileName(data.csvFileName);
            setUploadStatus("Upload and scanning successful.");
            setShowPreview(true);
            setUploadQueueFiles((prev) =>
                prev.map((item) =>
                    filesTemp.includes(item.file) ? { ...item, status: "Done" } : item
                )
            );
            setActiveQueueItem(0);
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
        }
    };
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < results.length) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handlePreviewChange = (index, field, value) => {
        setPreviewData((prev) => {
            const updatedPreview = { ...prev };
            updatedPreview[index] = { ...updatedPreview[index], [field]: value };
            return updatedPreview;
        });
    };
    const handleDownloadCSV = async () => {
        const link = document.createElement("a");
        link.href = `/output/${csvFileName}`;
        link.download = csvFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        try{
            setCleanupStatus("Cleaning up files, please wait...");
            const response = await fetch("/api/cleanup", { method: "POST" });
            if (!response.ok) {
                throw new Error("Failed to clean up files");
            }
            setCleanupStatus("Cleanup completed, refreshing...");
            router.reload(); // Refresh halaman
        }
        catch(error){
            console.error("Error during cleanup: ", error);
            setCleanupStatus(`Failed to clean up files ${error.message || ""}`);
        }
    };
    
    const handleHideQueue = () => {
        setShowQueue(false);
    };

    function updatePageInfo() {
        const pageInfo = document.getElementById("pageInfo");
        if (pageInfo) {
            const totalPages = results.length;
            pageInfo.textContent = `${currentPage} / ${totalPages}`;
            const prevBtn = document.getElementById("prevBtn");
            const nextBtn = document.getElementById("nextBtn");
            if (currentPage === 1) {
                if (prevBtn) prevBtn.disabled = true;
            } else {
                if (prevBtn) prevBtn.disabled = false;
            }
            if (totalPages === 0) {
                if (nextBtn) nextBtn.disabled = true;
            } else {
                if (nextBtn) nextBtn.disabled = false;
            }
        }
    }
    useEffect(() => {
        updatePageInfo();
    }, [currentPage, results]);


    const handleQueueItemClick = (index, file) => {
        setActiveQueueItem(index);
        setCurrentPage(index + 1); // Move to the matching results page
        setShowPreview(true);
      };

    return (
        <div className="upload-box">
            <ProjectInput projectName={projectName} setProjectName={setProjectName} />
            <FileUploadArea handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
             <FileListDisplay
                 files={files}
                 onRemoveFile={handleRemoveFile}
                 fileListContainerRef={fileListContainerRef}
           />
           <p className="note">
              *Mendukung file PDF (Maximal 20Mb per file, maksimal 20 file)
           </p>
            <p className="error-message" id="errorMessage">{errorMessage}</p>
            <Button onClick={handleScanButton} id="scanButton">
                Scan File
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
             csvFileName={csvFileName}
             handleDownloadCSV={handleDownloadCSV}

           />
           <UploadQueue
              showQueue={showQueue}
              uploadQueueFiles={uploadQueueFiles}
              uploadQueueRef={uploadQueueRef}
              uploadQueueFileListContainerRef={uploadQueueFileListContainerRef}
              onQueueItemClick={handleQueueItemClick}
              activeQueueItem={activeQueueItem}
            />
        </div>
    );
}

export default UploadBox;