import React from "react";
import Icon from "../atoms/Icon";

const ModalConfirmation = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    icon = "",
    children,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onCancel} />
            <div className="bg-white p-6 rounded-lg shadow-xl relative z-10 max-w-sm w-full transform transition-all">
                <div className="flex items-center mb-4">
                    <Icon name={icon} className="text-red-500 mr-2" />
                    <h2 className="text-xl font-semibold">{title}</h2>
                </div>
                {children ? children : <p className="text-gray-700 text-sm mb-4">{message}</p>}
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