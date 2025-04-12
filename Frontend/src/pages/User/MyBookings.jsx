import React, { useState } from "react";
import {
  FaDownload,
  FaTimes,
  FaTicketAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEllipsisV,
  FaCheck,
} from "react-icons/fa";

const MyBookings = ({ darkMode = false }) => {
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

  // Dropdown state for actions
  const [openActionMenu, setOpenActionMenu] = useState(null);

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
      setOpenActionMenu(null);
    }
  };

  // Download ticket/QR code
  const handleDownloadTicket = (id) => {
    // In a real application, this would either:
    // 1. Generate and download a PDF ticket
    // 2. Open a modal with QR code to scan
    alert(`Downloading ticket for booking ${id}`);
    setOpenActionMenu(null);
  };

  // Filter bookings based on status
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status.toLowerCase() === filter.toLowerCase();
  });

  // Toggle action menu
  const toggleActionMenu = (id) => {
    if (openActionMenu === id) {
      setOpenActionMenu(null);
    } else {
      setOpenActionMenu(id);
    }
  };

  // Theme-based classes
  const themeClasses = {
    background: darkMode ? "bg-gray-900" : "bg-white",
    text: darkMode ? "text-white" : "text-gray-800",
    subText: darkMode ? "text-gray-400" : "text-gray-600",
    card: darkMode ? "bg-gray-800" : "bg-white",
    cardBorder: darkMode ? "border-gray-700" : "border border-gray-200",
    activeTabBorder: darkMode ? "border-amber-500" : "border-blue-600",
    activeTabText: darkMode ? "text-amber-500" : "text-blue-600",
    inactiveTabText: darkMode ? "text-gray-400" : "text-gray-500",
    actionMenu: darkMode
      ? "bg-gray-700"
      : "bg-white border border-gray-200 shadow-lg",
    divider: darkMode ? "border-gray-700" : "border-gray-200",
    statusUpcoming: darkMode
      ? "bg-green-900 text-green-300"
      : "bg-green-100 text-green-800",
    statusCompleted: darkMode
      ? "bg-blue-900 text-blue-300"
      : "bg-blue-100 text-blue-800",
    statusCancelled: darkMode
      ? "bg-red-900 text-red-300"
      : "bg-red-100 text-red-800",
  };

  return (
    <div
      className={`container px-4 pt-20 pb-16 mx-auto ${themeClasses.background} ${themeClasses.text} min-h-screen`}
    >
      <div className={`pb-8 mb-8 border-b ${themeClasses.divider}`}>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
          My Bookings
        </h1>
        <p className={themeClasses.subText}>
          Manage your upcoming and past event bookings
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex pb-1 mb-8 space-x-1 overflow-x-auto md:space-x-4">
        <button
          onClick={() => setFilter("all")}
          className={`pb-2 px-4 font-medium transition ${
            filter === "all"
              ? `border-b-2 ${themeClasses.activeTabBorder} ${themeClasses.activeTabText}`
              : themeClasses.inactiveTabText
          }`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`pb-2 px-4 font-medium transition ${
            filter === "upcoming"
              ? `border-b-2 ${themeClasses.activeTabBorder} ${themeClasses.activeTabText}`
              : themeClasses.inactiveTabText
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`pb-2 px-4 font-medium transition ${
            filter === "completed"
              ? `border-b-2 ${themeClasses.activeTabBorder} ${themeClasses.activeTabText}`
              : themeClasses.inactiveTabText
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`pb-2 px-4 font-medium transition ${
            filter === "cancelled"
              ? `border-b-2 ${themeClasses.activeTabBorder} ${themeClasses.activeTabText}`
              : themeClasses.inactiveTabText
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Bookings list */}
      {filteredBookings.length === 0 ? (
        <div
          className={`p-16 text-center ${themeClasses.card} rounded-xl ${themeClasses.cardBorder}`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full">
            <FaTicketAlt className="text-gray-500" size={32} />
          </div>
          <h3 className="mb-2 text-xl font-bold">No bookings found</h3>
          <p className={themeClasses.subText}>
            {filter === "all"
              ? "You haven't made any bookings yet."
              : `You don't have any ${filter} bookings.`}
          </p>
          <button className="px-5 py-2 mt-6 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className={`overflow-hidden rounded-xl shadow-sm transition ${themeClasses.card} ${themeClasses.cardBorder}`}
            >
              <div className="flex flex-col lg:flex-row">
                {/* Event image */}
                <div className="relative lg:w-1/4">
                  <img
                    src={booking.imageUrl}
                    alt={booking.eventName}
                    className="object-cover w-full h-48 lg:h-full"
                  />
                  <div className="absolute top-0 left-0 p-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        booking.status === "Upcoming"
                          ? themeClasses.statusUpcoming
                          : booking.status === "Completed"
                          ? themeClasses.statusCompleted
                          : themeClasses.statusCancelled
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking details */}
                <div className="flex flex-col justify-between flex-1 p-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{booking.eventName}</h3>
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(booking.id)}
                          className="p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FaEllipsisV className={themeClasses.subText} />
                        </button>

                        {openActionMenu === booking.id && (
                          <div
                            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 ${themeClasses.actionMenu}`}
                          >
                            <div className="py-1">
                              {booking.status !== "Cancelled" && (
                                <button
                                  onClick={() =>
                                    handleDownloadTicket(booking.id)
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                  <FaDownload className="mr-3 text-blue-500" />
                                  Download Ticket
                                </button>
                              )}
                              {booking.status === "Upcoming" && (
                                <button
                                  onClick={() =>
                                    handleCancelBooking(booking.id)
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                  <FaTimes className="mr-3" />
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 mb-4 text-sm inline-block rounded ${themeClasses.subText} bg-gray-100 dark:bg-gray-700`}
                    >
                      {booking.id}
                    </div>

                    <div className="grid gap-y-3 gap-x-8 md:grid-cols-2">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-3 text-blue-500" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-3 text-blue-500" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-3 text-blue-500" />
                        <span>{booking.location}</span>
                      </div>
                      <div className="flex items-center">
                        <FaTicketAlt className="mr-3 text-blue-500" />
                        <span>
                          {booking.ticketCount} × {booking.ticketType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between pt-4 mt-4 border-t ${themeClasses.divider}`}
                  >
                    <div className="text-xl font-bold text-blue-600">
                      LKR {booking.amount.toLocaleString()}
                    </div>
                    <div className="flex space-x-3">
                      {booking.status === "Upcoming" && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center px-4 py-2 text-sm text-white transition bg-red-600 rounded-md hover:bg-red-700"
                        >
                          <FaTimes className="mr-1.5" /> Cancel
                        </button>
                      )}
                      {booking.status !== "Cancelled" && (
                        <button
                          onClick={() => handleDownloadTicket(booking.id)}
                          className="flex items-center px-4 py-2 text-sm text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          <FaDownload className="mr-1.5" /> Ticket
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
