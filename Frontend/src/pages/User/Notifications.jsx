import React, { useState } from "react";
import {
  FaBell,
  FaCalendarCheck,
  FaTicketAlt,
  FaMoneyBillWave,
  FaBullhorn,
  FaTimes,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext"; // Import the useTheme hook
import UserNavbar from "../../components/User/UserNavbar"; // Import the UserNavbar component

const Notifications = () => {
  const { darkMode, toggleTheme } = useTheme(); // Use the theme context

  // Mock notifications data - in a real app, this would come from your API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "reminder",
      title: "Event Reminder",
      message:
        "Your event 'Music Festival 2025' is tomorrow! Don't forget your tickets.",
      date: "2 hours ago",
      read: false,
      icon: <FaCalendarCheck className="text-blue-500" />,
    },
    {
      id: 2,
      type: "ticket",
      title: "Ticket Confirmed",
      message:
        "Your ticket for 'Tech Conference' has been confirmed. Check your email for details.",
      date: "Yesterday",
      read: true,
      icon: <FaTicketAlt className="text-green-500" />,
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Success",
      message:
        "Your payment of $150 for 'Food Festival' has been processed successfully.",
      date: "3 days ago",
      read: true,
      icon: <FaMoneyBillWave className="text-purple-500" />,
    },
    {
      id: 4,
      type: "announcement",
      title: "New Events Available",
      message:
        "Check out new events in your area! 5 new events have been added.",
      date: "1 week ago",
      read: false,
      icon: <FaBullhorn className="text-yellow-500" />,
    },
  ]);

  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== notificationId)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <>
      <UserNavbar /> {/* Include the UserNavbar component */}
      <div className="container min-h-screen px-4 pt-24 pb-16 mx-auto transition-colors duration-200 bg-white dark:bg-gray-900">
        {/* Theme toggle button */}
        <div className="fixed z-10 p-2 text-xl bg-white rounded-full shadow-lg top-20 right-4 dark:bg-gray-800">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between pb-8 mb-8 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
              Notifications
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Stay updated with event information and reminders
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 mt-4 text-sm font-medium text-blue-400 bg-transparent border border-blue-400 rounded-md sm:mt-0 hover:bg-blue-400 hover:bg-opacity-10 focus:outline-none dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-900 dark:hover:bg-opacity-20"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center transition-colors duration-200 bg-white rounded-lg shadow dark:bg-gray-800">
            <FaBell
              className="mx-auto mb-4 text-gray-500 dark:text-gray-400"
              size={48}
            />
            <h3 className="mb-2 text-xl font-medium text-gray-800 dark:text-white">
              No Notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              You don't have any notifications at the moment. We'll notify you
              about upcoming events and important updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 bg-white rounded-lg shadow dark:bg-gray-800 flex transition-colors duration-200 ${
                  !notification.read ? "border-l-4 border-blue-500" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex-shrink-0 w-10 mr-4">
                  {notification.icon}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3
                      className={`text-lg font-medium ${
                        !notification.read
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.date}
                    </span>
                  </div>

                  <p
                    className={`mt-1 ${
                      !notification.read
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {notification.message}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                  className="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
