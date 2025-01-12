import React, { useState, useEffect } from "react";
import IconWithText from "@/components/molecules/IconWithText";
import Icon from "@/components/atoms/Icon";

function TransmittalModal({ isOpen, onClose, onSubmit, initialData = {} }) {
    const [step, setStep] = useState(1);
    const [modalProjectName, setModalProjectName] = useState(
        initialData.projectName || ""
    );
    const [modalDocumentName, setModalDocumentName] = useState(
        initialData.documentName || ""
    );
    const [transmittalNumber, setTransmittalNumber] = useState(
        initialData.transmittalNumber || ""
    );
    const [manualCsvFileName, setManualCsvFileName] = useState(
        initialData.csvFileName || ""
    );
    const [errorMessage, setErrorMessage] = useState("");
    const totalSteps = 3;

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setErrorMessage("");
            setModalProjectName(initialData.projectName || "");
            setModalDocumentName(initialData.documentName || "");
            setTransmittalNumber(initialData.transmittalNumber || "");
            setManualCsvFileName(initialData.csvFileName || "");
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen, initialData]);

    const handleNext = () => {
        setErrorMessage("");
        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        setErrorMessage("");
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const confirmGenerateTransmittal = () => {
        if (
            !modalProjectName ||
            !modalDocumentName ||
            !transmittalNumber ||
            !manualCsvFileName
        ) {
            setErrorMessage("Please complete all fields to proceed.");
            return;
        }
        onSubmit({
            projectName: modalProjectName,
            documentName: modalDocumentName,
            transmittalNumber,
            csvFileName: manualCsvFileName,
        });
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative space-y-6 transform transition-all duration-300 ease-in-out scale-100 ">
                <h1 className="text-2xl font-bold text center">
                   Required Information
                </h1>
                {/* Close Button (X icon) */}
                <a
                    className="top-1 right-4 text-gray-500 hover:text-gray-700 transition max-w-max mb-4 absolute"
                    onClick={handleClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </a>
                {/* Stepper */}
                <ol className="flex items-center w-full mb-8">
                    <li
                        className={`flex w-full items-center transition-all duration-300 ease-in-out ${step >= 1
                                ? "text-blue-600 dark:text-blue-500"
                                : "text-gray-500 dark:text-gray-400"
                            } after:content-[''] after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800`}
                    >
                        <div
                            className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${step >= 1
                                    ? "bg-blue-100 dark:bg-blue-800"
                                    : "bg-gray-100 dark:bg-gray-700"
                                } rounded-full lg:h-12 lg:w-12 shrink-0`}
                        >
                            <svg
                                className={`w-4 h-4 transition-all duration-300 ease-in-out ${step >= 1
                                    ? "text-blue-600 dark:text-blue-300"
                                    : "text-gray-500 dark:text-gray-400"
                                } lg:w-6 lg:h-6`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 16"
                            >
                                <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                            </svg>
                        </div>
                    </li>
                    <li
                        className={`flex w-full items-center transition-all duration-300 ease-in-out ${step >= 2
                                ? "text-blue-600 dark:text-blue-500"
                                : "text-gray-500 dark:text-gray-400"
                            } after:content-[''] ${step >= 2 ? "after:w-full after:h-1 after:border-b after:border-blue-100 after:border-4 after:inline-block dark:after:border-blue-800" : "after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700" }`}
                    >
                        <div
                            className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${step >= 2
                                    ? "bg-blue-100 dark:bg-blue-800"
                                    : "bg-gray-100 dark:bg-gray-700"
                                } rounded-full lg:h-12 lg:w-12 shrink-0`}
                        >
                            <svg
                                className={`w-4 h-4 transition-all duration-300 ease-in-out ${step >= 2
                                    ? "text-blue-600 dark:text-blue-300"
                                    : "text-gray-500 dark:text-gray-400"
                                } lg:w-6 lg:h-6`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 14"
                            >
                                <path d="M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM2 12V6h16v6H2Z" />
                                <path d="M6 8H4a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2Zm8 0H9a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2Z" />
                            </svg>
                        </div>
                    </li>
                    <li
                        className={`flex items-center transition-all duration-300 ease-in-out ${step >= 3
                                ? "text-blue-600 dark:text-blue-500"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        <div
                            className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${step >= 3
                                    ? "bg-blue-100 dark:bg-blue-800"
                                    : "bg-gray-100 dark:bg-gray-700"
                                } rounded-full lg:h-12 lg:w-12 shrink-0`}
                        >
                            <svg
                                className={`w-4 h-4 transition-all duration-300 ease-in-out ${step >= 3
                                    ? "text-blue-600 dark:text-blue-300"
                                    : "text-gray-500 dark:text-gray-400"
                                } lg:w-6 lg:h-6`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 18 20"
                            >
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                            </svg>
                        </div>
                    </li>
                </ol>

                {/* Step 1: Project Name */}
                {step === 1 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-semibold text-gray-700">
                            Please specify the project name.
                        </label>
                        <p className="text-sm text-gray-500">
                            This will be used as the project identifier for the transmittal.
                        </p>
                        <input
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            type="text"
                            value={modalProjectName}
                            onChange={(e) => setModalProjectName(e.target.value)}
                            placeholder="Enter project name"
                        />
                    </div>
                )}

                {/* Step 2: Document Name + Transmittal Number */}
                {step === 2 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-semibold text-gray-700">
                           Kindly provide the document name.
                        </label>
                         <p className="text-sm text-gray-500">
                            This will be used as the document identifier for the transmittal.
                        </p>
                        <input
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            type="text"
                            value={modalDocumentName}
                            onChange={(e) => setModalDocumentName(e.target.value)}
                            placeholder="Enter document name"
                        />
                        <label className="block text-lg font-semibold text-gray-700">
                           Please specify the transmittal number.
                        </label>
                          <p className="text-sm text-gray-500">
                             This is the transmittal identifier for the document.
                           </p>
                        <input
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            type="text"
                            value={transmittalNumber}
                            onChange={(e) => setTransmittalNumber(e.target.value)}
                            placeholder="Enter transmittal number"
                        />
                         <p className="text-sm text-gray-400">
                           Letters and numbers are accepted.
                         </p>
                    </div>
                )}

                {/* Step 3: CSV File Name */}
                {step === 3 && (
                    <div className="space-y-4">
                       <label className="block text-lg font-semibold text-gray-700">
                           Lastly, specify the CSV file name.
                        </label>
                           <p className="text-sm text-gray-500">
                              This will be the name of the generated CSV file.
                           </p>
                        <input
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                            type="text"
                            value={manualCsvFileName}
                            onChange={(e) => setManualCsvFileName(e.target.value)}
                            placeholder="Enter CSV file name"
                        />
                    </div>
                )}
                 {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                {/* Step controls */}
                <div className="flex justify-end space-x-3">
                    {step > 1 && (
                        <button
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-700 bg-opacity-90 transition hover:scale-105"
                             onClick={handlePrev}
                        >
                              <IconWithText icon="arrow-left" text="Back" />
                        </button>
                    )}
                    {step < 3 && (
                        <button
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:opacity-90 transition hover:scale-105"
                            onClick={handleNext}
                        >
                            <span className="mr-2">
                                {step === 1 && "Set Details"}
                                {step === 2 && "Last Touch"}
                            </span>
                           <Icon name="arrow-right" />
                        </button>
                    )}
                    {step === 3 && (
                        <button
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white hover:opacity-90 transition hover:scale-105"
                           onClick={confirmGenerateTransmittal}
                        >
                           <IconWithText icon="download" text="Generate" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TransmittalModal;