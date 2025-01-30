import React from "react";
import { format } from "date-fns";

const TransmittalDataPreviewModal = ({
  isOpen,
  onClose,
  selectedProject,
  ocrResults,
   currentPage
}) => {
  if (!isOpen) return null;

    const currentOcrResult = ocrResults?.find(ocr => ocr.id === currentPage - 1);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transmittal Data Preview
          </h3>
          <a
            onClick={onClose}
            type="button"
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <svg
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close</span>
          </a>
        </div>
        <div className="mt-6">
          {selectedProject && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Project:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedProject.projectName}
                </p>
              </div>
              {currentOcrResult && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Title:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.title || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Revision:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.revision || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Drawing Code:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.drawingCode || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                      Date:
                    </h4>
                       <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.date ? format(new Date(formatDateForInput(currentOcrResult.date)), "yyyy-MM-dd") : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Images:
              </h4>
              {currentOcrResult?.images?.original && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(currentOcrResult.images.original).map(
                    ([key, imageSrc]) => (
                      <div
                        key={key}
                        className="flex flex-col items-center justify-center"
                      >
                        <img
                          src={imageSrc}
                          alt={`Original ${key}`}
                          className="w-full h-auto rounded-md border border-gray-300 dark:border-gray-700 mb-2"
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {key}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
              {currentOcrResult?.images?.cuts && (
                <div className="space-y-2">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Cut Images:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(currentOcrResult.images.cuts).map(
                      ([key, imageSrc]) => (
                        <div
                          key={key}
                          className="flex flex-col items-center justify-center"
                        >
                          <img
                            src={imageSrc}
                            alt={`Cut ${key}`}
                            className="w-full h-auto rounded-md border border-gray-300 dark:border-gray-700 mb-2"
                          />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {key}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TransmittalDataPreviewModal;