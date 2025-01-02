import React from 'react';
import Icon from '../../atoms/Icon';
import Button from '../../atoms/Button';
import IconWithText from '@/components/molecules/IconWithText';

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

    const handleDateChange = (index, event) => {
         const newDate = event.target.value;
        const dateObj = new Date(newDate);

        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = dateObj.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;
        const formattedRevisionDate = `${day}${month}${year}`;

       const newRevision = previewData[index]?.revision.split('-')[0] + "-" + formattedRevisionDate.slice(0,8)

        // Update both date and revision fields
        handlePreviewChange(index, 'date', newDate);
         handlePreviewChange(index, 'revision', newRevision)
    };
    return (
        <div
            className={`preview-transmittal ${showPreview ? "show" : "remove"}`}
            id="previewTransmittal"
        >
            <h2>
                <Icon name="file-csv" />
                Preview Transmittal
            </h2>
            <br />
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
                            disabled
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
                        <label htmlFor={`previewDate-${currentPage - 1}`} style={{display:"flex", alignItems:"center", gap:"5px"}}>
                            Date
                        </label>
                          <input 
                            type="date"
                            id={`previewDate-${currentPage - 1}`}
                            placeholder="Date"
                            value={previewData[results[currentPage - 1]?.id]?.date || ""}
                            onChange={(e) => handleDateChange(results[currentPage - 1]?.id, e)}
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
                <Button onClick={handleGenerateTransmittal}>
                   <IconWithText icon="file-csv" text="Generate Transmittal" />
                </Button>
            </div>
        </div>
    );
}

export default PreviewTransmittal;