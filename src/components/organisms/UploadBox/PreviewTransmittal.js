import React from "react";
import Icon from "../../atoms/Icon";
import Button from "../../atoms/Button";
import IconWithText from "@/components/molecules/IconWithText";

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
    projectId
}) => {
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
      const currentRevision = previewData[index]?.revision || "";
      const revisionPrefix = currentRevision.split("-")[0] || "";
      const newRevision = `${revisionPrefix}-${revisionDate}`;

      handlePreviewChange(index, "date", displayDate);
      handlePreviewChange(index, "revision", newRevision);
    } catch (error) {
      console.error("Date change error:", error);
    }
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
      {results && results[currentPage - 1] && (
        <div key={results[currentPage - 1]?.id}>
          <div className="field">
            <label htmlFor={`previewTitle-${currentPage - 1}`}>Title</label>
            <input
              type="text"
              id={`previewTitle-${currentPage - 1}`}
              placeholder="Title"
              value={previewData[results[currentPage - 1]?.id]?.title || ""}
              onChange={(e) =>
                handlePreviewChange(
                  results[currentPage - 1]?.id,
                  "title",
                  e.target.value
                )
              }
            />
          </div>
          <div className="field">
            <label htmlFor={`previewRevision-${currentPage - 1}`}>
              Revision - Date (DD/MM/YYYY)
            </label>
            <input
              type="text"
              id={`previewRevision-${currentPage - 1}`}
              placeholder="Revision"
              value={previewData[results[currentPage - 1]?.id]?.revision || ""}
              onChange={(e) =>
                handlePreviewChange(
                  results[currentPage - 1]?.id,
                  "revision",
                  e.target.value
                )
              }
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
              value={
                previewData[results[currentPage - 1]?.id]?.drawingCode || ""
              }
              onChange={(e) =>
                handlePreviewChange(
                  results[currentPage - 1]?.id,
                  "drawingCode",
                  e.target.value
                )
              }
            />
          </div>
          <div className="field">
            <label
              htmlFor={`previewDate-${currentPage - 1}`}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              Date
            </label>
            <input
              type="date"
              id={`previewDate-${currentPage - 1}`}
              placeholder="Date"
              value={formatDateForInput(
                previewData[results[currentPage - 1]?.id]?.date
              )}
              onChange={(e) =>
                handleDateChange(results[currentPage - 1]?.id, e)
              }
            />
          </div>
          <hr />
        </div>
      )}
      <div className="pagination">
        <Button id="prevBtn" onClick={handlePrev}>
          <Icon name="angle-left" />
        </Button>
        <span id="pageInfo"></span>
        <Button id="nextBtn" onClick={handleNext}>
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
};

export default PreviewTransmittal;