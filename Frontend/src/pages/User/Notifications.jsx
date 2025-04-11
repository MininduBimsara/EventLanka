import React, { useState } from "react";
import {
  FaBell,
  FaCalendarCheck,
  FaTicketAlt,
  FaMoneyBillWave,
  FaBullhorn,
  FaTimes,
} from "react-icons/fa";

const Notifications = () => {
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
    <div className="container px-4 pt-24 pb-16 mx-auto">
      <div className="flex flex-wrap items-center justify-between pb-8 mb-8 border-b border-gray-700">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500">
            Stay updated with event information and reminders
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 mt-4 text-sm font-medium text-blue-400 bg-transparent border border-blue-400 rounded-md sm:mt-0 hover:bg-blue-400 hover:bg-opacity-10 focus:outline-none"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center bg-gray-800 rounded-lg shadow">
          <FaBell className="mx-auto mb-4 text-gray-500" size={48} />
          <h3 className="mb-2 text-xl font-medium">No Notifications</h3>
          <p className="text-gray-500">
            You don't have any notifications at the moment. We'll notify you
            about upcoming events and important updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-5 bg-gray-800 rounded-lg shadow flex ${
                !notification.read ? "border-l-4 border-blue-500" : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex-shrink-0 w-10 mr-4">{notification.icon}</div>

              <div className="flex-grow">
                <div className="flex justify-between">
                  <h3
                    className={`text-lg font-medium ${
                      !notification.read ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {notification.date}
                  </span>
                </div>

                <p
                  className={`mt-1 ${
                    !notification.read ? "text-gray-300" : "text-gray-500"
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
                className="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
