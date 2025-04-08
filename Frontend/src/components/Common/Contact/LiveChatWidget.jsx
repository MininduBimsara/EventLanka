// File: components/contact/LiveChatWidget.jsx
import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

const LiveChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="fixed z-50 bottom-6 right-6">
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="flex items-center justify-center w-16 h-16 text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-110 hover:rotate-6 animate-bounce"
      >
        <MessageCircle size={28} />
      </button>

      {chatOpen && (
        <div className="absolute right-0 overflow-hidden transition-all duration-300 bg-white shadow-2xl bottom-20 w-80 rounded-2xl animate-fadeIn">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-500">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-white rounded-full">
                <MessageCircle size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-white">Live Support</h3>
                <p className="text-sm text-white text-opacity-80">
                  We typically reply in a few minutes
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end h-64 p-4 bg-gray-50">
            <div className="p-3 mb-3 bg-purple-100 rounded-lg rounded-bl-none max-w-3/4">
              <p className="text-sm text-purple-900">
                Hi there! 👋 How can we help you today?
              </p>
              <p className="mt-1 text-xs text-gray-500">2:34 PM</p>
            </div>
            <div className="mt-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full py-2 pl-4 pr-12 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="absolute flex items-center justify-center w-8 h-8 text-white transform -translate-y-1/2 bg-purple-500 rounded-full right-2 top-1/2">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveChatWidget;
