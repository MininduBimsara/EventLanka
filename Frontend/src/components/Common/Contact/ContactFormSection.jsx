// File: components/contact/ContactFormSection.jsx
import React, { useState } from "react";
import { Send } from "lucide-react";

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-6 transition-all duration-500 transform bg-white border border-white bg-opacity-10 rounded-2xl backdrop-blur-md border-opacity-20 hover:scale-102 hover:shadow-xl">
      <h2 className="mb-6 text-3xl font-bold text-[#2a2e60]">
        Send Us a Message
      </h2>
      <form>
        <div className="relative mb-4 group">
          <label className="block mb-1 text-sm text-[#2a2e60] transition-all duration-300 group-focus-within:text-yellow-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 text-[#2a2e60] placeholder-[#2a2e60] transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            placeholder="Your name"
          />
        </div>
        <div className="relative mb-4 group">
          <label className="block mb-1 text-sm text-[#2a2e60] transition-all duration-300 group-focus-within:text-yellow-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 text-[#2a2e60] placeholder-[#2a2e60] transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
        <div className="relative mb-4 group">
          <label className="block mb-1 text-sm text-[#2a2e60] transition-all duration-300 group-focus-within:text-yellow-300">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full p-3 text-[#2a2e60] placeholder-[#2a2e60] transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            placeholder="What's this about?"
          />
        </div>
        <div className="relative mb-6 group">
          <label className="block mb-1 text-sm text-[#2a2e60] transition-all duration-300 group-focus-within:text-yellow-300">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 text-[#2a2e60] placeholder-[#2a2e60] transition-all duration-300 bg-white border border-white rounded-lg bg-opacity-10 border-opacity-30 placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
            placeholder="Tell us how we can help you..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="flex items-center justify-center w-full px-6 py-3 font-bold text-[#f4d58d] transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-xl hover:scale-105 group animate-pulse"
        >
          <span>Send Message</span>
          <Send
            size={18}
            className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </form>
    </div>
  );
};

export default ContactFormSection;
