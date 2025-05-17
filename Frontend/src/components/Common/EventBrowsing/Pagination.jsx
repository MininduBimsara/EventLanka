import React from "react";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis before range if needed
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    // Add ellipsis after range if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle button clicks
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Don't show pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 select-none">
      <nav
        id="event-pagination"
        className="relative overflow-hidden border border-blue-100 rounded-lg shadow-lg"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] opacity-90 animate-gradient-event"></div>

        <div className="relative z-10 flex items-center p-2 space-x-2">
          {/* Previous button */}
          <button
            className={`px-3 py-2 transition-colors rounded-md text-white ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/20"
            }`}
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-white opacity-80"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                className={`px-4 py-2 transition-all duration-300 transform ${
                  page === currentPage
                    ? "font-bold text-white rounded-md bg-white/20 scale-105 shadow-md"
                    : "text-white rounded-md hover:bg-white/10 hover:scale-105"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}

          {/* Next button */}
          <button
            className={`px-3 py-2 transition-colors rounded-md text-white ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/20"
            }`}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Pagination;
