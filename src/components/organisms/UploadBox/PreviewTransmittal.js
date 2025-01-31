import React, { useState, useEffect, useCallback } from "react";
import Icon from "../../atoms/Icon";
import Button from "../../atoms/Button";
import IconWithText from "@/components/molecules/IconWithText";
import TransmittalPreviewModal from "@/components/molecules/TransmittalDataPreviewModal";
import { toast } from 'react-hot-toast';
const PreviewTransmittal = ({
  showPreview,
  projectName,
  results,
  currentPage,
  previewData,
  handlePreviewChange,
  handlePrev,
  handleNext,
  handleGenerateTransmittal,
  projectId,
  setPreviewData,
  initialPreviewData,
}) => {
  const [transmittalModalOpen, setTransmittalModalOpen] = useState(false);
  const [currentOcrResult, setCurrentOcrResult] = useState(null);
  const [debouncedValue, setDebouncedValue] = useState({})


  useEffect(() => {
    if (!showPreview) {
      // Reset form state ketika preview disembunyikan
      setPreviewData(initialPreviewData.current);
        setCurrentOcrResult(null)
    }
   else if (results && results.length > 0) {
        setCurrentOcrResult(results[currentPage -1])
     }
  }, [showPreview, setPreviewData, initialPreviewData, results, currentPage]);


    useEffect(() => {
        if (results && results.length > 0) {
            setCurrentOcrResult(results[currentPage -1])
         }
    }, [results, currentPage]);



  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";

    try {
      // Check if date is already in YYYY-MM-DD format
      if (dateStr.includes("-")) return dateStr;

      // Parse DD/MM/YYYY format
      if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        if (parts.length !== 3) return "";

        const [day, month, year] = parts;
        // Validate parts exist before using padStart
        if (!day || !month || !year) return "";

        return `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
      } else if (dateStr.length === 8) {
        const day = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const year = dateStr.substring(4, 8);

        return `${year}-${month}-${day}`;
      }

      return "";
    } catch (error) {
      console.error("Date parsing error:", error);
      return "";
    }
  };

 const handleInputChange = async (index, field, value) => {
      handlePreviewChange(results[index]?.id, field, value);
      setDebouncedValue(prev => ({
           ...prev,
           [results[index]?.id]:{
               ...prev[results[index]?.id],
               [field]: value
           }
      }));
 };
   const debouncedUpdate = useCallback(
        (index, field) => {
           const ocrId = results[index]?.resultId;
            if (!ocrId) return;
            const updateData = debouncedValue[results[index]?.id]
              if(!updateData) return;
                 const value = updateData[field]
           const updateState = async () => {
             try {
                     const response = await fetch(`/api/ocr-results/${ocrId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                          body: JSON.stringify({
                             title: previewData[results[index]?.id]?.title,
                               revision:  previewData[results[index]?.id]?.revision,
                              drawingCode:  previewData[results[index]?.id]?.drawingCode,
                            date:  previewData[results[index]?.id]?.date
                           }),
                      });
                       if(response.ok){
                            toast.success('Data Updated Successfully', {
                                duration: 5000,
                                position: "top-center",
                            });
                       }else {
                           const errorData = await response.json();
                           toast.error(errorData?.message || "Terjadi kesalahan, coba lagi.", {
                                duration: 5000,
                                position: "top-center",
                            });
                       }
                } catch (error) {
                       console.error("Error updating project:", error);
                        toast.error("Terjadi kesalahan, coba lagi.", {
                            duration: 5000,
                            position: "top-center",
                        });
                    }
           }
           let timer;
            clearTimeout(timer)
           timer = setTimeout(() => {
               updateState()
           }, 500)


    }, [previewData,results,debouncedValue])

    useEffect(() => {
       if(debouncedValue && Object.keys(debouncedValue).length > 0){
           Object.keys(debouncedValue).forEach(id => {
                Object.keys(debouncedValue[id]).forEach(field => {
                      debouncedUpdate(results.findIndex(result => result.id == id), field)
               })
           })
       }
   }, [debouncedValue])

  const handleDateChange = (index, event) => {
    const newDate = event.target.value;
    if (!newDate) return;

    try {
      const dateObj = new Date(newDate);
      if (isNaN(dateObj.getTime())) return; // Invalid date

      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear();

      const displayDate = `${day}/${month}/${year}`;
      const revisionDate = `${day}${month}${year}`;

      // Update revision with new date
      const currentRevision = previewData[results[index]?.id]?.revision || "";
      const revisionPrefix = currentRevision.split("-")[0] || "";
      const newRevision = `${revisionPrefix}-${revisionDate}`;

     handleInputChange(index, "date", displayDate)
     handleInputChange(index, "revision", newRevision)

    } catch (error) {
      console.error("Date change error:", error);
    }
  };
    const handleOpenTransmittalModal = () => {
        setTransmittalModalOpen(true);
   };
     const handleCloseTransmittalModal = () => {
        setTransmittalModalOpen(false);
    };


