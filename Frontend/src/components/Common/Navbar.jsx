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
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuth, logoutUser } from "../../Redux/Thunks/authThunks";
import { googleLogout } from "../../Redux/Thunks/googleAuththunks";
import { clearGoogleUser } from "../../Redux/Slicers/GoogleAuthSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isGoogleAuth = useSelector((state) => state.googleAuth.isAuthenticated);

  // Retrieve authentication details from redux
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check auth status on component mount - always verify
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        !event.target.closest(".mobile-menu-container") &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    return () => {
      handleRouteChange();
    };
  }, [navigate]);

  const handleLoginClick = () => {
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    // Navigate to appropriate dashboard based on user role
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user?.role === "organizer") {
      navigate("/organizer/dashboard");
    }
    setMobileMenuOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      if (isGoogleAuth) {
        await dispatch(googleLogout()).unwrap();
        dispatch(clearGoogleUser()); // Force clear just in case
      } else {
        await dispatch(logoutUser()).unwrap();
      }

      setDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optional: add a toast notification here
      // toast.error("Logout failed. Please try again.");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Determine which button to show based on authentication and role
  const renderAuthButtons = () => {
    if (!isAuthenticated) {
      // Not logged in - show login button
      return (
        <button
          onClick={handleLoginClick}
          className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-amber-500 rounded-full hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <FaUser className="mr-2" />
          Login
        </button>
      );
    } else if (user?.role === "admin" || user?.role === "organizer") {
      // Admin or Organizer - show dashboard button and logout button
      return (
        <div className="flex space-x-2">
          <button
            onClick={handleDashboardClick}
            className="flex items-center px-4 py-1.5 text-sm font-medium text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <FaTachometerAlt className="mr-2" />
            <span className="hidden lg:inline">
              {user.role === "admin"
                ? "Admin Dashboard"
                : "Organizer Dashboard"}
            </span>
            <span className="lg:hidden">Dashboard</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors bg-gray-700 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            title="Logout" // Add tooltip for when text is hidden
          >
            <FaSignOutAlt className="mr-0 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      );
    } else {
      // Regular user - show dropdown
      return (
        <div className="relative dropdown-container">
          <button
            onClick={toggleDropdown}
            className="flex items-center px-3 py-1.5 text-sm font-medium text-white transition-colors bg-gray-800 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <div className="w-6 h-6 mr-2 overflow-hidden bg-gray-600 rounded-full">
              {/* Optionally display the user's profile image if available */}
              <img
                src={
                  user?.profileImage
                    ? `http://localhost:5000${user.profileImage}`
                    : "/api/placeholder/50/50"
                }
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <span className="hidden mr-1 sm:inline">
              {user?.username || "My Account"}
            </span>
            <FaChevronDown
              className={`transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu - make sure it's visible when dropdownOpen is true */}
          {dropdownOpen && (
            <div className="absolute right-0 w-48 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => navigateTo("/user/mybookings")}
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                >
                  <FaTicketAlt className="mr-2" /> My Bookings
                </button>
                <button
                  onClick={() => navigateTo("/user/transactions")}
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                >
                  <FaCalendarAlt className="mr-2" /> Transaction History
                </button>
                <button
                  onClick={() => navigateTo("/user/editprofile")}
                  className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                >
                  <FaUserEdit className="mr-2" /> Update Info
                </button>
                <button
                  onClick={() => navigateTo("/user/notifications")}
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
      );
    }
  };

  return (
    <nav
      className={`select-none fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900 text-white shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div
            onClick={() => navigateTo("/")}
            className="flex items-center cursor-pointer"
          >
            <div className="w-10 h-10 mt-5 mr-2">
              <img src="/2.png" className="justify-center align-middle" />
            </div>
            <h1 className="text-2xl font-bold">EventLanka</h1>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden space-x-8 md:flex">
          <button
            onClick={() => navigateTo("/")}
            className="transition-colors hover:text-amber-400"
          >
            Home
          </button>
          <button
            onClick={() => navigateTo("/eventbrowsing")}
            className="transition-colors hover:text-amber-400"
          >
            Events
          </button>
          <button
            onClick={() => navigateTo("/about")}
            className="transition-colors hover:text-amber-400"
          >
            About
          </button>
          <button
            onClick={() => navigateTo("/contact")}
            className="transition-colors hover:text-amber-400"
          >
            Contact
          </button>
        </div>

        {/* Search and Auth Buttons */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search in site"
              className="py-1 pl-3 pr-10 text-white bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">{renderAuthButtons()}</div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="text-2xl md:hidden mobile-menu-button"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-container md:hidden">
          <div className="px-2 pt-2 pb-4 space-y-1 bg-gray-900 shadow-lg bg-opacity-95">
            <div className="flex items-center justify-between px-4 py-2">
              <div></div>
              <div className="md:hidden">{renderAuthButtons()}</div>
            </div>

            <div className="relative px-4 py-2">
              <input
                type="text"
                placeholder="Search in site"
                className="w-full py-2 pl-3 pr-10 text-white bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 right-6 top-1/2" />
            </div>

            <hr className="border-gray-700" />

            <button
              onClick={() => navigateTo("/")}
              className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800 hover:text-amber-400"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("/eventbrowsing")}
              className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800 hover:text-amber-400"
            >
              Events
            </button>
            <button
              onClick={() => navigateTo("/about")}
              className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800 hover:text-amber-400"
            >
              About
            </button>
            <button
              onClick={() => navigateTo("/contact")}
              className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800 hover:text-amber-400"
            >
              Contact
            </button>

            {/* Show user account options in mobile menu if authenticated */}
            {isAuthenticated &&
              user?.role !== "admin" &&
              user?.role !== "organizer" && (
                <>
                  <hr className="border-gray-700" />
                  <button
                    onClick={() => navigateTo("/user/mybookings")}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800"
                  >
                    <FaTicketAlt className="inline mr-2" /> My Bookings
                  </button>
                  <button
                    onClick={() => navigateTo("/user/transactions")}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800"
                  >
                    <FaCalendarAlt className="inline mr-2" /> Transaction
                    History
                  </button>
                  <button
                    onClick={() => navigateTo("/user/editprofile")}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800"
                  >
                    <FaUserEdit className="inline mr-2" /> Update Info
                  </button>
                  <button
                    onClick={() => navigateTo("/user/notifications")}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800"
                  >
                    <FaBell className="inline mr-2" /> Notifications
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-gray-800"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Log Out
                  </button>
                </>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
