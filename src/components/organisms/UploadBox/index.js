import React, { useState, useRef, useEffect, useCallback } from "react";
import Button from "../../atoms/Button";
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
    
    // Upload state management (previously from useUpload hook)
    const [files, setFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [projectName, setProjectName] = useState("");

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
    const [isDragOverBox, setIsDragOverBox] = useState(false);
    const dragCounterBox = useRef(0);

    // Upload management functions (previously from useUpload hook)
    const handleAddFile = (newFiles) => {
        if (files.length + newFiles.length > 10) {
            setErrorMessage("Maximum 10 files allowed.");
            return;
        }
        
        const validFiles = [];
        
        for (const file of newFiles) {
            if (file.size > 10 * 1024 * 1024) {
                setErrorMessage(`File ${file.name} exceeds 10MB!`);
            } else {
                // Check if file is a PDF
                const fileExtension = file.name.toLowerCase().split('.').pop();
                if (fileExtension !== 'pdf') {
                    setErrorMessage(`File ${file.name} is not a PDF. Only PDF files are allowed.`);
                } else {
                    validFiles.push(file);
                }
            }
        }
        
        if (validFiles.length > 0) {
            setFiles(prevFiles => [...prevFiles, ...validFiles]);
        }
    };

    const handleRemoveFile = (fileToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
    };

    const resetState = () => {
        setErrorMessage("");
        setProjectName("");
        setFiles([]);
    };

    const MAX_FILES = 10;

    // Add to existing state declarations
    const [fileCount, setFileCount] = useState(0);
    const [showTransmittalModal, setShowTransmittalModal] = useState(false);

    // Add function to fetch OCR data
    const fetchOcrData = async (projectIdToFetch) => {
        if (projectIdToFetch) {
            try {
                const response = await fetch(`/api/getocrdatabyprojectid?projectIds=${JSON.stringify([projectIdToFetch])}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.length > 0) {
                    setResults(data.map((item, index) => ({ ...item, id: index })));
                    const newPreviewData = {};
                    data.forEach((item, index) => {
                        newPreviewData[index] = {
                            project: item.projectName,
                            title: item.title,
                            revision: item.revision,
                            drawingCode: item.drawingCode,
                            date: item.date,
                            filename: item.filename,
                            pdf_url: item.pdf_url
                        };
                    });
                    setPreviewData(newPreviewData);
                    initialPreviewData.current = { ...newPreviewData };
                    if (data.length > 0) {
                        setProjectName(data[0].projectName);
                    }
                    setShowPreview(true);
                }
            } catch (error) {
                console.error("Error fetching OCR data:", error);
                setErrorMessage("Failed to load OCR data. Please try again later.");
            }
        }
    };

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
    }, [router.query]);


   useEffect(() => {
        const fetchOcrDataEffect = async () => {
             if (projectId) {
                await fetchOcrData(projectId);
            }
        };
       fetchOcrDataEffect();
    }, [projectId, setProjectName, setErrorMessage]);


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

 const handleBoxDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterBox.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragOverBox(true);
        }
    };

    const handleBoxDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounterBox.current--;
        if (dragCounterBox.current === 0) {
            setIsDragOverBox(false);
        }
    };

    const handleBoxDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };    const handleBoxDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOverBox(false);
        dragCounterBox.current = 0;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            // Create a synthetic event object that matches what handleFileChange expects
            const syntheticEvent = {
                target: {
                    files: e.dataTransfer.files
                }
            };
            handleFileChange(syntheticEvent);
            e.dataTransfer.clearData();
        }
    };const handleFileChange = (e) => {
      // Only call preventDefault for regular form events (not for synthetic drag events)
      if (e && e.preventDefault && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      
      const newFiles = Array.from(e.target.files);

      // Check maximum file count
      if (files.length + newFiles.length > MAX_FILES) {
          toast.error(`Maximum ${MAX_FILES} files allowed`, {
            duration: 5000,
            position: "top-center",
          });
          setErrorMessage(`Maximum ${MAX_FILES} files allowed`);
          return;
      }

      // Validate file types and sizes
      const invalidFiles = [];
      const oversizedFiles = [];
      const validFiles = [];

      newFiles.forEach(file => {
        const fileExtension = file.name.toLowerCase().split('.').pop();
        if (fileExtension !== 'pdf') {
          invalidFiles.push(file.name);
        } else if (file.size > 10 * 1024 * 1024) // 10MB
          oversizedFiles.push(file.name);
        else
          validFiles.push(file);
      });

      if (invalidFiles.length > 0) {
        toast.error(`Invalid file type(s): ${invalidFiles.join(', ')}. Only PDF files are allowed.`, {
          duration: 5000,
          position: "top-center",
        });
        setErrorMessage("Only PDF files are allowed");
      }

      if (oversizedFiles.length > 0) {
        toast.error(`File(s) too large: ${oversizedFiles.join(', ')}. Maximum file size is 10MB.`, {
          duration: 5000,
          position: "top-center",
        });
        setErrorMessage("Maximum file size is 10MB");
      }

      if (validFiles.length > 0) {
        handleAddFile(validFiles);
        setFileCount(files.length + validFiles.length);
        setErrorMessage("");
      }
    };

    const handleScanButton = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            toast.error("No files uploaded", {
              duration: 5000,
              position: "top-center",
            });
            setErrorMessage("No files uploaded");
            return;
        }
        
        if (!projectName.trim()) {
            toast.error("Project name is required", {
              duration: 5000,
              position: "top-center",
            });
            setErrorMessage("Project name is required");
            return;
        }
        
        setShowQueue(true);
        const filesTemp = [...files];
        setFiles([]);

        // Initialize queue items
        const queueItems = filesTemp.map(file => ({
            file: {
                name: file.name,
                size: file.size
            },
            status: "Waiting...",
            progress: 0
        }));
        setUploadQueueFiles(queueItems);

        let currentProjectId = projectId;

        // Create a new project if projectId is not set
        if (!currentProjectId) {
            try {
                const { data, error } = await supabase
                .from("projects")
                .insert([{ projectName, userId }]) 
                .select();

                if (error) {
                    toast.error(`Failed to create project: ${error.message}`, {
                        duration: 5000,
                        position: "top-center",
                    });
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
                        query: { ...router.query, projectId: currentProjectId },
                    });
                }
            } catch (error) {
                toast.error(`Failed to create project: ${error.message}`, {
                    duration: 5000,
                    position: "top-center",
                });
                console.error("Error creating project:", error);
                setErrorMessage(`Failed to create project: ${error.message}`);
                setShowQueue(false);
                setFiles(filesTemp);
                return;
            }        } else {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, projectId: currentProjectId },
            });
        }
          
        if (!currentProjectId) {
            toast.error("Failed to create project, try again.", {
                duration: 5000,
                position: "top-center",
            });
            setErrorMessage("Failed to create project, try again.")
            setShowQueue(false);
            setFiles(filesTemp);
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

                // Process errors from the request
                if (!response.ok) {
                    let errorMsg = "Processing failed";
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch (e) {
                        errorMsg = `Error: ${response.status} ${response.statusText}`;
                    }
                    
                    setUploadQueueFiles(prev =>
                        prev.map((item, idx) =>
                            idx === i ? { 
                                ...item, 
                                status: "Failed", 
                                progress: 0,
                                error: errorMsg 
                            } : item
                        )
                    );
                    
                    toast.error(`Failed to process ${file.name}: ${errorMsg}`, {
                        duration: 5000,
                        position: "top-center",
                    });
                    
                    continue;
                }

                const responseData = await response.json();
                
                // Update the queue item with the latest status from the server
                if (responseData.uploadQueueFiles && responseData.uploadQueueFiles.length > 0) {
                    const matchingQueueItem = responseData.uploadQueueFiles.find(
                        qItem => qItem.file.name === file.name
                    );
                    
                    if (matchingQueueItem) {
                        setUploadQueueFiles(prev =>
                            prev.map((item, idx) =>
                                idx === i ? { 
                                    ...item, 
                                    status: matchingQueueItem.status, 
                                    error: matchingQueueItem.error || item.error,
                                    progress: matchingQueueItem.status === "Done" ? 100 : 0
                                } : item
                            )
                        );
                        
                        // Show toast for failures
                        if (matchingQueueItem.status === "Failed") {
                            toast.error(`Failed to process ${file.name}: ${matchingQueueItem.error || "Unknown error"}`, {
                                duration: 5000,
                                position: "top-center",
                            });
                        }
                    }
                }

                // Update results and preview data if available
                  if (responseData.data) {
                    const newResults = [...results];
                    const newPreviewData = { ...previewData };
                    
                    responseData.data.forEach((item, index) => {
                        const resultId = newResults.length + index;
                        newResults.push({ ...item, id: resultId });
                        
                        newPreviewData[resultId] = {
                            project: projectName,
                            title: item.title,
                            revision: item.revision,
                            drawingCode: item.drawingCode,
                            date: item.date,
                            filename: item.filename,
                            pdf_url: item.pdf_url
                        };
                        
                        initialPreviewData.current[resultId] = { ...newPreviewData[resultId] };
                    });
                    
                    setResults(newResults);
                    setPreviewData(newPreviewData);
                }

                // Check if any file processing failed or succeeded
                    if (responseData.uploadQueueFiles) {
                        const hasFailed = responseData.uploadQueueFiles.some(file => file.status === "Failed");
                        const hasDone = responseData.uploadQueueFiles.some(file => file.status === "Done");

                         if (hasFailed) {
                            setErrorMessage("Some files failed to process");
                        }

                         if (hasDone) {
                            setShowPreview(true);
                        }
                    }

                // Handle success message
                if (responseData.csvFileName) {
                    setCsvFileName(responseData.csvFileName);

                    if (responseData.uploadQueueFiles?.some(file => file.status === "Failed")) {
                        toast.error("Processing completed with errors", {
                            duration: 5000,
                            position: "top-center",
                        });
                    } else {
                        toast.success("Upload and scanning successful.", {
                            duration: 5000,
                            position: "top-center",
                        });
                    }
                }

            } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);

                // Update the queue with the error
                setUploadQueueFiles(prev =>
                    prev.map((item, idx) =>
                        idx === i
                            ? {
                                  ...item,
                                  status: "Failed",
                                  error: error.message || "An unknown error occurred",
                                  progress: 0,
                              }
                            : item
                    )
                );
                
                // Display toast with error
                toast.error(`Failed to process ${file.name}: ${error.message || "Unknown error"}`, {
                    duration: 5000,
                    position: "top-center",
                });
                
                setErrorMessage(`Failed to scan file ${file.name}: ${error.message || ""}`);
            }
          }
          // Refetch data after all files are processed to ensure UI is in sync
          if (currentProjectId) {
              await fetchOcrData(currentProjectId);
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
    };    const confirmGenerateTransmittal = async (data) => {
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
                    csvFileName: data.csvFileName,
                    isTemplate: data.isTemplate
                }),
            });

            if (!response.ok) {
               const errorData = await response.text();
               throw new Error(`Failed to generate transmittal: ${errorData || "Unknown error"}`);
            }

            // Get the filename from response headers
            const contentDisposition = response.headers.get('Content-Disposition');
            const fileName = contentDisposition ? 
                contentDisposition.split('filename=')[1].replace(/"/g, '') : 
                `transmittal-${Date.now()}.csv`;

            // Get CSV content as blob
            const csvBlob = await response.blob();
            
            // Create download link
            const url = window.URL.createObjectURL(csvBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the blob URL
            window.URL.revokeObjectURL(url);
            
            setCsvFileName(fileName);

            // Show success message
            toast.success("Transmittal generated and downloaded successfully!", {
                duration: 3000,
                position: "top-center",
            });
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
          <div 
            className={`upload-box ${isDragOverBox ? 'drag-over-box' : ''}`}
            onDragEnter={handleBoxDragEnter}
            onDragLeave={handleBoxDragLeave}
            onDragOver={handleBoxDragOver}
            onDrop={handleBoxDrop}
        >
            {isDragOverBox && (
                <div className="drag-overlay">
                    <div className="drag-overlay-content">
                        <Icon name="cloud-upload-alt" />
                        <p>Drop PDF files anywhere to upload</p>
                    </div>
                </div>
            )}
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
              setResults={setResults} // Pass setResults to PreviewTransmittal
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