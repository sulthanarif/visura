// src/components/organisms/UploadBox.js
import React, { useState, useRef, useEffect } from "react";
import Icon from "../atoms/Icon";
import Input from "../atoms/Input";
import FileList from "../molecules/FileList";
import Button from "../atoms/Button";
import { useUpload } from "@/models/upload";
import { useRouter } from "next/router";

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

     const handleUploadAreaClick = () => {
       fileInputRef.current.click();
    };

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

     return (
        <div className="upload-box">
            <div className="title-container" id="titleContainer">
                <h2>
                   <Icon name="folder" />
                    Nama Project
                </h2>
                <Input
                    placeholder="Tulis nama projek"
                    type="text"
                   value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                />
             </div>
           <h2>
               <Icon name="file-upload" />
                 Upload File PDF Anda disini
            </h2>
            <div className="upload-area" onClick={handleUploadAreaClick}>
                <Icon name="cloud-upload-alt" />
                <p>Tambahkan Dokumen Disini</p>
            </div>
            <input
                type="file"
                id="fileInput"
                accept="application/pdf"
               multiple
               style={{ display: "none" }}
                 onChange={handleFileChange}
                ref={fileInputRef}
            />
           <div className="file-list-container" id="fileListContainer" ref={fileListContainerRef}>
                <FileList files={files} onRemoveFile={handleRemoveFile} />
            </div>
            <p className="note">
                *Mendukung file PDF (Maximal 20Mb per file, maksimal 20 file)
           </p>
            <p className="error-message" id="errorMessage">{errorMessage}</p>
            <Button onClick={handleScanButton} id="scanButton">
                Scan File
            </Button>
            {showPreview && (
                <div
                    className={`preview-transmittal ${showPreview ? "show" : ""}`}
                    id="previewTransmittal"
                >
                    <h3>Preview Transmittal</h3>
                     <div className="field">
                        <label htmlFor="previewProjectName">Project Name</label>
                          <input type="text" id="previewProjectName" placeholder="Project Name" value={projectName} disabled />
                      </div>
                        {results && results[currentPage - 1] && (
                            <div key={results[currentPage-1]?.id}>
                              <div className="field">
                                    <label htmlFor={`previewTitle-${currentPage - 1}`}>Title</label>
                                   <input
                                       type="text"
                                        id={`previewTitle-${currentPage - 1}`}
                                        placeholder="Title"
                                       value={previewData[results[currentPage-1]?.id]?.drawing || ""}
                                       onChange={(e) => handlePreviewChange(results[currentPage-1]?.id, 'drawing', e.target.value)}
                                    />
                                  </div>
                                 <div className="field">
                                     <label htmlFor={`previewRevision-${currentPage - 1}`}>Revision</label>
                                    <input
                                         type="text"
                                        id={`previewRevision-${currentPage - 1}`}
                                        placeholder="Revision"
                                        value={previewData[results[currentPage-1]?.id]?.revision || ""}
                                       onChange={(e) => handlePreviewChange(results[currentPage-1]?.id, 'revision', e.target.value)}
                                     />
                                </div>
                                  <div className="field">
                                        <label htmlFor={`previewDrawingCode-${currentPage - 1}`}>
                                            Drawing Code
                                        </label>
                                     <input
                                            type="text"
                                          id={`previewDrawingCode-${currentPage - 1}`}
                                        placeholder="Drawing Code"
                                        value={previewData[results[currentPage-1]?.id]?.drawingCode || ""}
                                          onChange={(e) => handlePreviewChange(results[currentPage-1]?.id, 'drawingCode', e.target.value)}
                                       />
                                   </div>
                                 <div className="field">
                                        <label htmlFor={`previewDate-${currentPage - 1}`}>Date</label>
                                          <input
                                             type="text"
                                            id={`previewDate-${currentPage - 1}`}
                                            placeholder="Date"
                                              value={previewData[results[currentPage-1]?.id]?.date || ""}
                                            onChange={(e) => handlePreviewChange(results[currentPage-1]?.id, 'date', e.target.value)} disabled/>
                                    </div>
                                <hr />
                            </div>
                      )}

                   <div className="pagination">
                         <Button
                             id="prevBtn"
                             onClick={handlePrev}
                             disabled={currentPage === 1}
                       >
                             <Icon name="angle-left" />
                        </Button>
                       <span id="pageInfo"></span>
                           <Button
                             id="nextBtn"
                              onClick={handleNext}
                              disabled={results.length === 0}
                         >
                               <Icon name="angle-right" />
                       </Button>
                      
                     </div>
                    {csvFileName && (
                       <div className="button-container">
                           <Button Icon name="database" onClick={handleDownloadCSV}>Download CSV</Button>
                        </div>
                    )}
                </div>
            )}
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
                       {uploadQueueFiles.map(({ file, status }) => (
                            <li key={file.name} className="show">
                                   <span>{file.name}</span>
                                  <span className="status">{status}</span>
                             </li>
                        ))}
                  </ul>
             </div>
         </div>
     </div>
 );

}

export default UploadBox;
