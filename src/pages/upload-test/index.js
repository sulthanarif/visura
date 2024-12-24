// src/pages/index.js
import React, {useState} from 'react';
import DefaultLayout from '../../components/templates/DefaultLayout';
import UploadBox from '../../components/organisms/UploadBox';
import PreviewTransmittal from '../../components/organisms/PreviewTransmittal';
import Icon from '@/components/atoms/Icon';
import Button from '@/components/atoms/Button';
import { useUpload } from '@/models/upload';



function UploadPageTest() {
     const { files, projectName } = useUpload();

    const [showPreview, setShowPreview] = useState(false);
    const [showQueue, setShowQueue] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = files.length;
    const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
       setCurrentPage(currentPage + 1);
    }
  };

    const handleShowPreview = () => {
        setShowPreview(true);
    };
       const handleShowQueue = () => {
        setShowQueue(true);
    };

       const handleHideQueue = () => {
        setShowQueue(false);
    };
    const exportToCsv = () => {

    };
       const saveToLibrary = () => {

    };

  return (
    <DefaultLayout>
      <div className="container">
        <UploadBox showPreview={handleShowPreview} onShowQueue={handleShowQueue} />

         {showPreview && (
          <PreviewTransmittal
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
            onExport={exportToCsv}
            onSaveLibrary={saveToLibrary}
            projectName={projectName}
          />
          )}
          <div className={`upload-queue ${showQueue ? 'show' : ''}`} id="uploadQueue">
              <h3>
                    <Icon name="cloud-arrow-up" />
                    Upload Queue
                </h3>
            <div className="file-list-container" id="uploadQueueFileListContainer">
                    <ul className="file-list" id="uploadQueueFileList">
                        {files.map((file, index) => (
                            <li key={file.name}>
                                 <span>{file.name}</span>
                            <span className="status">Uploading...</span>
                            </li>
                        ))}
                </ul>
                </div>
              <Button onClick={handleHideQueue}>Close Queue</Button>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default UploadPageTest;