import React from "react";
import Icon from "../atoms/Icon";

/**
 * ModalConfirmation Component
 * 
 * A reusable confirmation dialog that follows the application's design system.
 * This component presents important messages that require user confirmation
 * before proceeding with critical actions.
 * 
 * @param {boolean} isOpen - Controls dialog visibility
 * @param {string} title - Dialog title text
 * @param {string} message - Confirmation message to display
 * @param {function} onConfirm - Callback when user confirms the action
 * @param {function} onCancel - Callback when user cancels the action
 * @param {string} confirmText - Custom text for confirm button
 * @param {string} cancelText - Custom text for cancel button
 * @param {string} icon - Optional icon name to display in header
 * @param {React.ReactNode} children - Optional custom content
 */
const ModalConfirmation = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon = "alert-triangle",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden transition-opacity duration-300 ease-in-out backdrop-blur-sm">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />
      <div className="bg-white rounded-xl shadow-2xl relative transform transition-all duration-300 ease-in-out border border-gray-100 max-w-sm w-full p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 rounded-t-xl bg-gradient-to-r from-[#E17218]/10 to-white">
          <div className="flex items-center">
            {icon && (
              <div className="mr-3">
                <Icon name={icon} className="text-[#E17218] w-5 h-5" />
              </div>
            )}
            <h3 className="text-xl font-semibold bg-gradient-to-r from-[#E17218] to-[#EBA801] bg-clip-text text-transparent">
              {title}
            </h3>
          </div>
          
          <a
            onClick={onCancel}
            className="text-gray-400 hover:text-[#E17218] transition-colors duration-200 hover:rotate-90 transform transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
        </div>
        
        {/* Content */}
        <div className="p-5 overflow-y-auto">
          {children ? (
            children
          ) : (
            <div
              className="flex items-center p-4 mb-2 text-sm border rounded-lg bg-[#E17218]/5 border-[#E17218]/10 text-gray-700"
              role="alert"
            >
              <svg
                className="shrink-0 inline w-5 h-5 me-3 text-[#CC1B1B]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              <span className="sr-only">Info</span>
              <div className="body-font-large text-[#CC1B1B]">
                <span className="font-bold">Warning!</span> {message}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-end items-center p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex space-x-3">
            <a
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-300"
            >
              {cancelText}
            </a>
            <a
              onClick={onConfirm}
              className="px-5 py-2.5 text-white bg-gradient-to-r from-[#E17218] to-[#EBA801] hover:from-[#E17218]/90 hover:to-[#EBA801]/90 rounded-xl shadow-lg shadow-[#E17218]/20 transition-all duration-300"
            >
              {confirmText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;