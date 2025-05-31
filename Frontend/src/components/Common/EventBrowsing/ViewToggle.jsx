import React from "react";

const ViewToggle = ({ viewMode, onViewChange }) => {
  return (
    <div
      id="event-view-toggle"
      className="relative overflow-hidden rounded-md select-none"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-black opacity-90 animate-gradient-event"></div>

      <div className="relative z-10 flex items-center p-1 space-x-2">
        {/* List View Button */}
        <button
          onClick={() => onViewChange("list")}
          className={`p-2 rounded-md transition-colors ${
            viewMode === "list"
              ? "text-white bg-white/20"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
          title="List View"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Grid View Button */}
        <button
          onClick={() => onViewChange("grid")}
          className={`p-2 rounded-md transition-colors ${
            viewMode === "grid"
              ? "text-white bg-white/20"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
          title="Grid View"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
