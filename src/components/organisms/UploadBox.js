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
    const { files, handleAddFile, handleRemoveFile, errorMessage, setErrorMessage, projectName, setProjectName, resetState } = useUpload();
    const [showPreview, setShowPreview] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [results, setResults] = useState(null);
    const [csvFileName, setCsvFileName] = useState(null);
    const [cleanupStatus, setCleanupStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
     const [uploadQueueFiles, setUploadQueueFiles] = useState([]);
    useEffect(() => {
        console.log('UploadBox useEffect: resetting state');
        resetState();
    }, []);

    const handleUploadAreaClick = () => {
        console.log('handleUploadAreaClick: input click');
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        console.log('handleFileChange: files changed');
        const newFiles = Array.from(e.target.files);
        handleAddFile(newFiles);
        console.log('handleFileChange: Files added', files);
        setErrorMessage('');
    };

    const handleScanButton = async () => {
        console.log('handleScanButton: scan button clicked');
        if (files.length === 0) {
            setErrorMessage('Tidak ada file yang diunggah');
            console.log('handleScanButton: no files selected');
            return;
        }
         setShowQueue(true);
         console.log('handleScanButton: setShowQueue true');
          setUploadQueueFiles(files);
          console.log('handleScanButton: setUploadQueueFiles', files);
        try {
             console.log('handleScanButton: try block start');
                setResults(null);
                setCsvFileName(null);
                setCleanupStatus('');
                setUploadStatus('Uploading to Server...');
                 setIsUploading(true);
                const formData = new FormData();
                files.forEach(file => {
                    formData.append('pdfFile', file);
                });
                console.log('handleScanButton: formData prepared');
                const response = await fetch('/api/ocr', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) {
                    console.error('handleScanButton: fetch error');
                    const errorData = await response.json();
                    throw new Error(`Upload failed: ${errorData.message}`);
                }
               console.log('handleScanButton: fetch success');
                setUploadStatus('Scanning...');
                setIsScanning(true);
                const data = await response.json();
                setResults(data.data);
                setCsvFileName(data.csvFileName);
                  console.log('handleScanButton: fetch data received');
                setUploadStatus('Upload and scanning successful.');
                console.log('handleScanButton: Upload and scanning successfull');
                setShowPreview(true);
               console.log('handleScanButton: setShowPreview true');
        }
       catch(error){
               console.error('handleScanButton: Error during upload or processing:', error);
                 setUploadStatus(
                  `Upload failed: ${error.message || 'An unexpected error occurred'}`
                );
       }
        finally{
               console.log('handleScanButton: finally block');
            setIsUploading(false);
        }
    };
     const handleDownloadCSV = async () => {
        console.log('handleDownloadCSV : called');
          const link = document.createElement('a');
         link.href = `/output/${csvFileName}`;
         link.download = csvFileName;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         // Panggil backend untuk membersihkan direktori
          try{
            setCleanupStatus('Cleaning up files, please wait...');
             console.log('handleDownloadCSV : cleaning up files start');
            const response = await fetch('/api/cleanup', { method: 'POST' });
            if (!response.ok) {
                    console.error('handleDownloadCSV : cleanup fetch error');
                    throw new Error('Failed to clean up files');
              }
                console.log('handleDownloadCSV : cleanup success');
                setCleanupStatus('Cleanup completed, refreshing...');
                router.reload(); // Refresh halaman
        }
         catch(error){
             console.error("handleDownloadCSV : Error during cleanup: ", error);
             setCleanupStatus(`Failed to clean up files ${error.message || ''}`);
         }
    };
    const handleHideQueue = () => {
        console.log('handleHideQueue: hiding queue');
       setShowQueue(false);
    };
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
            <div className="file-list-container" id="fileListContainer">
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
                                        <input type="text" id="previewDrawingName" placeholder="Judul Gambar" value={result.title} disabled />
                                </div>
                                <div className="field">
                                        <label htmlFor="previewRevision">Revision</label>
                                        <input type="text" id="previewRevision" placeholder="Revision" value={result.revision} disabled />
                                  </div>
                                  <div className="field">
                                        <label htmlFor="previewDrawingCode">Drawing Code</label>
                                          <input type="text" id="previewDrawingCode" placeholder="Drawing Code" value={result.drawingCode} disabled />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="previewDate">Date</label>
                                        <input type="text" id="previewDate" placeholder="Date" value={result.date} disabled/>
                                    </div>
                                <hr />
                            </div>
                        ))}
                    {csvFileName && (
                         <div className="button-container">
                             <Button onClick={handleDownloadCSV}>Download CSV</Button>
                        </div>
                    )}
                </div>
            )}
             <div className={`upload-queue ${showQueue ? 'show' : ''}`} id="uploadQueue">
                  <h3>
                       <Icon name="cloud-arrow-up" />
                       Upload Queue
                  </h3>
                   <div className="file-list-container" id="uploadQueueFileListContainer">
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