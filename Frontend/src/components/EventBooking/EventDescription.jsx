// EventDescription.jsx
import React from "react";

const EventDescription = ({ description }) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute top-0 w-1 h-full -left-4 bg-gradient-to-b from-purple-600 to-pink-500"></div>
        <h2 className="mb-2 text-2xl font-bold text-purple-800">
          About This Event
        </h2>
        <p className="leading-relaxed text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default EventDescription;
