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
    // {
    //   name: "Help Center",
    //   path: "/user/helpcenter",
    //   icon: <MessageSquare size={20} />,
    // },
    { name: "My Bookings", path: "/user/mybookings", icon: <Book size={20} /> },
    // {
    //   name: "My Reviews",
    //   path: "/user/myreviews",
    //   icon: <MessageSquare size={20} />,
    // },
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

  // Custom colors
  const colors = {
    primary: "#1F40AF", // Deep blue
    accent: "#F472B6", // Pink
    white: "#FFFFFF", // White
  };

  // Dark mode colors
  if (darkMode) {
    colors.primary = "#1F2937"; // Dark gray
    colors.accent = "#FBBF24"; // Yellow
    colors.white = "#FFFFFF"; // White
  }

  // Active item styles
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="shadow-lg" style={{ backgroundColor: colors.primary }}>
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-2 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                  isActive(item.path)
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
                style={{
                  backgroundColor: isActive(item.path)
                    ? colors.accent
                    : "transparent",
                  boxShadow: isActive(item.path)
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "none",
                  transform: isActive(item.path) ? "translateY(-2px)" : "none",
                }}
              >
                <span
                  className="mr-2"
                  style={{
                    color: isActive(item.path) ? colors.white : colors.accent,
                  }}
                >
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none hover:bg-opacity-80"
              style={{ backgroundColor: colors.accent }}
            >
              <Menu size={24} color={colors.white} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: colors.primary,
            borderTop: `1px solid ${colors.accent}20`,
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-3 py-3 text-sm font-medium text-left transition-all duration-200 rounded-md"
                style={{
                  backgroundColor: isActive(item.path)
                    ? colors.accent
                    : "transparent",
                  color: isActive(item.path) ? colors.white : colors.white,
                  boxShadow: isActive(item.path)
                    ? "0 2px 4px rgba(0,0,0,0.1)"
                    : "none",
                }}
              >
                <span
                  className="mr-3"
                  style={{
                    color: isActive(item.path) ? colors.white : colors.accent,
                  }}
                >
                  {item.icon}
                </span>
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
