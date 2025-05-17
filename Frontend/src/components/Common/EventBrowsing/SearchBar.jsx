import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative w-full select-none md:w-64 lg:w-80">
      <div className="relative overflow-hidden transition-all duration-300 transform border border-blue-100 rounded-md shadow-md hover:shadow-lg">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full px-4 py-3 pl-10 text-blue-900 bg-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute w-5 h-5 text-pink-400 transform -translate-y-1/2 left-3 top-1/2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>

        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute transform -translate-y-1/2 right-3 top-1/2"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5 text-gray-400 hover:text-pink-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
