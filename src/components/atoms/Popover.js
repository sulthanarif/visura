import React, { useState, useRef, useEffect } from 'react';

const Popover = ({ isOpen, children, content, className }) => {
    const [showPopover, setShowPopover] = useState(isOpen);
    const popoverRef = useRef(null);
    const buttonRef = useRef(null)


    const handleTogglePopover = () => {
        setShowPopover(!showPopover)
    };

       useEffect(() => {
         const handleClickOutside = (event) => {
            if( popoverRef.current && !popoverRef.current.contains(event.target) &&  buttonRef.current && !buttonRef.current.contains(event.target)){
                setShowPopover(false);
             }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

    useEffect(() => {
        setShowPopover(isOpen)
    }, [isOpen])

    return (
        <div className={`relative inline-block ${className}`}>
            <span ref={buttonRef}
                onClick={handleTogglePopover}
                className="cursor-pointer"
            >
                {children}
            </span>
            {showPopover && (
                <div ref={popoverRef}
                     className="absolute right-full mr-2 top-0 z-10 w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-md dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                   >
                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                         <h3 className="font-semibold text-gray-900 dark:text-white">Info</h3>
                     </div>
                     <div className="px-3 py-2">
                       {content}
                     </div>
                     <div data-popper-arrow></div>
                </div>
            )}
        </div>
    );
};

export default Popover;