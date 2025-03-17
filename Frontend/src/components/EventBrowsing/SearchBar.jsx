import React from "react";

const SearchBar = ({searchTerm, setSearchTerm}) => {
  return (
    <>
      {/* Search bar */}
      <div className="relative w-full md:w-64 lg:w-80">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full px-4 py-2 pl-10 text-gray-700 bg-gray-100 border-none rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </>
  );
};

export default SearchBar;