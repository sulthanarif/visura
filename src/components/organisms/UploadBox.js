// src/components/organisms/UploadBox.js
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../atoms/Icon';
import Input from '../atoms/Input';
import FileList from '../molecules/FileList';
import Button from '../atoms/Button';
import { useUpload } from '@/models/upload';
import { useRouter } from 'next/router';

function UploadBox() {
     const router = useRouter();
    const fileInputRef = useRef(null);
    const { files, handleAddFile, handleRemoveFile, errorMessage, setErrorMessage, projectName, setProjectName, resetState, setFiles} = useUpload();
    const [showPreview, setShowPreview] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [results, setResults] = useState(null);
    const [csvFileName, setCsvFileName] = useState(null);
    const [cleanupStatus, setCleanupStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
     const [uploadQueueFiles, setUploadQueueFiles] = useState([]);
     const [previewData, setPreviewData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
     const fileListContainerRef = useRef(null);
     const uploadQueueRef = useRef(null);
    const uploadQueueFileListContainerRef = useRef(null);

    useEffect(() => {
        resetState();
    }, []);

     useEffect(() => {
        if (files.length > 0) {
            if(fileListContainerRef.current){
                  console.log('useEffect: adding show class');
                 fileListContainerRef.current.classList.add('show')
            }
        } else {
            if(fileListContainerRef.current){
                   console.log('useEffect: removing show class');
                   fileListContainerRef.current.classList.remove('show')
               }
        }
     }, [files])
     useEffect(() => {
          if(showQueue){
               if(uploadQueueRef.current){
                    uploadQueueRef.current.classList.add('show')
                }
              if(uploadQueueFileListContainerRef.current){
                  uploadQueueFileListContainerRef.current.classList.add('show')
              }
         } else {
                if(uploadQueueRef.current){
                      uploadQueueRef.current.classList.remove('show')
                }
                if(uploadQueueFileListContainerRef.current){
                      uploadQueueFileListContainerRef.current.classList.remove('show')
               }
           }
       }, [showQueue])


      const handleUploadAreaClick = () => {
           fileInputRef.current.click();
       };

       const handleFileChange = (e) => {
            console.log('handleFileChange: files changed')
          const newFiles = Array.from(e.target.files);
          handleAddFile(newFiles);
           setErrorMessage('');
       };

       const handleScanButton = async () => {
          if (files.length === 0 && uploadQueueFiles.length === 0) {
              setErrorMessage('Tidak ada file yang diunggah');
                return;
          }
          setShowQueue(true);
            setUploadQueueFiles(prev => [...prev, ...files])
           const filesTemp = [...files]
           setFiles([])
            try {
                  setResults(null);
                    setCsvFileName(null);
                     setCleanupStatus('');
                    setUploadStatus('Uploading to Server...');
                    setIsUploading(true);
                    const formData = new FormData();
                    filesTemp.forEach(file => {
                        formData.append('pdfFile', file);
                   });
                    const response = await fetch('/api/ocr', {
                       method: 'POST',
                         body: formData,
                   });
                     if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Upload failed: ${errorData.message}`);
                    }
                     setUploadStatus('Scanning...');
                     setIsScanning(true);
                    const data = await response.json();
                     setResults(data.data);
                     const initialPreviewData = {};
                   data.data.forEach((item, index) => {
                      initialPreviewData[index] = {
                            project: projectName,
                             drawing: item.title,
                            revision: item.revision,
                            drawingCode: item.drawingCode,
                           date: item.date,
                        };
                    });
                   setPreviewData(initialPreviewData);
                    setCsvFileName(data.csvFileName);
                     setUploadStatus('Upload and scanning successful.');
                    setShowPreview(true);
           } catch (error) {
                console.error('Error during upload or processing:', error);
                 setUploadStatus(
                      `Upload failed: ${error.message || 'An unexpected error occurred'}`
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
            if (currentPage < files.length) {
                 setCurrentPage(currentPage + 1);
            }
       };
        const handlePreviewChange = (index, field, value) => {
            setPreviewData((prev) => {
                const updatedPreview = {...prev};
               updatedPreview[index] = { ...updatedPreview[index], [field]: value };
                return updatedPreview;
          });
        };
        const handleDownloadCSV = async () => {
             const link = document.createElement('a');
              link.href = `/output/${csvFileName}`;
            link.download = csvFileName;
            document.body.appendChild(link);
             link.click();
            document.body.removeChild(link);
             // Panggil backend untuk membersihkan direktori
             try{
                setCleanupStatus('Cleaning up files, please wait...');
                  const response = await fetch('/api/cleanup', { method: 'POST' });
                     if (!response.ok) {
                         throw new Error('Failed to clean up files');
                    }
                      setCleanupStatus('Cleanup completed, refreshing...');
                     router.reload(); // Refresh halaman
             }
             catch(error){
                console.error("Error during cleanup: ", error);
                  setCleanupStatus(`Failed to clean up files ${error.message || ''}`);
            }
        };
        const handleHideQueue = () => {
            setShowQueue(false);
         };
        function updatePageInfo(){
            const pageInfo = document.getElementById('pageInfo');
             if(pageInfo){
                 const totalPages = files.length;
                    pageInfo.textContent = `${currentPage} / ${totalPages}`;
                     const prevBtn = document.getElementById('prevBtn');
                     const nextBtn = document.getElementById('nextBtn');
                     if (currentPage === 1) {
                        if(prevBtn) prevBtn.disabled = true;
                    } else {
                        if(prevBtn) prevBtn.disabled = false;
                     }
                      if ( totalPages === 0) {
                           if(nextBtn) nextBtn.disabled = true;
                     } else {
                        if(nextBtn) nextBtn.disabled = false;
                     }
                }
         }
          useEffect(() => {
              updatePageInfo()
        }, [currentPage, files])
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
                    style={{ display: 'none' }}
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
                    <div className="preview-transmittal" id="previewTransmittal">
                        <h3>Preview Transmittal</h3>
                             <div className="field">
                                 <label htmlFor="previewProjectName">Project Name</label>
                                <input type="text" id="previewProjectName" placeholder="Project Name" value={projectName} disabled />
                           </div>
                             {results && results.map((result, index) => (
                                 <div key={index}>
                                      <div className="field">
                                          <label htmlFor="previewDrawingName">Judul Gambar</label>
                                            <input type="text" id={`previewDrawingName-${index}`} placeholder="Judul Gambar" value={previewData[index]?.drawing || ''} onChange={(e) => handlePreviewChange(index, 'drawing', e.target.value)} />
                                     </div>
                                      <div className="field">
                                           <label htmlFor="previewRevision">Revision</label>
                                             <input type="text" id={`previewRevision-${index}`} placeholder="Revision" value={previewData[index]?.revision || ''} onChange={(e) => handlePreviewChange(index, 'revision', e.target.value)} />
                                       </div>
                                         <div className="field">
                                              <label htmlFor="previewDrawingCode">Drawing Code</label>
                                              <input type="text" id={`previewDrawingCode-${index}`} placeholder="Drawing Code" value={previewData[index]?.drawingCode || ''} onChange={(e) => handlePreviewChange(index, 'drawingCode', e.target.value)} />
                                      </div>
                                    <div className="field">
                                          <label htmlFor="previewDate">Date</label>
                                          <input type="text" id={`previewDate-${index}`} placeholder="Date" value={previewData[index]?.date || ''} onChange={(e) => handlePreviewChange(index, 'date', e.target.value)} disabled/>
                                    </div>
                                     <hr/>
                                 </div>
                            ))}
                           <div className="pagination">
                                  <Button className="first" disabled={currentPage === 1}>
                                      <Icon name='angle-double-left'/>
                                  </Button>
                                 <Button id="prevBtn" onClick={handlePrev} disabled={currentPage === 1}>
                                     <Icon name="angle-left"/>
                                 </Button>
                                 <span id="pageInfo"></span>
                               <Button id="nextBtn" onClick={handleNext} disabled={files.length === 0}>
                                    <Icon name="angle-right"/>
                               </Button>
                                <Button className="last" disabled={files.length === 0}>
                                    <Icon name="angle-double-right"/>
                                </Button>
                         </div>
                        {csvFileName && (
                            <div className="button-container">
                                  <Button onClick={handleDownloadCSV}>Download CSV</Button>
                           </div>
                         )}
                   </div>
                )}
                <div className={`upload-queue ${showQueue ? 'show' : ''}`} id="uploadQueue" ref={uploadQueueRef}>
                    <h3>
                        <Icon name="cloud-arrow-up" />
                        Upload Queue
                   </h3>
                    <div className="file-list-container" id="uploadQueueFileListContainer" ref={uploadQueueFileListContainerRef}>
                        <ul className="file-list" id="uploadQueueFileList">
                            {uploadQueueFiles.map((file, index) => (
                                 <li key={file.name} className="show">
                                      <span>{file.name}</span>
                                      <span className="status">Uploading...</span>
                                </li>
                            ))}
                      </ul>
                 </div>
                 <Button onClick={handleHideQueue}>Close Queue</Button>
                </div>
            </div>
        );
    }
    export default UploadBox;