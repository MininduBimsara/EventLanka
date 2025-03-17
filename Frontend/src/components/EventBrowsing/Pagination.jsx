import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-2">
        <button className="px-3 py-2 text-gray-500 rounded-md hover:bg-gray-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button className="px-3 py-2 font-medium text-white bg-indigo-600 rounded-md">
          1
        </button>
        <button className="px-3 py-2 rounded-md hover:bg-gray-100">2</button>
        <button className="px-3 py-2 rounded-md hover:bg-gray-100">3</button>
        <span className="px-3 py-2 text-gray-500">...</span>
        <button className="px-3 py-2 rounded-md hover:bg-gray-100">8</button>
        <button className="px-3 py-2 text-gray-500 rounded-md hover:bg-gray-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
