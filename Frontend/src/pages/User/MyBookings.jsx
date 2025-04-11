import React, { useState } from "react";
import {
  FaDownload,
  FaTimes,
  FaTicketAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const MyBookings = () => {
  // Mock data - replace with your API call
  const [bookings, setBookings] = useState([
    {
      id: "BOK-1234",
      eventName: "Jazz Festival 2025",
      date: "April 20, 2025",
      time: "7:00 PM",
      location: "Colombo Music Hall",
      ticketType: "VIP Pass",
      ticketCount: 2,
      amount: 5000,
      status: "Upcoming",
      imageUrl: "/api/placeholder/150/100",
    },
    {
      id: "BOK-1235",
      eventName: "Tech Conference",
      date: "May 15, 2025",
      time: "9:00 AM",
      location: "BMICH, Colombo",
      ticketType: "Regular",
      ticketCount: 1,
      amount: 2500,
      status: "Upcoming",
      imageUrl: "/api/placeholder/150/100",
    },
    {
      id: "BOK-1236",
      eventName: "Food Festival",
      date: "March 10, 2025",
      time: "11:00 AM",
      location: "Viharamahadevi Park",
      ticketType: "Family Pass",
      ticketCount: 4,
      amount: 3500,
      status: "Completed",
      imageUrl: "/api/placeholder/150/100",
    },
  ]);

  // Filter state
  const [filter, setFilter] = useState("all");

  // Cancel booking
  const handleCancelBooking = (id) => {
    // Show confirmation modal in a real application
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      // Update state locally - in a real app, this would be an API call
      setBookings(
        bookings.map((booking) =>
          booking.id === id ? { ...booking, status: "Cancelled" } : booking
        )
      );
    }
  };

  // Download ticket/QR code
  const handleDownloadTicket = (id) => {
    // In a real application, this would either:
    // 1. Generate and download a PDF ticket
    // 2. Open a modal with QR code to scan
    alert(`Downloading ticket for booking ${id}`);
  };

  // Filter bookings based on status
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="container px-4 pt-24 pb-16 mx-auto">
      <div className="pb-8 mb-8 border-b border-gray-700">
        <h1 className="mb-2 text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-400">
          Manage your upcoming and past event bookings
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex mb-6 space-x-4 border-b border-gray-700">
        <button
          onClick={() => setFilter("all")}
          className={`pb-2 px-2 ${
            filter === "all"
              ? "border-b-2 border-amber-500 text-amber-500"
              : "text-gray-400"
          }`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`pb-2 px-2 ${
            filter === "upcoming"
              ? "border-b-2 border-amber-500 text-amber-500"
              : "text-gray-400"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`pb-2 px-2 ${
            filter === "completed"
              ? "border-b-2 border-amber-500 text-amber-500"
              : "text-gray-400"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`pb-2 px-2 ${
            filter === "cancelled"
              ? "border-b-2 border-amber-500 text-amber-500"
              : "text-gray-400"
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings list */}
      {filteredBookings.length === 0 ? (
        <div className="p-8 text-center">
          <FaTicketAlt className="mx-auto mb-4 text-4xl text-gray-500" />
          <h3 className="mb-2 text-xl">No bookings found</h3>
          <p className="text-gray-400">
            {filter === "all"
              ? "You haven't made any bookings yet."
              : `You don't have any ${filter} bookings.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="overflow-hidden bg-gray-800 rounded-lg shadow-lg"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Event image */}
                <div className="lg:w-1/4">
                  <img
                    src={booking.imageUrl}
                    alt={booking.eventName}
                    className="object-cover w-full h-40 lg:h-full"
                  />
                </div>

                {/* Booking details */}
                <div className="flex flex-col justify-between flex-1 p-4 lg:p-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{booking.eventName}</h3>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          booking.status === "Upcoming"
                            ? "bg-green-900 text-green-300"
                            : booking.status === "Completed"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mb-4 text-sm text-gray-400">
                      Booking ID: {booking.id}
                    </div>

                    <div className="grid gap-y-2 gap-x-6 md:grid-cols-2">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-amber-500" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-amber-500" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-amber-500" />
                        <span>{booking.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FaTicketAlt className="mr-2 text-amber-500" />
                        <span>
                          {booking.ticketCount} × {booking.ticketType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700">
                    <div className="text-xl font-bold text-amber-500">
                      LKR {booking.amount.toLocaleString()}
                    </div>
                    <div className="flex space-x-2">
                      {booking.status === "Upcoming" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center px-3 py-1 text-sm text-white transition bg-red-600 rounded-md hover:bg-red-700"
                        >
                          <FaTimes className="mr-1" /> Cancel
                        </button>
                      )}
                      {booking.status !== "Cancelled" && (
                        <button
                          onClick={() => handleDownloadTicket(booking.id)}
                          className="flex items-center px-3 py-1 text-sm text-white transition rounded-md bg-amber-500 hover:bg-amber-600"
                        >
                          <FaDownload className="mr-1" /> Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
