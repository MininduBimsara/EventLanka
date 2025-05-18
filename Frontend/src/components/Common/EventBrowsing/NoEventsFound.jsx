import React from "react";

const NoEventsFound = () => {
  return (
    <div className="p-8 text-center transition-all duration-300 transform bg-white border border-blue-100 rounded-lg shadow-lg select-none">
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 overflow-hidden bg-blue-100 rounded-full">
        <svg
          className="w-10 h-10 text-pink-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h3 className="mb-4 text-2xl font-bold text-blue-900">No Events Found</h3>
      <div className="w-16 h-1 mx-auto mb-6 bg-pink-400 rounded-full"></div>

      <p className="mb-8 text-blue-800">
        Try adjusting your filters or search criteria
      </p>

      <button className="px-8 py-3 font-bold text-white transition-all duration-300 transform bg-blue-800 rounded-full shadow-lg hover:bg-pink-400 hover:scale-105">
        Browse All Events
      </button>
    </div>
  );
};

export default NoEventsFound;
