import React from 'react';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import { useState } from 'react';

function PreviewTransmittal({
    showPreview,
    projectName,
    results,
    currentPage,
    previewData,
    handlePreviewChange,
    handlePrev,
    handleNext,
    handleGenerateTransmittal,
}) {
      const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        text: null,
        type: null, //success, warning, error
    });
   const  handleGenerateTransmittalClick = async ()=>{
      setLoading(true);
        try {
            await handleGenerateTransmittal();
               setMessage({ text: 'Transmittal generated successfully!', type: 'success' });
        }catch(e){
              setMessage({ text: 'Error generating transmittal, please check log', type: 'error' });
        }finally{
            setLoading(false);
        }
   };
    return (
        <div
            className={`preview-transmittal ${showPreview ? "show" : "remove"}`}
            id="previewTransmittal"
        >
            <h3>Preview Transmittal</h3>
            <div className="field">
                <label htmlFor="previewProjectName">Project Name</label>
                <input type="text" id="previewProjectName" placeholder="Project Name" value={projectName} disabled />
            </div>
            {results && results[currentPage - 1] && (
                <div key={results[currentPage - 1]?.id}>
                    <div className="field">
                        <label htmlFor={`previewTitle-${currentPage - 1}`}>Title</label>
                        <input
                            type="text"
                            id={`previewTitle-${currentPage - 1}`}
                            placeholder="Title"
                            value={previewData[results[currentPage - 1]?.id]?.drawing || ""}
                            onChange={(e) => handlePreviewChange(results[currentPage - 1]?.id, 'drawing', e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor={`previewRevision-${currentPage - 1}`}>Revision</label>
                        <input
                            type="text"
                            id={`previewRevision-${currentPage - 1}`}
                            placeholder="Revision"
                            value={previewData[results[currentPage - 1]?.id]?.revision || ""}
                            onChange={(e) => handlePreviewChange(results[currentPage - 1]?.id, 'revision', e.target.value)}
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
                            value={previewData[results[currentPage - 1]?.id]?.drawingCode || ""}
                            onChange={(e) => handlePreviewChange(results[currentPage - 1]?.id, 'drawingCode', e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor={`previewDate-${currentPage - 1}`}>Date</label>
                        <input
                            type="text"
                            id={`previewDate-${currentPage - 1}`}
                            placeholder="Date"
                            value={previewData[results[currentPage - 1]?.id]?.date || ""}
                            onChange={(e) => handlePreviewChange(results[currentPage - 1]?.id, 'date', e.target.value)}
                            disabled
                        />
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
             <div className="button-container">
                <Button Icon name="database" onClick={handleGenerateTransmittalClick} loading={loading} disabled={loading}>Generate Transmittal</Button>
            </div>
              {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default PreviewTransmittal;