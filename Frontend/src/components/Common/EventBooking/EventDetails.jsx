// EventDetails.jsx
import React from "react";

const EventDetails = ({ date, time, location }) => {
  return (
    <div className="flex flex-col flex-wrap gap-4 mb-6 text-gray-700 select-none md:flex-row">
      <div className="flex items-center px-4 py-2 bg-purple-100 rounded-full">
        <svg
          className="w-5 h-5 mr-2 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <span className="font-medium">{date}</span>
      </div>

      <div className="flex items-center px-4 py-2 bg-pink-100 rounded-full">
        <svg
          className="w-5 h-5 mr-2 text-pink-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="font-medium">{time}</span>
      </div>

      <div className="flex items-center px-4 py-2 bg-orange-100 rounded-full">
        <svg
          className="w-5 h-5 mr-2 text-orange-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
        <span className="font-medium">{location}</span>
      </div>
    </div>
  );
};

export default EventDetails;
