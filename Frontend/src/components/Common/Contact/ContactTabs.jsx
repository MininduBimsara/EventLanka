// File: components/contact/ContactTabs.jsx
import React from "react";

const ContactTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex max-w-md p-1 mx-auto mb-8 bg-white rounded-full select-none bg-opacity-20">
      <button
        onClick={() => setActiveTab("form")}
        className={`flex-1 py-3 px-4 rounded-full transition-all duration-300 ${
          activeTab === "form"
            ? "bg-white text-purple-700 shadow-lg"
            : "text-[#2a2e60] hover:bg-white hover:bg-opacity-10"
        }`}
      >
        Contact Form
      </button>
      <button
        onClick={() => setActiveTab("info")}
        className={`flex-1 py-3 px-4 rounded-full transition-all duration-300 ${
          activeTab === "info"
            ? "bg-white text-purple-700 shadow-lg"
            : "text-[#2a2e60] hover:bg-white hover:bg-opacity-10"
        }`}
      >
        Info & FAQ
      </button>
    </div>
  );
};

export default ContactTabs;
