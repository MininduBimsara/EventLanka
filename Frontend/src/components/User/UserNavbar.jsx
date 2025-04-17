import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Home,
  User,
  Book,
  MessageSquare,
  DollarSign,
  Bell,
} from "lucide-react";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <nav className="text-white bg-blue-800 shadow-md">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Dashboard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-4 md:flex">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="flex items-center px-3 py-2 text-sm font-medium transition rounded-md hover:bg-blue-700"
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
              className="p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="bg-blue-800 md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="flex items-center px-3 py-2 text-sm font-medium transition rounded-md hover:bg-blue-700"
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
