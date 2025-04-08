import { React } from "react";

const NoEventsFound = () => {
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3D0C7D] via-[#7A4495] to-[#F0A8AE] opacity-90 animate-gradient-event"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-8">
        <svg
          className="w-16 h-16 mb-4 text-white/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mb-1 text-lg font-medium text-white">No events found</h3>
        <p className="text-gray-100">
          Try adjusting your filters or search criteria
        </p>
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

export default NoEventsFound;
