import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import Icon from "@/components/atoms/Icon";
import Button from "@/components/atoms/Button";
import IconWithText from "./IconWithText";
import ModalTemplate from "@/components/templates/ModalTemplate";
import ModalConfirmation from "./ModalConfirmation";
import { toast } from 'react-hot-toast';

const TransmittalDataPreviewModal = ({
  isOpen,
  onClose,
  selectedProject,
  ocrResults,
  currentPage,
  onDeleteResult, // Added callback for deletion
}) => {
  if (!isOpen) return null;

  const [activeFileIndex, setActiveFileIndex] = useState(currentPage - 1);
  const [currentSection, setCurrentSection] = useState("original");
  const [dangerZoneExpanded, setDangerZoneExpanded] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Update active file index when currentPage changes
    setActiveFileIndex(currentPage - 1);
  }, [currentPage]);

  useEffect(() => {
    // Reset section view when switching files
    setCurrentSection("original");
  }, [activeFileIndex]);

  const currentOcrResult = ocrResults?.[activeFileIndex];

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";

    try {
      if (dateStr.includes("-")) return dateStr;

      if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        if (parts.length !== 3) return "";

        const [day, month, year] = parts;
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

  const handleNextSection = () => {
    if (currentSection === "original") {
      if (currentOcrResult?.image_paths?.cropped) {
        setCurrentSection("cropped");
      } else if (currentOcrResult?.pdf_url) {
        setCurrentSection("qr");
      } else if (
        currentOcrResult?.image_paths?.parts &&
        currentOcrResult.image_paths.parts.length > 0
      ) {
        setCurrentSection("parts");
      }
    } else if (currentSection === "cropped") {
      if (currentOcrResult?.pdf_url) {
        setCurrentSection("qr");
      } else if (
        currentOcrResult?.image_paths?.parts &&
        currentOcrResult.image_paths.parts.length > 0
      ) {
        setCurrentSection("parts");
      }
    } else if (currentSection === "qr") {
      if (
        currentOcrResult?.image_paths?.parts &&
        currentOcrResult.image_paths.length > 0
      ) {
        setCurrentSection("parts");
      }
        else if (
            currentOcrResult?.image_paths?.parts &&
            currentOcrResult.image_paths.parts.length > 0
        ) {
         setCurrentSection("parts");
      }
    }
  };

  const handlePrevSection = () => {
    if (currentSection === "parts") {
        if (currentOcrResult?.pdf_url) {
          setCurrentSection("qr");
        } else if (currentOcrResult?.image_paths?.cropped) {
          setCurrentSection("cropped");
        } else if (currentOcrResult?.image_paths?.original) {
          setCurrentSection("original");
        }
      } else if (currentSection === "qr") {
        if (currentOcrResult?.image_paths?.cropped) {
          setCurrentSection("cropped");
        } else if (currentOcrResult?.image_paths?.original) {
          setCurrentSection("original");
        }
    } else if (currentSection === "cropped") {
      if (currentOcrResult?.image_paths?.original) {
        setCurrentSection("original");
      }
    }
  };

  const navigateToNextFile = () => {
    if (activeFileIndex < ocrResults.length - 1) {
      setActiveFileIndex(activeFileIndex + 1);
    }
  };

  const navigateToPrevFile = () => {
    if (activeFileIndex > 0) {
      setActiveFileIndex(activeFileIndex - 1);
    }
  };

  const handleDeleteOcrResult = async () => {
    if (!currentOcrResult || !currentOcrResult.resultId) {
      toast.error("Cannot delete: Missing result ID");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/ocr-results/${currentOcrResult.resultId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to delete OCR result");
      }

      toast.success("OCR result deleted successfully", {
        duration: 5000,
        position: "top-center",
      });

      // Call the callback to update the parent component
      if (onDeleteResult) {
        onDeleteResult(currentOcrResult.id);
      }

      // Close modal if no files left or navigate to another file
      if (ocrResults.length <= 1) {
        onClose(); // Close modal if no files left
      } else {
        // Navigate to another file if available
        if (activeFileIndex === ocrResults.length - 1) {
          setActiveFileIndex(Math.max(0, activeFileIndex - 1));
        }
      }
      
    } catch (error) {
      console.error("Error deleting OCR result:", error);
      toast.error(error.message || "An error occurred while deleting", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const partLabels = ["Title", "Revision", "Drawing Code", "Date"];

  const customFooter = (
    <div className="flex justify-end items-center w-full">
      <div className="flex items-center space-x-2">
        <a 
          onClick={navigateToPrevFile} 
          disabled={activeFileIndex === 0}
          className={`px-3 py-2 rounded-lg ${activeFileIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-[#E17218]'} transition-colors duration-300`}
        >
          <Icon name="chevron-left" className="w-5 h-5" />
        </a>
        <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <span className="font-medium">{activeFileIndex + 1}</span>
          <span className="text-gray-500"> / {ocrResults?.length || 0}</span>
        </div>
        <a 
          onClick={navigateToNextFile} 
          disabled={activeFileIndex >= (ocrResults?.length - 1)}
          className={`px-3 py-2 rounded-lg ${activeFileIndex >= (ocrResults?.length - 1) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-[#E17218]'} transition-colors duration-300`}
        >
          <Icon name="chevron-right" className="w-5 h-5" />
        </a>
      </div>
    </div>
  );

  return (
    <>
      <ModalTemplate 
        isOpen={isOpen}
        onClose={onClose}
        title="Transmittal Data Preview"
        icon="file-csv"
        size="full"
        footer={customFooter}
        footerAlign="between"
      >
        <div className="flex">
          {selectedProject && (
            <div className="space-y-4 w-1/2 pr-4 border-r dark:border-gray-700">
              <div className="flex justify-between">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                  Project:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedProject.projectName}
                </p>
              </div>
              {currentOcrResult && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                      Title:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.title || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                      File Name:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.filename || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                      Revision:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.revision || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                      Drawing Code:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.drawingCode || "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                      Date:
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentOcrResult.date
                        ? format(
                            new Date(
                              formatDateForInput(currentOcrResult.date)
                            ),
                            "yyyy-MM-dd"
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-white">
                      PDF URL:
                    </h4>
                    <div className="flex items-center space-x-2">
                      <a
                        href={currentOcrResult.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View PDF
                      </a>
                      {currentOcrResult.isEncrypted && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                          <IconWithText icon="lock" text="Encrypted" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Add Danger Zone section */}
              {currentOcrResult && (
                <div className="mt-8 border border-red-200 rounded-lg overflow-hidden">
                  <a 
                    onClick={() => setDangerZoneExpanded(!dangerZoneExpanded)}
                    className="w-full px-4 py-3 flex justify-between items-center bg-red-50 text-red-700 hover:bg-red-100 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <Icon name="alert-triangle" className="text-red-500 mr-2" />
                      <span className="font-semibold">Danger Zone</span>
                    </div>
                    <Icon 
                      name={dangerZoneExpanded ? "chevron-up" : "chevron-down"} 
                      className="text-red-500" 
                    />
                  </a>
                  
                  {dangerZoneExpanded && (
                    <div className="p-4 bg-white border-t border-red-200">
                      <div className="text-sm text-gray-600 mb-4">
                        Actions performed in this section cannot be undone. Please proceed with caution.
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-red-200 rounded-md bg-red-50">
                        <div>
                          <h5 className="font-medium text-red-700">Delete OCR Result</h5>
                          <p className="text-xs text-gray-600">
                            This will permanently delete this OCR result, including all associated images and data.
                          </p>
                        </div>
                        <a 
                          onClick={() => setShowDeleteConfirmation(true)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-1">
                            {isDeleting ? (
                              <Icon name="spinner" className="animate-spin" />
                            ) : (
                              <Icon name="trash" />
                            )}
                            <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                          </div>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="w-1/2 pl-4 space-y-2">
            <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-2">
              Images:
            </h4>
            <div className="relative border border-gray-100 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2 items-center">
                  {currentSection !== "original" && (
                    <a 
                      onClick={handlePrevSection} 
                      className="p-1 text-gray-700 hover:text-[#E17218] transition-colors duration-200"
                    >
                      <Icon name="chevron-left" />
                    </a>
                  )}
                  <h4 className="text-md font-semibold bg-gradient-to-r from-[#E17218] to-[#EBA801] bg-clip-text text-transparent">
                    {currentSection === "original" && "Original Image"}
                    {currentSection === "cropped" && "Cut Image"}
                    {currentSection === "qr" && "QR Code"}
                    {currentSection === "parts" && "Part Images"}
                  </h4>
                </div>
                {currentSection !== "parts" && (
                  <a 
                    onClick={handleNextSection} 
                    className="p-1 text-gray-700 hover:text-[#E17218] transition-colors duration-200"
                  >
                    <Icon name="chevron-right" />
                  </a>
                )}
              </div>

              {/* Image content sections */}
              <div className="flex justify-center items-center">
                {currentSection === "original" && currentOcrResult?.image_paths?.original && (
                  <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 shadow-sm">
                    {currentOcrResult?.image_paths?.original ? (
                      <img
                        src={currentOcrResult?.image_paths?.original}
                        alt={`Original`}
                        className="max-w-md max-h-[350px] rounded-md"
                      />
                    ) : (
                      <p className="text-gray-500 italic">No Original Image</p>
                    )}
                  </div>
                )}
                
                {currentSection === "cropped" && currentOcrResult?.image_paths?.cropped && (
                  <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 shadow-sm">
                    {currentOcrResult?.image_paths?.cropped ? (
                      <img
                        src={currentOcrResult?.image_paths?.cropped}
                        alt={`Cut`}
                        className="max-w-md max-h-[350px] rounded-md"
                      />
                    ) : (
                      <p className="text-gray-500 italic">No Cut Image</p>
                    )}
                  </div>
                )}
                
                {currentSection === "qr" && currentOcrResult?.pdf_url && (
                  <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 shadow-sm">
                    {currentOcrResult?.pdf_url ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentOcrResult.pdf_url)}`}
                        alt="QR Code"
                        className="max-w-[250px] max-h-[250px] rounded-md"
                      />
                    ) : (
                      <p className="text-gray-500 italic">No QR Code</p>
                    )}
                  </div>
                )}
                
                {currentSection === "parts" && currentOcrResult?.image_paths?.parts && (
                  <div className="grid grid-cols-2 gap-4">
                    {currentOcrResult.image_paths.parts.map((imageSrc, index) => (
                      <div key={index} className="flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-2 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2 bg-gray-50 p-1 rounded-md w-full text-center max-h-[150px]">
                          {partLabels[index] || `Part ${index}`}
                        </h4>
                        <img
                          src={imageSrc}
                          alt={`Part ${index}`}
                          className="max-w-[150px] h-auto rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ModalTemplate>
      
      {/* Delete Confirmation Modal */}
      <ModalConfirmation
        isOpen={showDeleteConfirmation}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the OCR result for "${currentOcrResult?.filename}"? This action cannot be undone.`}
        onConfirm={handleDeleteOcrResult}
        onCancel={() => setShowDeleteConfirmation(false)}
        confirmText="Delete"
        cancelText="Cancel"
        icon="trash"
      />
    </>
  );
};

export default TransmittalDataPreviewModal;