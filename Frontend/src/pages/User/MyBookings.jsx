// MyBookings.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../Context/ThemeContext";
import { fetchOrders, cancelOrder } from "../../Redux/Slicers/orderSlice"; // Import the relevant thunks
import {
  FaDownload,
  FaTimes,
  FaTicketAlt,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEllipsisV,
  FaCheck,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import UserNavbar from "../../components/User/UserNavbar";

const MyBookings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  // Get orders data from Redux store
  const { orders, loading, error } = useSelector((state) => state.orders);

  // Fetch orders when component mounts
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Format the orders data to match our component structure
  const formatOrders = (orders) => {
    return orders.map((order) => ({
      id: order.order_number || order._id,
      eventName:
        order.tickets && order.tickets.length > 0
          ? order.tickets[0].event_name
          : "Event",
      date:
        order.tickets && order.tickets.length > 0
          ? new Date(order.tickets[0].event_date).toLocaleDateString()
          : "TBD",
      time:
        order.tickets && order.tickets.length > 0
          ? new Date(order.tickets[0].event_date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "TBD",
      location:
        order.tickets && order.tickets.length > 0
          ? order.tickets[0].venue
          : "TBD",
      ticketType:
        order.tickets && order.tickets.length > 0
          ? order.tickets[0].ticket_type
          : "Regular",
      ticketCount: order.tickets ? order.tickets.length : 0,
      amount: order.total_amount,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize first letter
      imageUrl: "/api/placeholder/150/100", // Placeholder image
    }));
  };

  // Filter state
  const [filter, setFilter] = useState("all");

  // Dropdown state for actions
  const [openActionMenu, setOpenActionMenu] = useState(null);

  // Cancel booking
  const handleCancelBooking = (id) => {
    // Show confirmation modal in a real application
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      // Find the real order id from the order number
      const orderToCancel = orders.find(
        (order) => order.order_number === id || order._id === id
      );
      if (orderToCancel) {
        dispatch(cancelOrder(orderToCancel._id));
      }
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
  const formattedOrders = orders ? formatOrders(orders) : [];
  const filteredBookings = formattedOrders.filter((booking) => {
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
    <>
      <UserNavbar />

      {/* Main content area */}
      <div
        className={`container px-4 pt-20 pb-16 mx-auto ${themeClasses.background} ${themeClasses.text} min-h-screen`}
      >
        <div className="fixed z-10 p-2 text-xl bg-white rounded-full shadow-lg top-20 right-4 dark:bg-gray-800">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

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
            onClick={() => setFilter("pending")}
            className={`pb-2 px-4 font-medium transition ${
              filter === "pending"
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

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className={`p-4 mb-6 text-white bg-red-500 rounded-lg`}>
            <p>Error: {error}</p>
          </div>
        )}

        {/* Bookings list */}
        {!loading && !error && filteredBookings.length === 0 ? (
          <div
            className={`p-16 text-center ${themeClasses.card} rounded-xl ${themeClasses.cardBorder}`}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full dark:bg-gray-700">
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
          !loading &&
          !error && (
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
                            booking.status === "Pending"
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
                          <h3 className="text-xl font-bold">
                            {booking.eventName}
                          </h3>
                          <div className="relative">
                            <button
                              onClick={() => toggleActionMenu(booking.id)}
                              className="p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              aria-label="More actions"
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
                                  {booking.status === "Pending" && (
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
                          className={`px-3 py-1 mb-4 text-sm inline-block rounded ${
                            darkMode ? "bg-gray-700" : "bg-gray-100"
                          } ${themeClasses.subText}`}
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
                          {booking.status === "Pending" && (
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
          )
        )}
      </div>
    </>
  );
};

export default MyBookings;
