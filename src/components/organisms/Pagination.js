//src/components/organisms/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, usersPerPage, totalUsers, handlePageChange }) => (
  <footer className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
    <span className="text-sm text-gray-500 dark:text-gray-400">
      Showing
      <span className="font-semibold text-gray-900 dark:text-white mx-1">
        {totalUsers > 0 ? ((currentPage - 1) * usersPerPage + 1) : 0} -
          {totalUsers > 0 ? (currentPage * usersPerPage > totalUsers ? totalUsers : currentPage * usersPerPage) : 0}
      </span>
      of
      <span className="font-semibold text-gray-900 dark:text-white mx-1">{totalUsers}</span>
    </span>
    <div className="inline-flex items-center space-x-1 mt-4 md:mt-0">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
           disabled={currentPage === 1}
          className="px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-500 rounded-l-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
        >
          <span className="sr-only">Previous</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
           disabled={currentPage * usersPerPage >= totalUsers}
           className="px-3 py-1.5 bg-gray-50 border border-gray-300 text-gray-500 rounded-r-md hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white disabled:opacity-50"
        >
          <span className="sr-only">Next</span>
          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                 d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
            />
         </svg>
        </button>
    </div>
  </footer>
);

export default Pagination;