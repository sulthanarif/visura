import React, { useState, useRef, useEffect, useCallback } from "react";
import Button from "../../atoms/Button";
import { useUpload } from "@/models/upload";
import { useRouter } from "next/router";
import FileUploadArea from "./FileUploadArea";
import FileListDisplay from "./FileListDisplay";
import UploadQueue from "./UploadQueue";
import PreviewTransmittal from "./PreviewTransmittal";
import IconWithText from "@/components/molecules/IconWithText";
import Icon from "@/components/atoms/Icon";
import TransmittalModal from "@/components/molecules/TransmittalModal";
import axios from "axios";
import supabase from "@/utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { decodeToken } from "@/utils/authHelpers";
import Input from "@/components/atoms/Input";
import { toast } from 'react-hot-toast';

const env = require('dotenv').config();

const UploadBox = () => {
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
    const [projectId, setProjectId] = useState(null);
     const [userId, setUserId] = useState(null);
      const [debouncedProjectName, setDebouncedProjectName] = useState(projectName);


    const MAX_FILES = 10;

    // Add to existing state declarations
    const [fileCount, setFileCount] = useState(0);
    const [showTransmittalModal, setShowTransmittalModal] = useState(false);

      useEffect(() => {
     // Get the token from local storage and decode it
        const token = localStorage.getItem('token');
          if (token) {
              const decodedToken = decodeToken(token);
            if (decodedToken) {
                 setUserId(decodedToken.userId)
             }
          }
       }, []);


      useEffect(() => {
          // Check if projectId is passed via router query
          if (router.query && router.query.projectId) {
            const { projectId } = router.query;
            setProjectId(projectId);
           }
           if (router.query && router.query.projectName) {
              const { projectName } = router.query;
              setDebouncedProjectName(projectName);
              setProjectName(projectName)
           }

      }, [router.query]);


   useEffect(() => {
        const fetchOcrData = async () => {
             if (projectId) {
                try {
                   const response = await fetch(`/api/getocrdatabyprojectid?projectIds=${JSON.stringify([projectId])}`);
                     if (!response.ok) {
                         throw new Error(`HTTP error! status: ${response.status}`);
                     }
                     const data = await response.json();
                      if(data.length > 0){
                           setResults(data.map((item, index) => ({ ...item, id: index })));
                             setPreviewData(prev => {
                                const newPreview = {}
                                data.forEach((item, index) => {
                                   newPreview[index] = {
                                        project: item.projectName,
                                        title: item.title,
                                        revision: item.revision,
                                        drawingCode: item.drawingCode,
                                        date: item.date,
                                        filename: item.filename,
                                        pdf_url: item.pdf_url
                                    }
                                })
                                 return {...prev, ...newPreview}
                           });
                            if (data.length > 0) {
                                setProjectName(data[0].projectName);
                             }
                         setShowPreview(true)
                      }

                } catch (error) {
                    console.error("Error fetching OCR data:", error);
                    setErrorMessage("Failed to load OCR data. Please try again later.");
                }
            }
        };
       fetchOcrData();
    }, [projectId, setProjectName, setErrorMessage, setResults, setPreviewData, setShowPreview]);


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
                fileListContainerRef.current.classList.add("show");
            }
        } else {
            if (fileListContainerRef.current) {
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
      const newFiles = Array.from(e.target.files);

      // Check if adding new files would exceed limit
      if (files.length + newFiles.length > MAX_FILES) {
          setErrorMessage(`Maximum ${MAX_FILES} files allowed`);
          return;
      }

      handleAddFile(newFiles);
      setFileCount(files.length + newFiles.length);
      setErrorMessage("");
    };

    const handleScanButton = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            setErrorMessage("No files uploaded");
            return;
        }
          setShowQueue(true);
        const filesTemp = [...files];
        setFiles([]);

           // Initialize queue items
        const queueItems = filesTemp.map(file => ({
            file: {
                name: file.name,
                size: file.size  // Add file size to queue item
            },
            status: "Waiting...",
            progress: 0
        }));
          setUploadQueueFiles(queueItems);


           // Check if a project name is provided
        if (!projectName.trim()) {
            setErrorMessage("Project name is required");
            setShowQueue(false);
            setFiles(filesTemp); // Restore files in case of error
            return;
        }

        let currentProjectId = projectId;

         // Create a new project if projectId is not set
        if (!currentProjectId) {
             const { data, error } = await supabase
              .from("projects")
              .insert([{ projectName, userId }]) // include userId here
              .select();

             if (error) {
               console.error("Error creating project:", error);
               setErrorMessage(`Failed to create project ${error.message}`);
              setShowQueue(false);
               setFiles(filesTemp);
               return;
             }

          currentProjectId = data?.[0]?.projectId;
         setProjectId(currentProjectId);
              if(currentProjectId){
                  router.push({
                      pathname: router.pathname,
                      query: { ...router.query, projectId: currentProjectId, projectName: projectName },
                  });
              }
        } else {
            router.push({
                  pathname: router.pathname,
                 query: { ...router.query, projectId: currentProjectId, projectName: projectName },
               });
         }
          if (!currentProjectId) {
           setErrorMessage("Failed to create project, try again.")
               return;

         }
          for (let i = 0; i < filesTemp.length; i++) {
            const file = filesTemp[i];
            try {
                // Update queue status to processing
                setUploadQueueFiles(prev =>
                    prev.map((item, idx) =>
                        idx === i ? { ...item, status: "Processing...", progress: 0 } : item
                    )
                );
                const formData = new FormData();
                formData.append("pdfFile", file);
               

                const response = await fetch(`/api/ocr?projectId=${currentProjectId}`, {
                    method: "POST",
                    body: formData,
                });

                const responseData = await response.json();

                  if (!response.ok) {
                    setUploadQueueFiles(prev =>
                        prev.map((item, idx) =>
                            idx === i ? { ...item, status: "Failed", progress: 100 } : item
                        )
                    );
                    setUploadStatus(`${responseData.message}`);
                     continue;
                    }

                const data = await responseData;

                // Update results and preview data if available
                  if (data.data) {
                    setResults(prev => {
                        const newResult = [...prev];
                        data.data.forEach((item, index) => {
                            newResult.push({ ...item, id: prev.length + index });
                            initialPreviewData.current[prev.length + index] = {
                                project: projectName,
                                title: item.title,
                                revision: item.revision,
                                drawingCode: item.drawingCode,
                                date: item.date,
                                filename: item.filename,
                                pdf_url: item.pdf_url
                            };
                        });
                        return newResult;
                    });

                    setPreviewData(prev => ({ ...prev, ...initialPreviewData.current }));
                }

                // Update queue status to done
                setUploadQueueFiles(prev =>
                    prev.map((item, idx) =>
                        idx === i ? { ...item, status: "Done", progress: 100 } : item
                    )
                );

                   // Check if any file processing failed or succeeded
                    if (data.uploadQueueFiles) {
                        const hasFailed = data.uploadQueueFiles.some(file => file.status === "Failed");
                        const hasDone = data.uploadQueueFiles.some(file => file.status === "Done");

                         if (hasFailed) {
                            setErrorMessage("Some files failed to process");
                            setUploadQueueFiles(prev =>
                                prev.map((item, idx) =>
                                    idx === i ? { ...item, status: "Failed", progress: 100 } : item
                                )
                            );
                        }

                         if (hasDone) {
                            setShowPreview(true);
                        }
                    }

                     // Handle success message
                    if (data.csvFileName) {
                        setCsvFileName(data.csvFileName);

                        if (data.uploadQueueFiles?.some(file => file.status === "Failed")) {
                            toast.error("Processing completed with errors");
                        } else {
                            toast.success("Upload and scanning successful.");
                        }
                    }

            } catch (error) {
                 console.error(`Error processing file ${file.name}:`, error);

                setUploadQueueFiles(prev =>
                    prev.map((item, idx) =>
                        idx === i
                            ? {
                                  ...item,
                                  status: "Failed",
                                  error: error.message,
                                  progress: 0,
                              }
                            : item
                    )
                );
                 setErrorMessage(`Failed to scan file ${file.name}: ${error.message || ""}`);
            }
          }
          setIsUploading(false);
          setIsScanning(false);
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
        setShowTransmittalModal(true);
    };

    const confirmGenerateTransmittal = async (data) => {
       try {
            const transmittalData = Object.values(previewData);
            const response = await fetch(`/api/generate-transmittal`, {
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
            if (!response.ok) {
               const errorData = await response.json();
               throw new Error(`Failed to generate transmittal: ${errorData?.message || ""}`);
           }
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
            //  setCleanupStatus("Cleaning up files, please wait...");
            // const cleanupResponse = await fetch("/api/cleanup", {
            //      method: "POST",
            //      headers: { "Content-Type": "application/json" },
            //      body: JSON.stringify({ projectId }),
            //  });

            // setShowTransmittalModal(false);

            // if (!cleanupResponse.ok) {
            //     const errorData = await cleanupResponse.json();
            //     throw new Error(`Failed to clean up files ${errorData.message || ""}`);
            // }
            // setCleanupStatus("Cleanup completed, refreshing...");
           // router.reload(); // Refresh halaman
        }
        catch (error) {
            console.error("Error during generate transmittal: ", error);
            setCleanupStatus(`Failed to generate transmittal ${error.message || ""}`);
              toast.error(error.message || "Terjadi kesalahan, coba lagi.", {
                duration: 5000,
                position: "top-center",
              });
        }
    };

    const handleHideQueue = () => {
        setShowQueue(false);
    };
    const handleModalClose = () => {
        setShowTransmittalModal(false);
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
    const debouncedUpdateProjectName = useCallback((value) => {
        setDebouncedProjectName(value);
    }, [])

   useEffect(() => {
      if (projectId && debouncedProjectName) {
          const updateProjectName = async () => {
               try {
                  const response = await fetch(`/api/projects/${projectId}`, {
                     method: 'PUT',
                      headers: {
                           'Content-Type': 'application/json',
                       },
                      body: JSON.stringify({
                          projectName: debouncedProjectName,
                        }),
                   });
                   if (response.ok) {
                           toast.success('Project Name Updated Successfully', {
                            duration: 5000,
                             position: "top-center",
                           });
                    } else{
                      const errorData = await response.json();
                        toast.error(errorData?.message || "Terjadi kesalahan, coba lagi.", {
                             duration: 5000,
                             position: "top-center",
                        });
                   }
               } catch (error) {
                     console.error("Error updating Project Name:", error);
                    toast.error("Terjadi kesalahan, coba lagi.", {
                        duration: 5000,
                        position: "top-center",
                    });
               }
           };
           let timer;
          clearTimeout(timer)
           timer = setTimeout(() => {
               updateProjectName()
          }, 500)

     }
    }, [debouncedProjectName, projectId])
    return (
        <div className="upload-box">
              <div className="title-container" id="titleContainer">
                  <h2>
                      <Icon name="folder" />
                     Name of Project
                  </h2>
                 <Input
                    placeholder="Enter project name"
                    type="text"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value)
                       debouncedUpdateProjectName(e.target.value)
                    }}
                 />
              </div>
            <FileUploadArea handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
             <div className="file-count">
                 {files.length}/{MAX_FILES} files
            </div>
            <FileListDisplay
                files={files}
                onRemoveFile={handleRemoveFile}
                fileListContainerRef={fileListContainerRef}
            />

            <div className="note">
                <IconWithText icon="info-circle" text="Maximum 10 files allowed and 10MB per file. Only PDF files are allowed." />
            </div>

            <p className="upload-status" id="uploadStatus">{uploadStatus}</p>
            <p className="error-message" id="errorMessage">{errorMessage}</p>
            <Button onClick={handleScanButton} id="scanButton">
                <IconWithText icon="wand-magic-sparkles" text="Start Scan" />
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
              projectId={projectId}
               setPreviewData={setPreviewData}
                initialPreviewData={initialPreviewData}
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