import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaCheck,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext"; // Import the useTheme hook
const EditProfile = () => {
  const { darkMode, toggleTheme } = useTheme(); // Use the theme context

  // Mock user data - in a real app, this would come from your authentication context or API
  const [userData, setUserData] = useState({
    firstName: "Malith",
    lastName: "Fernando",
    email: "malith@example.com",
    phone: "+94 77 123 4567",
    address: "123 Main Street, Colombo",
    city: "Colombo",
    profileImage: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to your server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file);
      setUserData({
        ...userData,
        profileImage: imageUrl,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Password validation
    if (
      userData.newPassword &&
      userData.newPassword !== userData.confirmPassword
    ) {
      setErrorMessage("New passwords don't match");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, you would send this data to your API
      console.log("Updated user data:", userData);
      setSuccessMessage("Profile updated successfully!");
      setIsSubmitting(false);

      // Clear password fields after successful update
      setUserData({
        ...userData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <div className="container min-h-screen px-4 py-8 mx-auto transition-colors duration-200 bg-white dark:bg-gray-900">
      <div className="fixed z-10 p-2 text-xl bg-white rounded-full shadow-lg top-4 right-4 dark:bg-gray-800">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          Edit Profile
        </h1>
        <div className="w-16 h-1 rounded bg-amber-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Update your personal information and password
        </p>
      </div>

      {successMessage && (
        <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900 dark:border-green-700">
          <div className="flex items-center">
            <FaCheck className="mr-2 text-green-500 dark:text-green-300" />
            <span className="text-green-700 dark:text-green-300">
              {successMessage}
            </span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900 dark:border-red-700">
          <span className="text-red-700 dark:text-red-300">{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile Image Upload Section */}
        <div className="md:col-span-1">
          <div className="p-6 transition-all duration-200 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Profile Photo
            </h3>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-5 overflow-hidden bg-gray-100 rounded-full shadow-md dark:bg-gray-700">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 dark:text-gray-500">
                    <FaUser size={64} />
                  </div>
                )}
              </div>
              <label className="px-6 py-3 text-sm font-medium text-white transition-colors duration-150 rounded-md cursor-pointer bg-amber-500 hover:bg-amber-600">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {userData.profileImage && (
                <button
                  type="button"
                  className="mt-3 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  onClick={() =>
                    setUserData({ ...userData, profileImage: null })
                  }
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="p-6 mb-8 transition-all duration-200 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaMapMarkerAlt />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="p-6 mb-8 transition-all duration-200 bg-white rounded-lg shadow-md dark:bg-gray-800 hover:shadow-lg">
              <h3 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
                Change Password
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-amber-500">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full py-3 pl-10 pr-3 transition-colors duration-200 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 text-white transition-colors duration-200 rounded-md shadow-md disabled:opacity-75 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
