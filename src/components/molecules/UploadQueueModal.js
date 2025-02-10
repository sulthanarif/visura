import React from 'react';

const UploadQueueModal = ({ isOpen, images, onClose, onDeleteImage }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="flex items-center justify-between pb-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload Queue Images
            </h3>
            <button
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
            </button>
          </div>
            
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {images && images.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <li key={index} className="relative">
                    <img
                      src={image.src}
                      alt={`Image ${index}`}
                      className="w-full h-auto rounded-md"
                    />
                    <button
                      onClick={() => onDeleteImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full focus:outline-none"
                    >
                       <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                   className="w-4 h-4"
                                >
                                 <path
                                   strokeLinecap="round"
                                    strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                            </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No images available in the queue.</p>
            )}
          </div>
        </div>
      </div>
    );
};
  
export default UploadQueueModal;