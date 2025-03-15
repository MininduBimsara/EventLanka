import React, { useState, useEffect } from "react";

const EventBookingUI = () => {
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-3xl overflow-hidden bg-white shadow-lg rounded-xl">
        {/* Event Image & Title */}
        <div className="relative">
          <img
            src={eventDetails.image}
            alt={eventDetails.title}
            className="object-cover w-full h-64"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <h1 className="text-3xl font-bold text-white">
              {eventDetails.title}
            </h1>
          </div>
        </div>

        <div className="p-6">
          {/* Date, Time & Location */}
          <div className="flex flex-col gap-6 mb-6 text-gray-700 md:flex-row">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
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
              <span>{eventDetails.date}</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
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
              <span>{eventDetails.time}</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
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
              <span>{eventDetails.location}</span>
            </div>
          </div>

          {/* Event Description */}
          <div className="mb-6">
            <p className="text-gray-600">{eventDetails.description}</p>
          </div>

          {/* Organizer Info */}
          <div className="p-4 mb-6 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  Organized by: {eventDetails.organizer}
                </h3>
                <p className="text-sm text-gray-500">
                  Contact: info@melodyevents.com
                </p>
              </div>
              <div className="flex space-x-3">
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Select Tickets</h2>

            <div className="space-y-4">
              {/* VIP Tickets */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">VIP Ticket</h3>
                  <p className="text-sm text-gray-500">
                    Premium seating, exclusive lounge access
                  </p>
                  <p className="font-semibold text-blue-600">
                    ${ticketPrices.vip.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleTicketChange("vip", "decrease")}
                    className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <span className="w-6 text-center">{tickets.vip}</span>
                  <button
                    onClick={() => handleTicketChange("vip", "increase")}
                    className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Standard Tickets */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Standard Ticket</h3>
                  <p className="text-sm text-gray-500">
                    Regular seating, main area access
                  </p>
                  <p className="font-semibold text-blue-600">
                    ${ticketPrices.standard.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleTicketChange("standard", "decrease")}
                    className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <span className="w-6 text-center">{tickets.standard}</span>
                  <button
                    onClick={() => handleTicketChange("standard", "increase")}
                    className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Economy Tickets */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Economy Ticket</h3>
                  <p className="text-sm text-gray-500">
                    General admission, standing area
                  </p>
                  <p className="font-semibold text-blue-600">
                    ${ticketPrices.economy.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleTicketChange("economy", "decrease")}
                    className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>
                  <span className="w-6 text-center">{tickets.economy}</span>
                  <button
                    onClick={() => handleTicketChange("economy", "increase")}
                    className="flex items-center justify-center w-8 h-8 text-white bg-blue-600 rounded-full hover:bg-blue-700"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Total & Checkout */}
          <div className="p-4 mb-6 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                totalPrice > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={totalPrice === 0}
            >
              Proceed to Checkout
            </button>
          </div>

          {/* Policy & FAQ */}
          <div className="space-y-2 text-sm text-gray-500">
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700">
                Refund Policy
              </summary>
              <p className="pl-4 mt-1">
                Full refunds available up to 7 days before the event. 50% refund
                up to 48 hours before the event. No refunds after that.
              </p>
            </details>
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700">
                Event Guidelines
              </summary>
              <ul className="pl-8 mt-1 list-disc">
                <li>No outside food or beverages</li>
                <li>No professional cameras without press pass</li>
                <li>Children under 12 must be accompanied by an adult</li>
              </ul>
            </details>
            <details className="cursor-pointer">
              <summary className="font-medium text-gray-700">FAQs</summary>
              <div className="pl-4 mt-1">
                <p>
                  <strong>Q: Is parking available?</strong>
                  <br />
                  A: Yes, there is paid parking available at the venue.
                </p>
                <p>
                  <strong>Q: What time do doors open?</strong>
                  <br />
                  A: Doors open 1 hour before the event starts.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBookingUI;
