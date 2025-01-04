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
import TransmittalModal from "@/components/molecules/TransmittalModal";

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
    const [errorMessageModal, setErrorMessageModal] = useState('');


    const [showTransmittalModal, setShowTransmittalModal] = useState(false);
    // const [step, setStep] = useState(1);
    // const [modalProjectName, setModalProjectName] = useState(projectName);
    // const [modalDocumentName, setModalDocumentName] = useState("");
    // const [transmittalNumber, setTransmittalNumber] = useState("");
    // const [manualCsvFileName, setManualCsvFileName] = useState("");


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
        if (files.length === 0 && uploadQueueFiles.length === 0) {
            setErrorMessage("Tidak ada file yang diunggah");
            return;
        }
        setShowQueue(true);
        const newQueueItems = files.map((file) => ({ file: { name: file.name }, status: "Waiting..." }));
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
                    if (data.uploadQueueFiles[0].status === "Done" || data.uploadQueueFiles[0].status === "Failed") {
                        setShowPreview(true);
                    }
                }
            }
            if (data.data) {
                setResults(prev => {
                    const newResult = [...prev];
                    data.data.forEach((item, index) => {
                        newResult.push({ ...item, id: prev.length + index });
                        initialPreviewData.current[prev.length + index] = {
                            project: projectName,
                            drawing: item.title,
                            revision: item.revision,
                            drawingCode: item.drawingCode,
                            date: item.date,
                            filename: item.filename
                        };
                    });
                    return newResult
                });
                setPreviewData(prev => ({ ...prev, ...initialPreviewData.current }));
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
    const handleGenerateTransmittal = () => {
         setErrorMessageModal("");
        //  setModalProjectName(projectName);
        setShowTransmittalModal(true);
    };

    const confirmGenerateTransmittal = async (data) => {
       try {
            const transmittalData = Object.values(previewData);
            const response = await fetch("/api/generate-transmittal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transmittalData,
                    projectName: data.projectName,
                    documentName: data.documentName,
                    transmittalNumber: data.transmittalNumber,
                    csvFileName: data.csvFileName
                }),
            });
            if (!response.ok) throw new Error("Failed to generate transmittal");
            const dataRes = await response.json();
            setCsvFileName(dataRes.csvFileName);

            // download file
            const link = document.createElement("a");
            link.href = `/output/${dataRes.csvFileName}`;
            link.download = dataRes.csvFileName;
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
        }
        catch (error) {
            console.error("Error during generate transmittal: ", error);
            setCleanupStatus(`Failed to generate transmittal ${error.message || ""}`);
        }
    };

    const handleHideQueue = () => {
        setShowQueue(false);
    };
    const handleModalClose = () => {
        setShowTransmittalModal(false);
        // setStep(1); // Reset step to 1 when modal closes
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
            <p className="upload-status" id="uploadStatus">{uploadStatus}</p>
            <p className="error-message" id="errorMessage">{errorMessage}</p>
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
             <TransmittalModal
                isOpen={showTransmittalModal}
                onClose={handleModalClose}
                onSubmit={confirmGenerateTransmittal}
                 initialData={{
                        projectName: projectName,
                        documentName: "",
                        transmittalNumber: "",
                        csvFileName: "",
                }}
            />
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