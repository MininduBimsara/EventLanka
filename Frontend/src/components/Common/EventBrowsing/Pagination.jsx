import React from "react";

const Pagination = () => {
  return (
    <div className="flex justify-center mt-8">
      <nav
        id="event-pagination"
        className="relative overflow-hidden rounded-md"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] opacity-90 animate-gradient-event"></div>

        <div className="relative z-10 flex items-center p-1 space-x-2">
          <button className="px-3 py-2 transition-colors rounded-md text-white/80 hover:bg-white/10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="px-3 py-2 font-medium text-white rounded-md bg-white/20">
            1
          </button>
          <button className="px-3 py-2 text-white transition-colors rounded-md hover:bg-white/10">
            2
          </button>
          <button className="px-3 py-2 text-white transition-colors rounded-md hover:bg-white/10">
            3
          </button>
          <span className="px-3 py-2 text-white/70">...</span>
          <button className="px-3 py-2 text-white transition-colors rounded-md hover:bg-white/10">
            8
          </button>
          <button className="px-3 py-2 transition-colors rounded-md text-white/80 hover:bg-white/10">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Animation styles */}
        <style jsx>{`
          @keyframes gradient-event {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 50% 100%;
            }
            50% {
              background-position: 100% 50%;
            }
            75% {
              background-position: 50% 0%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient-event {
            background-size: 300% 300%;
            animation: gradient-event 20s ease infinite;
          }
        `}</style>
      </nav>
    </div>
  );
};

export default Pagination;
