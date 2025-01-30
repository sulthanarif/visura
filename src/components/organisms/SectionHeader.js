//src/components/organisms/SectionHeader.js
import React from 'react';

const SectionHeader = ({ title, onSearchChange,children }) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<h1 className="text-2xl font-semibold text-gray-800 dark:text-white ml-4">{title}</h1>

      <div className="mt-4 md:mt-0 flex items-center space-x-2">
        {children}
        <input
          type="text"
          id="simple-search"
          className="placeholder:italic placeholder:text-gray-400 block bg-gray-50 w-full border border-gray-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-500 dark:text-white mr-4"  
          placeholder="Search..."
          onChange={onSearchChange}
        />
      </div>
    </header>
  );
};

export default SectionHeader;
