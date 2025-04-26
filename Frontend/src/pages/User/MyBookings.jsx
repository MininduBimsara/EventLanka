// MyBookings.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../Context/ThemeContext";
import {
  fetchOrders,
  cancelOrder,
  generateTicketQRCode,
  downloadTicketPDF,
} from "../../Redux/Slicers/orderSlice"; // Import the new thunks
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
  FaQrcode, // Added QR code icon
} from "react-icons/fa";
import UserNavbar from "../../components/User/UserNavbar";
import Modal from "../../components/User/Modal"; // Assume you have a Modal component


const MyBookings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  // Get orders data from Redux store
  const { orders, loading, error, qrCode, qrCodeLoading } = useSelector(
    (state) => state.orders
  );

  // State for QR code modal
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch orders when component mounts
  useEffect(() => {
    dispatch(fetchOrders())
      .unwrap()
      .catch((error) => {
        console.error("Failed to fetch orders:", error);
      });
  }, [dispatch]);

  // Format the orders data
  const formatOrders = (orders) => {
    return orders.map((order) => {
      const firstTicket =
        order.tickets && order.tickets.length > 0 ? order.tickets[0] : null;
      const eventData =
        firstTicket && firstTicket.event_id ? firstTicket.event_id : null;

      return {
        id: order.order_number || order._id,
        orderId: order._id,
        tickets: order.tickets || [],
        eventName: eventData ? eventData.title : "Event",
        date: eventData ? new Date(eventData.date).toLocaleDateString() : "TBD",
        time: eventData
          ? new Date(eventData.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "TBD",
        location: eventData ? eventData.location : "TBD",
        ticketType: firstTicket ? firstTicket.ticket_type : "Regular",
        ticketCount: order.tickets ? order.tickets.length : 0,
        amount: order.total_amount,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        imageUrl:
          eventData && eventData.banner
            ? eventData.banner
            : "/api/placeholder/150/100",
      };
    });
  };

  // Filter state
  const [filter, setFilter] = useState("all");

  // Dropdown state for actions
  const [openActionMenu, setOpenActionMenu] = useState(null);

  // Cancel booking
  const handleCancelBooking = (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      const orderToCancel = orders.find(
        (order) => order.order_number === id || order._id === id
      );
      if (orderToCancel) {
        dispatch(cancelOrder(orderToCancel._id));
      }
      setOpenActionMenu(null);
    }
  };

  // Show QR code modal
  const handleShowQRCode = (ticket) => {
    setSelectedTicket(ticket);
    dispatch(generateTicketQRCode(ticket._id))
      .unwrap()
      .then(() => {
        setQrCodeModal(true);
      })
      .catch((error) => {
        console.error("Failed to generate QR code:", error);
        alert("Failed to generate QR code. Please try again.");
      });
    setOpenActionMenu(null);
  };

  // Download ticket
  const handleDownloadTicket = (ticketId) => {
    dispatch(downloadTicketPDF(ticketId));
    setOpenActionMenu(null);
  };

  // Get formatted orders
  const selectFormattedOrders = useSelector((state) => {
    if (!state.orders.orders || state.orders.orders.length === 0) {
      return [];
    }
    return formatOrders(state.orders.orders);
  });

  // Filter bookings based on status
  const filteredBookings = selectFormattedOrders.filter((booking) => {
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
    modalBg: darkMode ? "bg-gray-800" : "bg-white",
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
                                  {booking.status !== "Cancelled" &&
                                    booking.tickets &&
                                    booking.tickets.length > 0 && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleShowQRCode(booking.tickets[0])
                                          }
                                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                          <FaQrcode className="mr-3 text-blue-500" />
                                          Show QR Code
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDownloadTicket(
                                              booking.tickets[0]._id
                                            )
                                          }
                                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                          <FaDownload className="mr-3 text-blue-500" />
                                          Download Ticket
                                        </button>
                                      </>
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
                          {booking.status !== "Cancelled" &&
                            booking.tickets &&
                            booking.tickets.length > 0 && (
                              <>
                                <button
                                  onClick={() =>
                                    handleShowQRCode(booking.tickets[0])
                                  }
                                  className="flex items-center px-4 py-2 text-sm text-white transition bg-green-600 rounded-md hover:bg-green-700"
                                >
                                  <FaQrcode className="mr-1.5" /> QR Code
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadTicket(booking.tickets[0]._id)
                                  }
                                  className="flex items-center px-4 py-2 text-sm text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                  <FaDownload className="mr-1.5" /> Ticket
                                </button>
                              </>
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

      {/* QR Code Modal */}
      {qrCodeModal && (
        <Modal
          isOpen={qrCodeModal}
          onClose={() => setQrCodeModal(false)}
          title="Your Ticket QR Code"
          size="md"
        >
          <div className={`p-6 ${themeClasses.modalBg} rounded-lg`}>
            {qrCodeLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <h3 className="mb-2 text-xl font-bold">
                    Scan at the event entrance
                  </h3>
                  <p className={`${themeClasses.subText}`}>
                    Present this QR code to the event staff for check-in
                  </p>
                </div>

                {qrCode && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={qrCode}
                      alt="Ticket QR Code"
                      className="w-64 h-64 border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                )}

                {selectedTicket && (
                  <div
                    className={`p-4 rounded-lg ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <p className="mb-2">
                      <span className={themeClasses.subText}>Ticket Type:</span>{" "}
                      <span className="font-semibold">
                        {selectedTicket.ticket_type}
                      </span>
                    </p>
                    <p className="mb-2">
                      <span className={themeClasses.subText}>Quantity:</span>{" "}
                      <span className="font-semibold">
                        {selectedTicket.quantity}
                      </span>
                    </p>
                    <p>
                      <span className={themeClasses.subText}>Ticket ID:</span>{" "}
                      <span className="font-semibold">
                        {selectedTicket._id}
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    onClick={() => setQrCodeModal(false)}
                    className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    Close
                  </button>
                  {selectedTicket && (
                    <button
                      onClick={() => handleDownloadTicket(selectedTicket._id)}
                      className="flex items-center px-4 py-2 text-sm text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      <FaDownload className="mr-1.5" /> Download PDF
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default MyBookings;
