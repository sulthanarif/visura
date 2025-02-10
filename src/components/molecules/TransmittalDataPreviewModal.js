import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import Icon from "@/components/atoms/Icon";
import Button from "@/components/atoms/Button";
import IconWithText from "./IconWithText";

const TransmittalDataPreviewModal = ({
  isOpen,
  onClose,
  selectedProject,
  ocrResults,
  currentPage,
}) => {
  if (!isOpen) return null;

  const currentOcrResult = ocrResults?.find((ocr) => ocr.id === currentPage - 1);
  const [currentSection, setCurrentSection] = useState("original");

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

  const partLabels = ["Title", "Revision", "Drawing Code", "Date"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transmittal Data Preview
          </h3>
          <a
            onClick={onClose}
            type="a"
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
        <div className="mt-6 flex">
          {selectedProject && (
            <div className="space-y-4 w-1/2 pr-4 border-r dark:border-gray-700">
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
                          File Name:
                         </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                            {currentOcrResult.filename || "N/A"}
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
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
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
            </div>
          )}
            <div className="w-1/2 pl-4 space-y-2">
                 <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Images:
              </h4>
              <div className="relative">
               <div className="flex justify-between items-center mb-2">
                <div className="flex space-x-2">
                    {currentSection !== "original" && (
                         <a onClick={handlePrevSection} className="p-1">
                             <Icon name="angle-left" />
                           </a>
                    )}
                      {currentSection === "original" && 
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            Original Image:
                         </h4>
                        }

                        {currentSection === "cropped" &&
                         <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                           Cut Image:
                         </h4>
                        }

                         {currentSection === "qr" &&
                           <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            QR Code:
                            </h4>
                           }
                        {currentSection === "parts" &&
                             <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                               Part Images:
                            </h4>
                        }
                    </div>
                     {currentSection !== "parts" && (
                         <a onClick={handleNextSection}  className="p-1">
                              <Icon name="angle-right" />
                          </a>
                        )}

                 </div>

                {currentSection === "original" && currentOcrResult?.image_paths?.original && (
                 <div className="flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 p-2 shadow-md">
                    {currentOcrResult?.image_paths?.original ? (
                    <img
                        src={currentOcrResult?.image_paths?.original}
                        alt={`Original`}
                       className="max-w-md max-h-[350px] rounded-md "
                    />
                    ) : (
                        <p>No Original Image</p>
                    )}
                     </div>
                    )}
                   {currentSection === "cropped" && currentOcrResult?.image_paths?.cropped && (
                        <div className="flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 p-2 shadow-md">
                    {currentOcrResult?.image_paths?.cropped ? (
                        <img
                        src={currentOcrResult?.image_paths?.cropped}
                        alt={`Cut`}
                        className="max-w-md max-h-[350px] rounded-md "
                        />
                        ) : (
                        <p>No Cut Image</p>
                        )}
                      </div>
                   )}
                  {currentSection === "qr" && currentOcrResult?.pdf_url && (
                    <div className="flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 p-2 shadow-md">
                    {currentOcrResult?.pdf_url ? (
                        <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentOcrResult.pdf_url)}`}
                        alt="QR Code"
                       className="max-w-[250px] max-h-[250px]  rounded-md  "
                        />
                        ) : (
                            <p>No QR Code</p>
                            )
                    }
                    </div>
                    )}
                    {currentSection === "parts" && currentOcrResult?.image_paths?.parts && (
                      <div className="space-y-2">
                    
                       {currentOcrResult.image_paths.parts.map((imageSrc, index) => (
                          <div key={index} className="flex flex-col items-center justify-center w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 shadow-md mb-4">
                            
                             <h4  className="text-sm font-semibold text-gray-800 dark:text-white mb-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-md w-full text-center">
                                  {partLabels[index] || `Part ${index}`}
                                </h4>
                                <img
                                  src={imageSrc}
                                  alt={`Part ${index}`}
                                    className="max-w-[150px] h-auto rounded-md "
                                />
                             
                              </div>
                        ))}
                   </div>
                    )}
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
};
export default TransmittalDataPreviewModal;