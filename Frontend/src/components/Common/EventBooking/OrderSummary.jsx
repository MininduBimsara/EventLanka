import React from "react";
import { motion } from "framer-motion";

const OrderSummary = ({ tickets, ticketTypes, totalPrice }) => {
  // Get selected tickets (filter those with quantity > 0)
  const selectedTickets = ticketTypes
    ? ticketTypes.filter(
        (ticket) => tickets[ticket.type] && tickets[ticket.type] > 0
      )
    : [];

  // Check if any tickets are selected
  const hasTickets = selectedTickets.length > 0;

  return (
    <div className="p-6 mb-8 select-none bg-gray-50 rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Order Summary</h2>

      <div className="mb-4 space-y-3">
        {selectedTickets.map((ticket) => (
          <div key={ticket.type} className="flex justify-between">
            <span>
              {ticket.type} Pass x {tickets[ticket.type]}
            </span>
            <span className="font-medium">
              ${(tickets[ticket.type] * ticket.price).toFixed(2)}
            </span>
          </div>
        ))}

        {!hasTickets && (
          <div className="py-2 text-center text-gray-500">
            No tickets selected
          </div>
        )}
      </div>

      <div className="pt-3 mb-4 border-t border-gray-300">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-purple-700">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        disabled={totalPrice === 0}
        className={`w-full py-3 rounded-lg text-white font-bold text-lg ${
          totalPrice > 0
            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {totalPrice > 0 ? "Book Now" : "Select Tickets"}
      </motion.button>
    </div>
  );
};

export default OrderSummary;
