import React, { useState, useEffect } from "react";
import IconWithText from "@/components/molecules/IconWithText";
import Icon from "@/components/atoms/Icon";
import ModalTemplate from "../templates/ModalTemplate";

const TransmittalModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
    const [step, setStep] = useState(1);
    const [modalProjectName, setModalProjectName] = useState("");
    const [modalDocumentName, setModalDocumentName] = useState("");
    const [transmittalNumber, setTransmittalNumber] = useState("");
    const [manualCsvFileName, setManualCsvFileName] = useState("");
    const [isTemplate, setIsTemplate] = useState(false);
    const [projectNameError, setProjectNameError] = useState("");
    const [documentNameError, setDocumentNameError] = useState("");
    const [transmittalNumberError, setTransmittalNumberError] = useState("");
    const [csvFileNameError, setCsvFileNameError] = useState("");

    const totalSteps = 3;

    useEffect(() => {
        if (isOpen) {
            resetState();
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    const resetState = () => {
        setStep(1);
        setModalProjectName(initialData.projectName || "");
        setModalDocumentName(initialData.documentName || "");
        setTransmittalNumber(initialData.transmittalNumber || "");
        setManualCsvFileName(initialData.csvFileName || "");
        setIsTemplate(false); // Always start with raw data mode
        clearErrors();
        document.body.classList.add("overflow-hidden");
    };

    const clearErrors = () => {
        setProjectNameError("");
        setDocumentNameError("");
        setTransmittalNumberError("");
        setCsvFileNameError("");
    };

    const handleNext = () => {
        clearErrors();
        let isValid = true;

        if (step === 1) {
            if (!modalProjectName) {
                setProjectNameError("Project Name is required.");
                isValid = false;
            }
        } else if (step === 2) {
            if (!modalDocumentName) {
                setDocumentNameError("Document Name is required.");
                isValid = false;
            }
            if (!transmittalNumber) {
                setTransmittalNumberError("Transmittal Number is required.");
                isValid = false;
            }
        } else if (step === 3) {
            if (!manualCsvFileName) {
                setCsvFileNameError("CSV File Name is required.");
                isValid = false;
            } else if (!/^[a-zA-Z0-9-_.]+$/.test(manualCsvFileName)) {
                setCsvFileNameError("CSV File Name can only contain letters, numbers, underscores, hyphens, and periods.");
                isValid = false;
            }
        }

        if (isValid && step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handlePrev = () => {
        clearErrors();
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const confirmGenerateTransmittal = () => {
        clearErrors();
        let isValid = true;

        if (!modalProjectName) {
            setProjectNameError("Project Name is required.");
            isValid = false;
        }

        if (!modalDocumentName) {
            setDocumentNameError("Document Name is required.");
            isValid = false;
        }

        if (!transmittalNumber) {
            setTransmittalNumberError("Transmittal Number is required.");
            isValid = false;
        }

        if (!manualCsvFileName) {
            setCsvFileNameError("CSV File Name is required.");
            isValid = false;
        } else if (!/^[a-zA-Z0-9-_.]+$/.test(manualCsvFileName)) {
            setCsvFileNameError("CSV File Name can only contain letters, numbers, underscores, hyphens, and periods.");
            isValid = false;
        }

        if (isValid) {
            onSubmit({
                projectName: modalProjectName,
                documentName: modalDocumentName,
                transmittalNumber,
                csvFileName: manualCsvFileName,
                isTemplate: isTemplate,
            });
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <ModalTemplate
            isOpen={isOpen}
            title="Document Transmittal Information"
            icon="document-text"
            size="md"
            onClose={handleClose}
            blurBackground={true}
            className="bg-gradient-to-br from-white to-[#E17218]/5"
            hideFooter={true}
        >
            <div className="space-y-6">
                <ol className="flex items-center w-full mb-8">
                    <li
                        className={`flex w-full items-center transition-all duration-300 ease-in-out ${step >= 1
                            ? "text-[#E17218] dark:text-[#EBA801]"
                            : "text-gray-500 dark:text-gray-400"
                            } after:content-[''] after:w-full after:h-1 after:border-b after:border-[#E17218]/10 after:border-4 after:inline-block dark:after:border-[#E17218]/30`}
                    >
                        <div
                            className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${step >= 1
                                ? "bg-[#E17218]/10 dark:bg-[#E17218]/20"
                                : "bg-gray-100 dark:bg-gray-700"
                                } rounded-full lg:h-12 lg:w-12 shrink-0`}
                        >
                            <svg
                                className={`w-4 h-4 transition-all duration-300 ease-in-out ${step >= 1
                                    ? "text-[#E17218] dark:text-[#EBA801]"
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
                            ? "text-[#E17218] dark:text-[#EBA801]"
                            : "text-gray-500 dark:text-gray-400 "
                            } after:content-[''] ${step >= 2 ? "after:w-full after:h-1 after:border-b after:border-[#E17218]/10 after:border-4 after:inline-block dark:after:border-[#E17218]/30" : "after:w-full after:h-1 after:border-b after:border-gray-100 after:border-4 after:inline-block dark:after:border-gray-700"}`}
                    >
                        <div
                            className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${step >= 2
                                ? "bg-[#E17218]/10 dark:bg-[#E17218]/20"
                                : "bg-gray-100 dark:bg-gray-700"
                                } rounded-full lg:h-12 lg:w-12 shrink-0`}
                        >
                            <svg
                                className={`w-4 h-4 transition-all duration-300 ease-in-out ${step >= 2
                                    ? "text-[#E17218] dark:text-[#EBA801]"
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
                            ? "text-[#E17218] dark:text-[#EBA801]"
                            : "text-gray-500 dark:text-gray-400"
                            }`}
                    >
                        <div
                            className={`flex items-center justify-center w-10 h-10 transition-all duration-300 ease-in-out ${step >= 3
                                ? "bg-[#E17218]/10 dark:bg-[#E17218]/20"
                                : "bg-gray-100 dark:bg-gray-700"
                                } rounded-full lg:h-12 lg:w-12 shrink-0`}
                        >
                            <svg
                                className={`w-4 h-4 transition-all duration-300 ease-in-out ${step >= 3
                                    ? "text-[#E17218] dark:text-[#EBA801]"
                                    : "text-gray-500 dark:text-gray-400"
                                    } lg:w-6 lg:h-6`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 18 20"
                            >
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
                            </svg>
                        </div>
                    </li>
                </ol>

                {/* Step 1: Project Name */}
                {step === 1 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-semibold text-gray-700">
                            Project Name
                        </label>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Enter the project identifier that will help categorize and organize this transmittal document in your records.
                        </p>
                        <input
                            className={`w-full border ${projectNameError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition`}
                            type="text"
                            value={modalProjectName}
                            onChange={(e) => setModalProjectName(e.target.value)}
                            placeholder="e.g., Downtown Office Tower"
                        />
                        {projectNameError && <p className="text-red-500 text-sm font-medium">{projectNameError}</p>}
                    </div>
                )}

                {/* Step 2: Document Name + Transmittal Number */}
                {step === 2 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-semibold text-gray-700">
                            Document Name
                        </label>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Provide a descriptive name for the document being transmitted to easily identify its contents.
                        </p>
                        <input
                            className={`w-full border ${documentNameError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition`}
                            type="text"
                            value={modalDocumentName}
                            onChange={(e) => setModalDocumentName(e.target.value)}
                            placeholder="e.g., Structural Engineering Plans"
                        />
                        {documentNameError && <p className="text-red-500 text-sm font-medium">{documentNameError}</p>}

                        <label className="block text-lg font-semibold text-gray-700">
                            Transmittal Number
                        </label>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Enter a unique reference number for tracking this transmittal throughout its lifecycle.
                        </p>
                        <input
                            className={`w-full border ${transmittalNumberError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition`}
                            type="text"
                            value={transmittalNumber}
                            onChange={(e) => setTransmittalNumber(e.target.value)}
                            placeholder="e.g., TRN-2023-0542"
                        />
                        {transmittalNumberError && <p className="text-red-500 text-sm font-medium">{transmittalNumberError}</p>}
                        <p className="text-sm text-gray-500">
                            Use a consistent format to maintain organization across all your transmittals.
                        </p>
                    </div>
                )}

                {/* Step 3: CSV File Name & Template Toggle */}
                {step === 3 && (
                    <div className="space-y-4">
                        <label className="block text-lg font-semibold text-gray-700">
                            Output Filename
                        </label>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Specify a filename for the exported CSV data that will be generated.
                        </p>
                        <input
                            className={`w-full border ${csvFileNameError ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E17218] focus:border-[#E17218] transition`}
                            type="text"
                            value={manualCsvFileName}
                            onChange={(e) => setManualCsvFileName(e.target.value)}
                            placeholder="e.g., downtown_tower_transmittal"
                        />
                        {csvFileNameError && <p className="text-red-500 text-sm font-medium">{csvFileNameError}</p>}

                        <div className="mt-6 p-4 bg-[#E17218]/5 rounded-lg border border-[#E17218]/10">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-[#E17218] rounded-md border-gray-300"
                                    checked={isTemplate}
                                    onChange={(e) => setIsTemplate(e.target.checked)}
                                />
                                <span className="ml-2 text-gray-800 font-medium">Include Formatting Template</span>
                            </label>
                            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                                {isTemplate
                                    ? "Your CSV will include professional formatting with headers and structured layout for better readability."
                                    : "Your CSV will contain only the essential data, optimized for importing into other systems."}
                            </p>
                            <p className="text-sm text-[#E17218] mt-2">
                                {!isTemplate && "Files without formatting will be saved with '-raw' suffix for easy identification."}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-6">
                    {step > 1 && (
                        <a
                            className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2"
                            onClick={handlePrev}
                        >
                            <IconWithText icon="arrow-left" text="Previous" />
                        </a>
                    )}
                    {step < 3 && (
                        <a
                            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white hover:from-[#E17218]/90 hover:to-[#EBA801]/90 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-[#E17218]/20"
                            onClick={handleNext}
                        >
                            <span className="mr-2">
                                {step === 1 ? "Continue to Details" : "Review Information"}
                            </span>
                            <Icon name="arrow-right" />
                        </a>
                    )}
                    {step === 3 && (
                        <a
                            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white hover:from-[#E17218]/90 hover:to-[#EBA801]/90 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-[#E17218]/20"
                            onClick={confirmGenerateTransmittal}
                        >
                            <IconWithText icon="download" text="Generate Transmittal" />
                        </a>
                    )}
                </div>
            </div>
        </ModalTemplate>
    );
}

export default TransmittalModal;