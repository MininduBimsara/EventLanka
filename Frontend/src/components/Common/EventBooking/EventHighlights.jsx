// EventHighlights.jsx
import React from "react";

const EventHighlights = () => {
  return (
    <div className="p-4 mb-8 select-none bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
      <h3 className="mb-3 font-bold text-purple-800">Event Highlights</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="flex items-center">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full">
            <svg
              className="w-6 h-6 text-purple-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
            </svg>
          </div>
          <span className="ml-3 font-medium">30+ Live Performances</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-400 rounded-full">
            <svg
              className="w-6 h-6 text-purple-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
          <span className="ml-3 font-medium">Food & Drink Vendors</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-pink-400 rounded-full">
            <svg
              className="w-6 h-6 text-purple-900"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <span className="ml-3 font-medium">Interactive Experiences</span>
        </div>
      </div>
    </div>
  );
};

export default EventHighlights;
