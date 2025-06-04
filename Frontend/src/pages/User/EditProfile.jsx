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
  FaExclamationTriangle,
} from "react-icons/fa";
import { useTheme } from "../../Context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserError,
  clearSuccessMessage,
} from "../../Redux/Slicers/userSlice";
import {
  updateUserProfile,
} from "../../Redux/Thunks/userThunks";
import UserNavbar from "../../components/User/UserNavbar";
import { useNavigate } from "react-router-dom";

// Import validation utilities
import {
  sanitizeInput,
  validateField,
  validateForm,
  isFormValid,
  sanitizeFormData,
  validateImageFile,
  getFieldConstraints,
  ALLOWED_IMAGE_TYPES,
} from "../../Utils/User/validationUtils";

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

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // On mount (or whenever profileData changes), preload the form
  useEffect(() => {
    if (!profileData) return;

    // Name → first/last
    const nameParts = (profileData.name || "").split(" ");
    const firstName = sanitizeInput(nameParts[0] || "");
    const lastName = sanitizeInput(nameParts.slice(1).join(" ") || "");

    setUserData((_) => ({
      firstName,
      lastName,
      email: sanitizeInput(profileData.email || ""),
      phone: sanitizeInput(profileData.phone || ""),
      address: sanitizeInput(profileData.address || ""),
      city: sanitizeInput(profileData.city || ""),
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

  // Generic input handler with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input
    const sanitizedValue = sanitizeInput(value);

    // Update state
    setUserData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Validate field
    const error = validateField(name, sanitizedValue, userData);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // File input handler with validation
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file using utility function
    const validation = validateImageFile(file);

    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        profileImage: validation.error,
      }));
      return;
    }

    // Clear any previous errors
    setValidationErrors((prev) => ({
      ...prev,
      profileImage: null,
    }));

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
      // Clear password validation errors
      setValidationErrors((prev) => ({
        ...prev,
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
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

    // Validate form before submission using utility function
    const errors = validateForm(userData);
    setValidationErrors(errors);

    if (!isFormValid(errors)) {
      alert("Please fix the validation errors before submitting.");
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
            ? (profileData.name || "").split(" ")[
                key === "firstName" ? 0 : 1
              ] || ""
            : profileData[key] || "";
        if (val && val !== orig) {
          changed[key] = sanitizeInput(val); // Extra sanitization before sending
          hasChanges = true;
        }
      }
    );

    // File?
    if (userData.profileImage instanceof File) {
      changed.profileImage = userData.profileImage;
      hasChanges = true;
    }

    // Password?
    if (userData.newPassword) {
      if (userData.newPassword !== userData.confirmPassword) {
        alert("New passwords don't match.");
        return;
      }
      // Additional password validation using utility
      const passwordError = validateField("newPassword", userData.newPassword);
      if (passwordError) {
        alert("Password does not meet security requirements.");
        return;
      }
      changed.password = userData.newPassword;
      hasChanges = true;
    }

    // Always send `name` if either first or last changed
    if (changed.firstName || changed.lastName) {
      const firstName =
        changed.firstName || sanitizeInput(profileData.name.split(" ")[0]);
      const lastName =
        changed.lastName || sanitizeInput(profileData.name.split(" ")[1] || "");
      changed.name = `${firstName} ${lastName}`.trim();
    }

    // If no changes detected, show an alert
    if (!hasChanges) {
      alert("No changes detected.");
      return;
    }

    // Sanitize final payload
    const sanitizedPayload = sanitizeFormData(changed);

    // Dispatch our thunk (it pulls the ID from auth slice)
    dispatch(updateUserProfile(sanitizedPayload))
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

  // Error component for displaying validation errors
  const ValidationError = ({ error }) => {
    if (!error) return null;
    return (
      <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
        <FaExclamationTriangle className="mr-1" />
        {error}
      </div>
    );
  };

  // Form field configuration
  const formFields = [
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
  ];

  const passwordFields = [
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
  ];

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
            className="p-2 text-white rounded-full bg-amber-500 hover:bg-amber-600"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {successMessage && (
          <div className="p-4 mb-4 border border-green-200 rounded bg-green-50 dark:bg-green-900 dark:border-green-700">
            <FaCheck className="inline mr-2 text-green-500" />
            <span className="text-green-700 dark:text-green-300">
              {successMessage}
            </span>
          </div>
        )}
        {error && (
          <div className="p-4 mb-4 border border-red-200 rounded bg-red-50 dark:bg-red-900 dark:border-red-700">
            <span className="text-red-700 dark:text-red-300">{error}</span>
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
                        alt="Profile preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <FaUser className="w-full h-full p-8 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <label className="px-4 py-2 text-white rounded cursor-pointer bg-amber-500 hover:bg-amber-600">
                    Change Photo
                    <input
                      type="file"
                      accept={ALLOWED_IMAGE_TYPES.join(",")}
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <ValidationError error={validationErrors.profileImage} />
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
                  {formFields.map(
                    ({ name, icon: Icon, placeholder, type, value }) => {
                      const constraints = getFieldConstraints(name);

                      return (
                        <div key={name}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {placeholder}
                          </label>
                          <div className="relative mt-1">
                            <Icon className="absolute text-gray-400 left-3 top-3" />
                            <input
                              name={name}
                              type={type || constraints.type}
                              value={value}
                              onChange={handleInputChange}
                              maxLength={constraints.maxLength}
                              className={`w-full py-2 pl-10 pr-4 border rounded-md dark:bg-gray-700 dark:text-gray-200 transition-colors ${
                                validationErrors[name]
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
                              }`}
                              placeholder={placeholder}
                            />
                          </div>
                          <ValidationError error={validationErrors[name]} />
                        </div>
                      );
                    }
                  )}
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
                    className="px-4 py-2 text-white transition-colors rounded bg-amber-500 hover:bg-amber-600"
                  >
                    {showPasswordFields ? "Cancel" : "Change Password"}
                  </button>
                </div>
                {showPasswordFields && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {passwordFields.map(({ name, placeholder }) => {
                      const constraints = getFieldConstraints(name);

                      return (
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
                              maxLength={constraints.maxLength}
                              className={`w-full py-2 pl-10 pr-4 border rounded-md dark:bg-gray-700 dark:text-gray-200 transition-colors ${
                                validationErrors[name]
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                                  : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
                              }`}
                              placeholder={placeholder}
                            />
                          </div>
                          <ValidationError error={validationErrors[name]} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading || !isFormValid(validationErrors)}
                  className={`px-6 py-2 rounded-md text-white transition-colors ${
                    loading || !isFormValid(validationErrors)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600"
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
