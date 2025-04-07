import { React } from "react";

const ViewToggle = () => {
  return (
    <div id="event-view-toggle" className="relative overflow-hidden rounded-md">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] opacity-90 animate-gradient-event"></div>

      <div className="relative z-10 flex items-center p-1 space-x-2">
        <button className="p-2 text-white rounded-md bg-white/20">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button className="p-2 transition-colors rounded-md text-white/70 hover:text-white hover:bg-white/10">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
    </div>
  );
};

export default ViewToggle;
