// File: components/contact/DecorativeElements.jsx
import React from "react";

const DecorativeElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-20 h-20 bg-yellow-300 rounded-full top-20 left-10 opacity-20 animate-pulse"></div>
      <div className="absolute w-32 h-32 bg-blue-300 rounded-full top-40 right-20 opacity-20 animate-ping"></div>
      <div className="absolute w-16 h-16 bg-green-300 rounded-full bottom-20 left-1/4 opacity-30 animate-bounce"></div>
      <div className="absolute w-24 h-24 bg-red-300 rounded-full top-1/3 right-1/3 opacity-20 animate-pulse"></div>
    </div>
  );
};

export default DecorativeElements;
