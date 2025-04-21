// src/pages/User/EditProfile.jsx
import React, { useState, useEffect } from "react";
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
import { useTheme } from "../../Context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  clearUserError,
  clearSuccessMessage,
} from "../../Redux/Slicers/userSlice";
import UserNavbar from "../../components/User/UserNavbar";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  // Auth slice holds the logged‑in user
  const authUser = useSelector((state) => state.user.user);

  // Profile slice holds loading, error, successMessage, and the updated user
  const { loading, error, successMessage, userInfo } = useSelector(
    (state) => state.profile
  );

  // If not logged in, send back to /login
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  // Combine: prefer the freshly‐updated profile, else fall back to authUser
  const profileData = userInfo || authUser;

  // Local form state
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    profileImage: null,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // On mount (or whenever profileData changes), preload the form
  useEffect(() => {
    if (!profileData) return;

    // Name → first/last
    const nameParts = (profileData.name || "").split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setUserData((_) => ({
      firstName,
      lastName,
      email: profileData.email || "",
      phone: profileData.phone || "",
      address: profileData.address || "",
      city: profileData.city || "",
      profileImage: null,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    // Profile image preview if available
    if (profileData.profileImage) {
      const imgUrl =
        profileData.profileImage.startsWith("http") ||
        profileData.profileImage.startsWith("/")
          ? profileData.profileImage
          : `/profile-images/${profileData.profileImage}`;
      setImagePreview(imgUrl);
    }
  }, [profileData]);

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Generic input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // File input handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUserData((prev) => ({ ...prev, profileImage: file }));
    const blob = URL.createObjectURL(file);
    setImagePreview(blob);
  };

  // Toggle password section
  const togglePasswordFields = () => {
    setShowPasswordFields((s) => !s);
    if (showPasswordFields) {
      setUserData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (!authUser || !authUser.id) {
    alert("Session expired. Please log in again.");
    navigate("/login");
    return;
  }

  // Build a payload of only changed fields
  const changed = {};
  let hasChanges = false;

  // Check basic fields
  ["firstName", "lastName", "email", "phone", "address", "city"].forEach(
    (key) => {
      const val = userData[key];
      // original values from profileData
      const orig =
        key === "firstName" || key === "lastName"
          ? (profileData.name || "").split(" ")[key === "firstName" ? 0 : 1] ||
            ""
          : profileData[key] || "";
      if (val && val !== orig) {
        changed[key] = val;
        hasChanges = true;
      }
    }
  );

  // File?
  if (userData.profileImage instanceof File) {
    changed.profileImage = userData.profileImage;
    hasChanges = true; // Ensure this is set
  }

  // Password?
  if (userData.newPassword) {
    if (userData.newPassword !== userData.confirmPassword) {
      alert("New passwords don’t match.");
      return;
    }
    changed.password = userData.newPassword;
    hasChanges = true;
  }

  // Always send `name` if either first or last changed
  if (changed.firstName || changed.lastName) {
    changed.name = `${changed.firstName || profileData.name.split(" ")[0]} ${
      changed.lastName || profileData.name.split(" ")[1] || ""
    }`.trim();
  }

  // If no changes detected, show an alert
  if (!hasChanges) {
    alert("No changes detected.");
    return;
  }

  // Dispatch our thunk (it pulls the ID from auth slice)
  dispatch(updateUserProfile(changed))
    .unwrap()
    .then(() => {
      // Check if only the profile image was updated
      if (Object.keys(changed).length === 1 && changed.profileImage) {
        alert("Profile image updated successfully!");
      } else {
        alert("Profile updated successfully!");
      }
    })
    .catch((err) => {
      if (err.includes("401")) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    });
};

  // Clear errors & success when we leave
  useEffect(() => {
    return () => {
      dispatch(clearUserError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);

  return (
    <>
      <UserNavbar />

      <div className="container min-h-screen px-4 py-8 mx-auto bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Edit Profile
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 text-white rounded-full bg-amber-500"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {successMessage && (
          <div className="p-4 mb-4 border border-green-200 rounded bg-green-50">
            <FaCheck className="inline mr-2 text-green-500" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        )}
        {error && (
          <div className="p-4 mb-4 border border-red-200 rounded bg-red-50">
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Image upload */}
            <div className="md:col-span-1">
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                  Profile Photo
                </h3>
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-4 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FaUser className="w-full h-full p-8 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <label className="px-4 py-2 text-white rounded cursor-pointer bg-amber-500">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Main form */}
            <div className="space-y-6 md:col-span-2">
              {/* Personal info */}
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      name: "firstName",
                      icon: FaUser,
                      placeholder: "First Name",
                      value: userData.firstName,
                    },
                    {
                      name: "lastName",
                      icon: FaUser,
                      placeholder: "Last Name",
                      value: userData.lastName,
                    },
                    {
                      name: "email",
                      icon: FaEnvelope,
                      placeholder: "Email Address",
                      type: "email",
                      value: userData.email,
                    },
                    {
                      name: "phone",
                      icon: FaPhone,
                      placeholder: "Phone Number",
                      type: "tel",
                      value: userData.phone,
                    },
                    {
                      name: "address",
                      icon: FaMapMarkerAlt,
                      placeholder: "Street Address",
                      value: userData.address,
                    },
                    {
                      name: "city",
                      icon: FaMapMarkerAlt,
                      placeholder: "City",
                      value: userData.city,
                    },
                  ].map(({ name, icon: Icon, placeholder, type, value }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {placeholder}
                      </label>
                      <div className="relative mt-1">
                        <Icon className="absolute text-gray-400 left-3 top-3" />
                        <input
                          name={name}
                          type={type || "text"}
                          value={value}
                          onChange={handleInputChange}
                          className="w-full py-2 pl-10 pr-4 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                          placeholder={placeholder}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Password change */}
              <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Change Password
                  </h3>
                  <button
                    type="button"
                    onClick={togglePasswordFields}
                    className="px-4 py-2 text-white rounded bg-amber-500"
                  >
                    {showPasswordFields ? "Cancel" : "Change Password"}
                  </button>
                </div>
                {showPasswordFields && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      {
                        name: "currentPassword",
                        placeholder: "Current Password",
                      },
                      {
                        name: "newPassword",
                        placeholder: "New Password",
                      },
                      {
                        name: "confirmPassword",
                        placeholder: "Confirm New Password",
                      },
                    ].map(({ name, placeholder }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {placeholder}
                        </label>
                        <div className="relative mt-1">
                          <FaLock className="absolute text-gray-400 left-3 top-3" />
                          <input
                            type="password"
                            name={name}
                            value={userData[name]}
                            onChange={handleInputChange}
                            className="w-full py-2 pl-10 pr-4 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                            placeholder={placeholder}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="text-right">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`px-6 py-2 rounded-md text-white ${
                    loading ? "bg-gray-400" : "bg-amber-500 hover:bg-amber-600"
                  }`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
