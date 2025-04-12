// components/Common/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTicketAlt,
  FaSearch,
  FaArrowRight,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaUserEdit,
  FaChevronDown,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuth, logoutUser } from "../../Redux/Slicers/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve authentication details from redux
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check auth status on component mount
  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  // Update navbar styling based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    dispatch(logoutUser());
    setDropdownOpen(false);
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900 shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between px-4 mx-auto">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-2 bg-gray-100 rounded-full"></div>
          <h1 className="text-2xl font-bold">EventLanka</h1>
        </div>

        <div className="hidden space-x-8 md:flex">
          <button
            onClick={() => navigate("/")}
            className="transition-colors hover:text-amber-400"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/eventbrowsing")}
            className="transition-colors hover:text-amber-400"
          >
            Events
          </button>
          <button
            onClick={() => navigate("/about")}
            className="transition-colors hover:text-amber-400"
          >
            About
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="transition-colors hover:text-amber-400"
          >
            Contact
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search in site"
              className="py-1 pl-3 pr-10 text-white bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
          </div>

          {/* If user is not authenticated, show Login button */}
          {!isAuthenticated ? (
            <button
              onClick={handleLoginClick}
              className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-amber-500 rounded-full hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <FaUser className="mr-2" />
              Login
            </button>
          ) : (
            <div className="relative dropdown-container">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <div className="w-6 h-6 mr-2 overflow-hidden bg-gray-600 rounded-full">
                  {/* Optionally display the user's profile image if available */}
                  <img
                    src={user?.profileImage || "/api/placeholder/50/50"}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="mr-1">{user?.username || "My Account"}</span>
                <FaChevronDown
                  className={`transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={() => navigateTo("/mybookings")}
                      className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      <FaTicketAlt className="mr-2" /> My Bookings
                    </button>
                    <button
                      onClick={() => navigateTo("/transactions")}
                      className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      <FaCalendarAlt className="mr-2" /> Transaction History
                    </button>
                    <button
                      onClick={() => navigateTo("/editprofile")}
                      className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      <FaUserEdit className="mr-2" /> Update Info
                    </button>
                    <button
                      onClick={() => navigateTo("/myreviews")}
                      className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      <FaUser className="mr-2" /> My Reviews
                    </button>
                    <button
                      onClick={() => navigateTo("/notifications")}
                      className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      <FaBell className="mr-2" /> Notifications
                    </button>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                    >
                      <FaSignOutAlt className="mr-2" /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button className="text-2xl md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
