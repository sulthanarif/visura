import React from "react";
import Icon from "../atoms/Icon";


/**
 * Reusable Modal Template component with consistent styling
 * @param {boolean} isOpen - Controls modal visibility
 * @param {string} title - Modal title text
 * @param {function} onClose - Function to call when closing the modal
 * @param {string} icon - Optional icon name to display in header
 * @param {string} size - Modal size: 'sm', 'md', 'lg' or 'xl'
 * @param {boolean} showCloseButton - Whether to show the close a in header
 * @param {Node} footer - Custom footer component
 * @param {string} footerAlign - Footer alignment: 'left', 'center', 'right'
 * @param {boolean} hideFooter - Whether to hide the footer
 * @param {boolean} blurBackground - Whether to apply backdrop blur
 * @param {string} className - Additional class names for modal content
 */
const ModalTemplate = ({
  isOpen,
  title,
  onClose,
  icon,
  size = "md",
  showCloseButton = true,
  footer,
  footerAlign = "right",
  hideFooter = false,
  blurBackground = true,
  className = "",
  children,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl"
  };

  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden transition-opacity duration-300 ease-in-out ${blurBackground ? 'backdrop-blur-sm' : ''}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className={`${sizeClasses[size]} w-full p-4 relative`}>
        <div className={`bg-white rounded-xl shadow-2xl relative transform transition-all duration-300 ease-in-out border border-gray-100 ${className}`}>
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
            
            {showCloseButton && (
              <a
                onClick={onClose}
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
            )}
          </div>
          
          {/* Content */}
          <div className="p-5 overflow-y-auto max-h-[70vh]">
            {children}
          </div>
          
          {/* Footer */}
          {!hideFooter && (
            <div className={`flex ${alignClasses[footerAlign]} items-center p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl`}>
              {footer || (
                <div className="flex space-x-3">
                  <a
                    onClick={onClose}
                    className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-300"
                  >
                    Cancel
                  </a>
                  <a
                    className="px-5 py-2.5 text-white bg-gradient-to-r from-[#E17218] to-[#EBA801] hover:from-[#E17218]/90 hover:to-[#EBA801]/90 rounded-xl shadow-lg shadow-[#E17218]/20 transition-all duration-300"
                  >
                    Confirm
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalTemplate;
