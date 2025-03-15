// TicketSelection.jsx
import React from "react";
import { motion } from "framer-motion";

const TicketSelection = ({ tickets, ticketPrices, handleTicketChange }) => {
  return (
    <div className="mb-8">
      <h2 className="mb-5 text-2xl font-bold text-purple-800">
        Select Tickets
      </h2>
      <div className="space-y-4">
        {/* VIP Ticket */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-4 transition-colors border-2 border-purple-200 rounded-xl hover:bg-purple-50"
        >
          <div>
            <h3 className="font-bold text-purple-800">VIP Pass</h3>
            <p className="text-sm text-gray-600">
              Premium viewing areas, exclusive lounge access, complimentary food
              & drinks
            </p>
            <p className="mt-1 text-lg font-bold text-purple-600">
              ${ticketPrices.vip}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleTicketChange("vip", "decrease")}
              className="flex items-center justify-center w-8 h-8 text-purple-800 bg-purple-100 rounded-full hover:bg-purple-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="w-5 text-lg font-bold text-center">
              {tickets.vip}
            </span>
            <button
              onClick={() => handleTicketChange("vip", "increase")}
              className="flex items-center justify-center w-8 h-8 text-white bg-purple-600 rounded-full hover:bg-purple-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Standard Ticket */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-4 transition-colors border-2 border-pink-200 rounded-xl hover:bg-pink-50"
        >
          <div>
            <h3 className="font-bold text-pink-700">Standard Pass</h3>
            <p className="text-sm text-gray-600">
              General admission, access to main stages and food court
            </p>
            <p className="mt-1 text-lg font-bold text-pink-600">
              ${ticketPrices.standard}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleTicketChange("standard", "decrease")}
              className="flex items-center justify-center w-8 h-8 text-pink-700 bg-pink-100 rounded-full hover:bg-pink-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="w-5 text-lg font-bold text-center">
              {tickets.standard}
            </span>
            <button
              onClick={() => handleTicketChange("standard", "increase")}
              className="flex items-center justify-center w-8 h-8 text-white bg-pink-600 rounded-full hover:bg-pink-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Economy Ticket */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-between p-4 transition-colors border-2 border-orange-200 rounded-xl hover:bg-orange-50"
        >
          <div>
            <h3 className="font-bold text-orange-700">Economy Pass</h3>
            <p className="text-sm text-gray-600">
              Single day access, general admission areas only
            </p>
            <p className="mt-1 text-lg font-bold text-orange-600">
              ${ticketPrices.economy}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleTicketChange("economy", "decrease")}
              className="flex items-center justify-center w-8 h-8 text-orange-700 bg-orange-100 rounded-full hover:bg-orange-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="w-5 text-lg font-bold text-center">
              {tickets.economy}
            </span>
            <button
              onClick={() => handleTicketChange("economy", "increase")}
              className="flex items-center justify-center w-8 h-8 text-white bg-orange-600 rounded-full hover:bg-orange-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketSelection;
