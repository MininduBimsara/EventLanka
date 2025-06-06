import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../../Redux/Thunks/adminThunks";
import {
  resetProfileUpdateSuccess,
  resetPasswordChangeSuccess,
} from "../../Redux/Slicers/adminSlice";
import { toast } from "react-toastify";
import { inputValidation } from "../../Utils/Admin/adminValidation"; // Import the validation utilities
import { useToast } from "../../components/Common/Notification/ToastContext";

const AdminSettings = () => {
  const dispatch = useDispatch();

  // Get profile data from Redux store
  const {
    data: profileData,
    loading: profileLoading,
    updateSuccess: profileUpdateSuccess,
  } = useSelector((state) => state.admin.profile);


  const toast = useToast();
  // Get password change success from settings
  const { passwordChangeSuccess } = useSelector(
    (state) => state.admin.settings
  );

  const error = useSelector((state) => state.admin.error);

  // State for admin profile fields
  const [adminProfile, setAdminProfile] = useState({
    phone: "",
    position: "System Administrator",
    department: "IT",
    permissions: {
      manageUsers: true,
      manageEvents: true,
      managePayments: true,
      manageRefunds: true,
      managePlatformSettings: true,
    },
    twoFactorEnabled: false,
    emailNotifications: {
      newUsers: true,
      newEvents: true,
      refundRequests: true,
      systemAlerts: true,
    },
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch admin profile on component mount
  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  // Update local state when profile data is loaded from backend
  useEffect(() => {
    if (profileData) {
      // Sanitize all incoming data from backend
      const sanitizedProfile = {
        phone: inputValidation.sanitizeInput(profileData.phone || ""),
        position: inputValidation.sanitizeInput(
          profileData.position || "System Administrator"
        ),
        department: inputValidation.sanitizeInput(
          profileData.department || "IT"
        ),
        permissions: profileData.permissions || {
          manageUsers: true,
          manageEvents: true,
          managePayments: true,
          manageRefunds: true,
          managePlatformSettings: true,
        },
        twoFactorEnabled: Boolean(profileData.twoFactorEnabled),
        emailNotifications: profileData.emailNotifications || {
          newUsers: true,
          newEvents: true,
          refundRequests: true,
          systemAlerts: true,
        },
      };

      setAdminProfile(sanitizedProfile);
    }
  }, [profileData]);

  // Show toast notifications for success/error states
  useEffect(() => {
    if (profileUpdateSuccess) {
      toast.success("Admin profile updated successfully!");
      dispatch(resetProfileUpdateSuccess());
    }
  }, [profileUpdateSuccess, dispatch]);

  useEffect(() => {
    if (passwordChangeSuccess) {
      toast.success("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      dispatch(resetPasswordChangeSuccess());
    }
  }, [passwordChangeSuccess, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Clear validation error for a specific field
  const clearValidationError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Handle input changes for admin profile with validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let validationResult = {
      isValid: true,
      value: type === "checkbox" ? checked : value,
    };

    // Validate based on field type
    if (type !== "checkbox") {
      switch (name) {
        case "phone":
          validationResult = inputValidation.validatePhone(value);
          break;
        case "position":
          validationResult = inputValidation.validateTextField(
            value,
            "Position",
            50
          );
          break;
        case "department":
          validationResult = inputValidation.validateTextField(
            value,
            "Department",
            50
          );
          break;
        default:
          validationResult = {
            isValid: true,
            value: inputValidation.sanitizeInput(value),
          };
      }
    }

    // Update validation errors
    if (!validationResult.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: validationResult.error,
      }));
      return; // Don't update state if validation fails
    } else {
      clearValidationError(name);
    }

    // Update state
    if (name.includes(".")) {
      const [category, field] = name.split(".");
      setAdminProfile({
        ...adminProfile,
        [category]: {
          ...adminProfile[category],
          [field]: validationResult.value,
        },
      });
    } else {
      setAdminProfile({
        ...adminProfile,
        [name]: validationResult.value,
      });
    }
  };

  // Handle password field changes with validation
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    // Clear previous validation errors for this field
    clearValidationError(name);

    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Validate entire profile before submission
  const validateProfile = () => {
    const errors = {};

    // Validate phone
    const phoneValidation = inputValidation.validatePhone(adminProfile.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error;
    }

    // Validate position
    const positionValidation = inputValidation.validateTextField(
      adminProfile.position,
      "Position"
    );
    if (!positionValidation.isValid) {
      errors.position = positionValidation.error;
    }

    // Validate department
    const departmentValidation = inputValidation.validateTextField(
      adminProfile.department,
      "Department"
    );
    if (!departmentValidation.isValid) {
      errors.department = departmentValidation.error;
    }

    return errors;
  };

  // Handle admin profile submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = validateProfile();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fix validation errors before submitting");
      return;
    }

    // Sanitize and validate permissions and notifications
    const permissionsValidation = inputValidation.validatePermissions(
      adminProfile.permissions
    );
    const notificationsValidation = inputValidation.validateEmailNotifications(
      adminProfile.emailNotifications
    );

    const sanitizedProfile = {
      ...adminProfile,
      phone: inputValidation.sanitizeInput(adminProfile.phone),
      position: inputValidation.sanitizeInput(adminProfile.position),
      department: inputValidation.sanitizeInput(adminProfile.department),
      permissions: permissionsValidation.value,
      emailNotifications: notificationsValidation.value,
      twoFactorEnabled: Boolean(adminProfile.twoFactorEnabled),
    };

    console.log("Submitting sanitized profile data:", sanitizedProfile);
    dispatch(updateAdminProfile(sanitizedProfile));
  };

  // Handle password change submission with validation
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    const errors = {};

    // Validate old password (basic check)
    if (!passwordData.oldPassword) {
      errors.oldPassword = "Current password is required";
    }

    // Validate new password
    const newPasswordValidation = inputValidation.validatePassword(
      passwordData.newPassword
    );
    if (!newPasswordValidation.isValid) {
      errors.newPassword = newPasswordValidation.error;
    }

    // Validate password confirmation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "New passwords don't match";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

    // Clear validation errors
    setValidationErrors({});

    // Send password change request
    dispatch(
      changeAdminPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
    );
  };

  // Render input field with validation error
  const renderInputField = (props) => {
    const { name, error, ...inputProps } = props;
    return (
      <div className="flex flex-col">
        <input {...inputProps} />
        {error && <span className="mt-1 text-sm text-red-600">{error}</span>}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Admin Settings
        </h1>

        {profileLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Admin Profile Form */}
            <form onSubmit={handleProfileSubmit}>
              {/* Basic Information */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Basic Information
                </h2>
                <div className="p-4 space-y-4 rounded-md bg-gray-50">
                  <div className="flex flex-col">
                    <label
                      htmlFor="phone"
                      className="block mb-1 font-medium text-gray-700 text-md"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={adminProfile.phone}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                      <label
                        htmlFor="position"
                        className="block mb-1 font-medium text-gray-700 text-md"
                      >
                        Position
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={adminProfile.position}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        placeholder="e.g., System Administrator"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="department"
                        className="block mb-1 font-medium text-gray-700 text-md"
                      >
                        Department
                      </label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={adminProfile.department}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        placeholder="e.g., IT"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Permissions */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Admin Permissions
                </h2>
                <div className="p-4 space-y-4 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permissions.manageUsers"
                        name="permissions.manageUsers"
                        checked={adminProfile.permissions.manageUsers}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="permissions.manageUsers"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        Manage Users
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permissions.manageEvents"
                        name="permissions.manageEvents"
                        checked={adminProfile.permissions.manageEvents}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="permissions.manageEvents"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        Manage Events
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permissions.managePayments"
                        name="permissions.managePayments"
                        checked={adminProfile.permissions.managePayments}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="permissions.managePayments"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        Manage Payments
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="permissions.manageRefunds"
                        name="permissions.manageRefunds"
                        checked={adminProfile.permissions.manageRefunds}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="permissions.manageRefunds"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        Manage Refunds
                      </label>
                    </div>

                    <div className="flex items-center md:col-span-2">
                      <input
                        type="checkbox"
                        id="permissions.managePlatformSettings"
                        name="permissions.managePlatformSettings"
                        checked={
                          adminProfile.permissions.managePlatformSettings
                        }
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="permissions.managePlatformSettings"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        Manage Platform Settings
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Settings */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Security Settings
                </h2>
                <div className="p-4 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="twoFactorEnabled"
                      name="twoFactorEnabled"
                      checked={adminProfile.twoFactorEnabled}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="twoFactorEnabled"
                      className="ml-2 font-medium text-gray-700 text-md"
                    >
                      Enable Two-Factor Authentication
                    </label>
                  </div>
                </div>
              </section>

              {/* Email Notification Preferences */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Email Notification Preferences
                </h2>
                <div className="p-4 space-y-4 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications.newUsers"
                        name="emailNotifications.newUsers"
                        checked={adminProfile.emailNotifications.newUsers}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="emailNotifications.newUsers"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        New User Registrations
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications.newEvents"
                        name="emailNotifications.newEvents"
                        checked={adminProfile.emailNotifications.newEvents}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="emailNotifications.newEvents"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        New Event Creations
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications.refundRequests"
                        name="emailNotifications.refundRequests"
                        checked={adminProfile.emailNotifications.refundRequests}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="emailNotifications.refundRequests"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        Refund Requests
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications.systemAlerts"
                        name="emailNotifications.systemAlerts"
                        checked={adminProfile.emailNotifications.systemAlerts}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="emailNotifications.systemAlerts"
                        className="ml-2 font-medium text-gray-700 text-md"
                      >
                        System Alerts
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-8 border-t border-gray-200"></div>

            {/* Admin Password Change Form */}
            <form onSubmit={handlePasswordSubmit}>
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Change Admin Password
                </h2>
                <div className="p-4 space-y-4 rounded-md bg-gray-50">
                  <div className="flex flex-col">
                    <label
                      htmlFor="oldPassword"
                      className="block mb-1 font-medium text-gray-700 text-md"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="newPassword"
                      className="block mb-1 font-medium text-gray-700 text-md"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                      placeholder="Enter new password"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-1 font-medium text-gray-700 text-md"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    disabled={profileLoading}
                  >
                    {profileLoading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </section>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
