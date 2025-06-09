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
                    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
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

  // Mobile auth buttons with improved styling
  const renderMobileAuthButtons = () => {
    if (!isAuthenticated) {
      return (
        <button
          onClick={handleLoginClick}
          className="flex items-center justify-center w-full px-6 py-3 mt-4 text-sm font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 hover:scale-105"
        >
          <FaUser className="mr-2" />
          Sign In to Your Account
        </button>
      );
    } else if (user?.role === "admin" || user?.role === "organizer") {
      return (
        <div className="flex flex-col mt-4 space-y-3">
          <button
            onClick={handleDashboardClick}
            className="flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:scale-105"
          >
            <FaTachometerAlt className="mr-2" />
            {user.role === "admin" ? "Admin Dashboard" : "Organizer Dashboard"}
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 hover:scale-105"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-between w-full p-4 mt-4 shadow-lg bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3 overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-amber-600 ring-2 ring-amber-400">
              <img
                src={
                  user?.profileImage
                    ? `${import.meta.env.VITE_API_URL}${user.profileImage}`
                    : "/api/placeholder/50/50"
                }
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-gray-400">Account Settings</p>
            </div>
          </div>
          <FaChevronDown className="text-amber-400" />
        </div>
      );
    }
  };

  return (
    <>
      <nav
        className={`select-none fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gray-900 text-white shadow-lg py-2"
            : "bg-gray-900 py-4"
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
              className="relative p-2 text-white transition-all duration-300 rounded-lg md:hidden mobile-menu-button hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 top-3" : "top-1"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 top-3 ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 top-3" : "top-5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-container md:hidden ">
            <div className="bg-gray-900 shadow-2xl backdrop-blur-lg ">
              {/* Mobile Header with User Info */}
              <div className="px-6 py-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3">
                      <img src="/2.png" className="w-full h-full" />
                    </div>
                    <h2 className="text-lg font-bold text-white">EventLanka</h2>
                  </div>
                  <div className="text-sm text-gray-400">
                    {isAuthenticated ? `Welcome back!` : "Discover Events"}
                  </div>
                </div>

                {/* Mobile Auth Section */}
                {renderMobileAuthButtons()}
              </div>

              {/* Enhanced Search Bar */}
              <div className="px-6 py-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events, venues, artists..."
                    className="w-full py-3 pl-4 pr-12 text-white transition-all duration-300 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <FaSearch className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="px-2 pb-6">
                <div className="space-y-2">
                  {[
                    { path: "/", label: "Home", icon: "🏠" },
                    {
                      path: "/eventbrowsing",
                      label: "Browse Events",
                      icon: "🎉",
                    },
                    { path: "/about", label: "About Us", icon: "ℹ️" },
                    { path: "/contact", label: "Contact", icon: "📞" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigateTo(item.path)}
                      className="flex items-center w-full px-4 py-3 text-left text-white transition-all duration-300 rounded-xl hover:bg-gray-800 hover:text-amber-400 group"
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      <FaArrowRight className="ml-auto text-gray-600 transition-transform duration-300 group-hover:text-amber-400 group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>

                {/* User Account Section for Regular Users */}
                {isAuthenticated &&
                  user?.role !== "admin" &&
                  user?.role !== "organizer" && (
                    <div className="mt-6">
                      <div className="px-4 py-2 mb-3">
                        <h3 className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                          Account
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {[
                          {
                            path: "/user/mybookings",
                            label: "My Bookings",
                            icon: FaTicketAlt,
                          },
                          {
                            path: "/user/transactions",
                            label: "Transactions",
                            icon: FaCalendarAlt,
                          },
                          {
                            path: "/user/editprofile",
                            label: "Edit Profile",
                            icon: FaUserEdit,
                          },
                          {
                            path: "/user/notifications",
                            label: "Notifications",
                            icon: FaBell,
                          },
                        ].map((item) => (
                          <button
                            key={item.path}
                            onClick={() => navigateTo(item.path)}
                            className="flex items-center w-full px-4 py-3 text-left text-gray-300 transition-all duration-300 rounded-xl hover:bg-gray-800 hover:text-white group"
                          >
                            <item.icon className="mr-3 text-gray-500 transition-colors duration-300 group-hover:text-amber-400" />
                            <span>{item.label}</span>
                            <FaArrowRight className="ml-auto text-gray-600 transition-transform duration-300 group-hover:text-amber-400 group-hover:translate-x-1" />
                          </button>
                        ))}

                        <div className="pt-3 mt-3 border-t border-gray-700">
                          <button
                            onClick={handleLogoutClick}
                            className="flex items-center w-full px-4 py-3 text-left text-red-400 transition-all duration-300 rounded-xl hover:bg-red-900 hover:bg-opacity-20 group"
                          >
                            <FaSignOutAlt className="mr-3 transition-colors duration-300 group-hover:text-red-300" />
                            <span>Sign Out</span>
                            <FaArrowRight className="ml-auto text-red-600 transition-transform duration-300 group-hover:text-red-400 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer div to prevent content from being hidden behind fixed navbar */}
      <div
        className={`${
          isScrolled ? "h-16" : "h-20"
        } transition-all duration-300`}
      ></div>
    </>
  );
};

export default Navbar;
