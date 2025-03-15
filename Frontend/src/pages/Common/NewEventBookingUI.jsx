import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NewEventBookingUI = () => {
  const [tickets, setTickets] = useState({
    vip: 0,
    standard: 0,
    economy: 0,
  });

  const [totalPrice, setTotalPrice] = useState(0);

  const ticketPrices = {
    vip: 199.99,
    standard: 99.99,
    economy: 49.99,
  };

  const eventDetails = {
    title: "Summer Music Festival 2025",
    image: "/api/placeholder/800/400",
    date: "April 18-20, 2025",
    time: "12:00 PM - 11:00 PM",
    location: "Riverside Park, Downtown",
    organizer: "Melody Events Co.",
    description:
      "Join us for three days of amazing live performances featuring top artists from around the world. Food, drinks, and unforgettable memories guaranteed!",
  };

  useEffect(() => {
    calculateTotal();
  }, [tickets]);

  const calculateTotal = () => {
    const total =
      tickets.vip * ticketPrices.vip +
      tickets.standard * ticketPrices.standard +
      tickets.economy * ticketPrices.economy;
    setTotalPrice(total);
  };

  const handleTicketChange = (type, action) => {
    setTickets((prev) => {
      const newValue =
        action === "increase" ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      return { ...prev, [type]: newValue };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400">
      <div className="container px-4 py-8 mx-auto">
        <div className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-xl rounded-2xl">
          {/* Event Image & Title */}
          <div className="relative">
            <img
              src={eventDetails.image}
              alt={eventDetails.title}
              className="object-cover w-full h-96"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-70"></div>
            <div className="absolute top-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1 text-sm font-bold text-purple-900 bg-yellow-400 rounded-full">
                  HOT EVENT
                </span>
                <span className="px-4 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
                  SELLING FAST
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold text-white drop-shadow-lg"
              >
                {eventDetails.title}
              </motion.h1>
              <div className="flex items-center mt-2">
                <div className="flex items-center px-3 py-1 text-sm font-bold text-purple-900 bg-yellow-400 rounded-full">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>Top Rated</span>
                </div>
                <div className="ml-2 text-sm text-white">
                  <span className="opacity-80">Limited tickets available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colorful Divider */}
          <div className="flex">
            <div className="w-1/5 h-2 bg-red-500"></div>
            <div className="w-1/5 h-2 bg-yellow-400"></div>
            <div className="w-1/5 h-2 bg-green-500"></div>
            <div className="w-1/5 h-2 bg-blue-500"></div>
            <div className="w-1/5 h-2 bg-purple-500"></div>
          </div>

          <div className="p-6 md:p-8">
            {/* Date, Time & Location */}
            <div className="flex flex-col flex-wrap gap-4 mb-6 text-gray-700 md:flex-row">
              <div className="flex items-center px-4 py-2 bg-purple-100 rounded-full">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="font-medium">{eventDetails.date}</span>
              </div>

              <div className="flex items-center px-4 py-2 bg-pink-100 rounded-full">
                <svg
                  className="w-5 h-5 mr-2 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="font-medium">{eventDetails.time}</span>
              </div>

              <div className="flex items-center px-4 py-2 bg-orange-100 rounded-full">
                <svg
                  className="w-5 h-5 mr-2 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span className="font-medium">{eventDetails.location}</span>
              </div>
            </div>

            {/* Event Description */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute top-0 w-1 h-full -left-4 bg-gradient-to-b from-purple-600 to-pink-500"></div>
                <h2 className="mb-2 text-2xl font-bold text-purple-800">
                  About This Event
                </h2>
                <p className="leading-relaxed text-gray-700">
                  {eventDetails.description}
                </p>
              </div>
            </div>

            {/* Highlights */}
            <div className="p-4 mb-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <h3 className="mb-3 font-bold text-purple-800">
                Event Highlights
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full">
                    <svg
                      className="w-6 h-6 text-purple-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                    </svg>
                  </div>
                  <span className="ml-3 font-medium">
                    30+ Live Performances
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-400 rounded-full">
                    <svg
                      className="w-6 h-6 text-purple-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                  </div>
                  <span className="ml-3 font-medium">Food & Drink Vendors</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-pink-400 rounded-full">
                    <svg
                      className="w-6 h-6 text-purple-900"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <span className="ml-3 font-medium">
                    Interactive Experiences
                  </span>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="p-4 mb-8 border-2 border-purple-100 rounded-xl bg-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-purple-800">
                    Organized by: {eventDetails.organizer}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Contact: info@melodyevents.com
                  </p>
                </div>
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="text-purple-600 transition-colors hover:text-purple-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-purple-600 transition-colors hover:text-purple-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-purple-600 transition-colors hover:text-purple-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.059 1.805.249 2.227.419.562.219.96.48 1.38.9.42.42.681.819.9 1.38.17.422.36 1.057.419 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.059 1.17-.249 1.805-.419 2.227-.219.562-.48.96-.9 1.38-.42.42-.819.681-1.38.9-.422.17-1.057.36-2.227.419-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.059-1.805-.249-2.227-.419-.562-.219-.96-.48-1.38-.9-.42-.42-.681-.819-.9-1.38-.17-.422-.36-1.057-.419-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.059-1.17.249-1.805.419-2.227.219-.562.48-.96.9-1.38.42-.42.819-.681 1.38-.9.422-.17 1.057-.36 2.227-.419 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.058-2.148.261-2.913.558-.788.306-1.459.718-2.126 1.384-.666.667-1.079 1.338-1.384 2.126-.297.765-.5 1.636-.558 2.913-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.058 1.277.261 2.148.558 2.913.306.788.718 1.459 1.384 2.126.667.666 1.338 1.079 2.126 1.384.765.297 1.636.5 2.913.558 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.277-.058 2.148-.261 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.338 1.384-2.126.297-.765.5-1.636.558-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.277-.261-2.148-.558-2.913-.306-.788-.718-1.459-1.384-2.126-.667-.666-1.338-1.079-2.126-1.384-.765-.297-1.636-.5-2.913-.558-1.28-.058-1.688-.072-4.947-.072z"></path>
                      <circle cx="12" cy="12" r="3.5"></circle>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-purple-600 transition-colors hover:text-purple-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
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
                      Premium viewing areas, exclusive lounge access,
                      complimentary food & drinks
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

             
            <div className="p-6 mb-8 bg-gray-50 rounded-xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Order Summary
              </h2>

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
                  <span className="text-purple-700">
                    ${totalPrice.toFixed(2)}
                  </span>
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

            <p className="mt-4 text-sm text-center text-gray-600">
              Secure payment processing. No additional fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEventBookingUI;