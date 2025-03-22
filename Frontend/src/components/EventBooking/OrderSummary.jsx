import React from "react";
import { motion } from "framer-motion";

const OrderSummary = ({ tickets, ticketPrices, totalPrice }) => {
  return (
    <div className="p-6 mb-8 bg-gray-50 rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Order Summary</h2>

      <div className="mb-4 space-y-3">
        {tickets.vip > 0 && (
          <div className="flex justify-between">
            <span>VIP Pass x {tickets.vip}</span>
            <span className="font-medium">
              ${(tickets.vip * ticketPrices.vip).toFixed(2)}
            </span>
          </div>
        )}
        {tickets.standard > 0 && (
          <div className="flex justify-between">
            <span>Standard Pass x {tickets.standard}</span>
            <span className="font-medium">
              ${(tickets.standard * ticketPrices.standard).toFixed(2)}
            </span>
          </div>
        )}
        {tickets.economy > 0 && (
          <div className="flex justify-between">
            <span>Economy Pass x {tickets.economy}</span>
            <span className="font-medium">
              ${(tickets.economy * ticketPrices.economy).toFixed(2)}
            </span>
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
