// 3. Message Display Component (components/MessageDisplay.jsx)
import React from "react";

const MessageDisplay = ({ successMessage, errorMessage }) => {
  if (!successMessage && !errorMessage) return null;

  return (
    <>
      {successMessage && (
        <div className="p-3 mb-4 text-center text-green-700 bg-green-100 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 mb-4 text-center text-red-700 bg-red-100 rounded-md">
          {errorMessage}
        </div>
      )}
    </>
  );
};

export default MessageDisplay;
