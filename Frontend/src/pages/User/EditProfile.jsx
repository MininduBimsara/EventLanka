import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaCheck,
} from "react-icons/fa";

const EditProfile = () => {
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
    <div className="container px-4 pt-24 pb-16 mx-auto">
      <div className="pb-8 mb-8 border-b border-gray-700">
        <h1 className="mb-2 text-3xl font-bold">Edit Profile</h1>
        <p className="text-gray-500">
          Update your personal information and password
        </p>
      </div>

      {successMessage && (
        <div className="p-4 mb-6 text-green-700 bg-green-100 border border-green-400 rounded">
          <div className="flex items-center">
            <FaCheck className="mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Profile Image Upload Section */}
        <div className="md:col-span-1">
          <div className="p-6 bg-gray-800 rounded-lg shadow">
            <h3 className="mb-4 text-xl font-semibold">Profile Photo</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 overflow-hidden bg-gray-700 rounded-full">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <FaUser size={48} />
                  </div>
                )}
              </div>
              <label className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700">
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
                  className="mt-3 text-sm text-red-500 hover:text-red-600"
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
            <div className="p-6 mb-8 bg-gray-800 rounded-lg shadow">
              <h3 className="mb-6 text-xl font-semibold">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaPhone />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-2 text-sm font-medium">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaMapMarkerAlt />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={userData.city}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="p-6 mb-8 bg-gray-800 rounded-lg shadow">
              <h3 className="mb-6 text-xl font-semibold">Change Password</h3>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="currentPassword"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="newPassword"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full py-2.5 pl-10 pr-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75"
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
