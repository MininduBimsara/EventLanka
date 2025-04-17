import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Home,
  User,
  Book,
  MessageSquare,
  DollarSign,
  Bell,
} from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    {
      name: "Edit Profile",
      path: "/user/editprofile",
      icon: <User size={20} />,
    },
    {
      name: "Help Center",
      path: "/user/helpcenter",
      icon: <MessageSquare size={20} />,
    },
    { name: "My Bookings", path: "/user/mybookings", icon: <Book size={20} /> },
    {
      name: "My Reviews",
      path: "/user/myreviews",
      icon: <MessageSquare size={20} />,
    },
    {
      name: "My Transactions",
      path: "/user/transactions",
      icon: <DollarSign size={20} />,
    },
    {
      name: "Notifications",
      path: "/user/notifications",
      icon: <Bell size={20} />,
    },
  ];

  // Theme-based classes
  const navClasses = {
    background: darkMode ? "bg-gray-800" : "bg-blue-800",
    hoverBg: darkMode ? "hover:bg-gray-700" : "hover:bg-blue-700",
    activeBg: darkMode ? "bg-gray-900" : "bg-blue-900",
  };

  return (
    <nav className={`text-white shadow-md ${navClasses.background}`}>
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">EventsBooking</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-3 py-2 text-sm font-medium transition rounded-md ${
                  navClasses.hoverBg
                } ${
                  location.pathname === item.path ? navClasses.activeBg : ""
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md ${navClasses.hoverBg} focus:outline-none`}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className={`md:hidden ${navClasses.background}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium transition rounded-md text-left ${
                  navClasses.hoverBg
                } ${
                  location.pathname === item.path ? navClasses.activeBg : ""
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
