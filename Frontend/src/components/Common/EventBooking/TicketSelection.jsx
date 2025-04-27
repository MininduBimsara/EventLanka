// TicketSelection.jsx
import React from "react";
import { motion } from "framer-motion";

const TicketSelection = ({ tickets, ticketTypes, handleTicketChange }) => {
  // Colors for different ticket types (we'll rotate through these)
  const colorSchemes = [
    {
      border: "border-purple-200",
      hover: "hover:bg-purple-50",
      text: "text-purple-800",
      price: "text-purple-600",
      buttonBg: "bg-purple-100",
      buttonHover: "hover:bg-purple-200",
      buttonText: "text-purple-800",
      activeBg: "bg-purple-600",
      activeHover: "hover:bg-purple-700",
    },
    {
      border: "border-pink-200",
      hover: "hover:bg-pink-50",
      text: "text-pink-700",
      price: "text-pink-600",
      buttonBg: "bg-pink-100",
      buttonHover: "hover:bg-pink-200",
      buttonText: "text-pink-700",
      activeBg: "bg-pink-600",
      activeHover: "hover:bg-pink-700",
    },
    {
      border: "border-orange-200",
      hover: "hover:bg-orange-50",
      text: "text-orange-700",
      price: "text-orange-600",
      buttonBg: "bg-orange-100",
      buttonHover: "hover:bg-orange-200",
      buttonText: "text-orange-700",
      activeBg: "bg-orange-600",
      activeHover: "hover:bg-orange-700",
    },
  ];

  // Default description for each ticket type if none is provided
  const getTicketDescription = (type) => {
    const descriptions = {
      VIP: "Premium viewing areas, exclusive lounge access, complimentary food & drinks",
      Standard: "General admission, access to main stages and food court",
      Economy: "Single day access, general admission areas only",
    };

    // Return the description if it exists, otherwise return a generic one
    return descriptions[type] || `${type} ticket includes event admission`;
  };

  return (
    <div className="mb-8">
      <h2 className="mb-5 text-2xl font-bold text-purple-800">
        Select Tickets
      </h2>
      <div className="space-y-4">
        {ticketTypes &&
          ticketTypes.map((ticket, index) => {
            // Get color scheme for this ticket (rotate through available schemes)
            const colors = colorSchemes[index % colorSchemes.length];

            return (
              <motion.div
                key={ticket.type}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center justify-between p-4 transition-colors border-2 ${colors.border} rounded-xl ${colors.hover}`}
              >
                <div>
                  <h3 className={`font-bold ${colors.text}`}>
                    {ticket.type} Pass
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getTicketDescription(ticket.type)}
                  </p>
                  <p className="flex items-center mt-1 text-lg font-bold">
                    <span className={colors.price}>
                      ${ticket.price.toFixed(2)}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ({ticket.availability} available)
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleTicketChange(ticket.type, "decrease")}
                    className={`flex items-center justify-center w-8 h-8 ${colors.buttonText} ${colors.buttonBg} rounded-full ${colors.buttonHover}`}
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
                    {tickets[ticket.type] || 0}
                  </span>
                  <button
                    onClick={() => handleTicketChange(ticket.type, "increase")}
                    disabled={tickets[ticket.type] >= ticket.availability}
                    className={`flex items-center justify-center w-8 h-8 text-white ${
                      colors.activeBg
                    } rounded-full ${colors.activeHover} ${
                      tickets[ticket.type] >= ticket.availability
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
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
            );
          })}

        {(!ticketTypes || ticketTypes.length === 0) && (
          <div className="p-6 text-center text-gray-500 border-2 border-gray-200 rounded-xl">
            No ticket types available for this event.
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketSelection;