return (
  <>
    <div
      className={`preview-transmittal ${showPreview ? "show" : "remove"}`}
      id="previewTransmittal"
    >
      <div className="flex justify-between items-center">
        <h2>
          <Icon name="file-csv" />
          Preview Transmittal
        </h2>
        <div className="flex space-x-2">

        <a
          className="text-orange-500 cursor-pointer"
          onClick={handleOpenTransmittalModal}
        >
          <Icon name="eye" />
        </a>
        </div>
      </div>
      <div className="field">
        <label htmlFor="previewProjectName">Project Name</label>
        <input
          type="text"
          id="previewProjectName"
          placeholder="Project Name"
          value={projectName}
          readOnly
        />
      </div>
       {currentOcrResult && (
        <div key={currentOcrResult?.id}>
          {previewData[currentOcrResult?.id] ? (
            <>
              <div className="field">
                <label htmlFor={`previewTitle-${currentOcrResult?.id}`}>
                  Title
                </label>
                <input
                  type="text"
                  id={`previewTitle-${currentOcrResult?.id}`}
                  placeholder="Title"
                  value={previewData[currentOcrResult?.id]?.title || ""}
                    onChange={(e) => handleInputChange(
                      currentPage - 1,
                      "title",
                      e.target.value
                    )}
                />
              </div>

              <div className="field">
                <label htmlFor={`previewRevision-${currentOcrResult?.id}`}>
                  Revision - Date (DD/MM/YYYY)
                </label>
                <input
                  type="text"
                  id={`previewRevision-${currentOcrResult?.id}`}
                  placeholder="Revision"
                  value={
                    previewData[currentOcrResult?.id]?.revision || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      currentPage - 1,
                      "revision",
                      e.target.value
                    )}
                />
              </div>
              <div className="flex items-center gap-2">
              <div className="field flex-1">
                <label htmlFor={`previewDrawingCode-${currentOcrResult?.id}`}>
                  Drawing Code
                </label>
                <input
                  type="text"
                  id={`previewDrawingCode-${currentOcrResult?.id}`}
                  placeholder="Drawing Code"
                  value={
                    previewData[currentOcrResult?.id]?.drawingCode || ""
                  }
                 onChange={(e) =>
                   handleInputChange(
                     currentPage - 1,
                      "drawingCode",
                      e.target.value
                    )}
                />
                </div>
                <div className="field flex-1">
                <label htmlFor={`previewDrawingCode-${currentOcrResult?.id}`}>
                 File Name
                </label>
                <input
                  type="text"
                  id={`previewDrawingCode-${currentOcrResult?.id}`}
                  placeholder="File Name"
                  value={
                    previewData[currentOcrResult?.id]?.filename || ""
                  }
                 onChange={(e) =>
                   handleInputChange(
                     currentPage - 1,
                      "drawingCode",
                      e.target.value
                    )}
                />
                </div>
              </div>
              <div className="field">
                <label
                  htmlFor={`previewDate-${currentOcrResult?.id}`}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  Date
                </label>
                <input
                  type="date"
                  id={`previewDate-${currentOcrResult?.id}`}
                  placeholder="Date"
                  value={formatDateForInput(
                    previewData[currentOcrResult?.id]?.date
                  )}
                   onChange={(e) =>
                    handleDateChange(currentPage - 1, e)
                  }
                />
              </div>
            </>
          ) : (
            <div className="text-red-500">
              Data tidak tersedia untuk halaman ini
            </div>
          )}
          <hr />
        </div>
      )}
      <div className="pagination">
        <Button id="prevBtn" onClick={handlePrev}  disabled={currentPage === 1}>
          <Icon name="angle-left" />
        </Button>
        <span id="pageInfo"></span>
        <Button id="nextBtn" onClick={handleNext}  disabled={currentPage === results.length}>
          <Icon name="angle-right" />
        </Button>
      </div>
      <div className="button-container">
        <Button onClick={handleGenerateTransmittal}>
          <IconWithText icon="file-csv" text="Generate Transmittal" />
        </Button>
      </div>
    </div>
    <TransmittalPreviewModal
      isOpen={transmittalModalOpen}
      onClose={handleCloseTransmittalModal}
      selectedProject={{projectName}}
      ocrResults={results}
      currentPage={currentPage}
    />
    </>
  );
};

export default PreviewTransmittal;