import React from "react";
import Icon from "../atoms/Icon";

const ModalConfirmation = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Konfirmasi",
  cancelText = "Batalkan",
  icon = "",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel}
      />
      <div className="bg-white p-6 rounded-lg shadow-xl relative z-10 max-w-sm w-full transform transition-all">
        <div className="flex items-center mb-4">
          <Icon name={icon} className="text-red-500 mr-2" />
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {children ? (
          children
        ) : (
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <svg
              className="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
             {message}
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmation;