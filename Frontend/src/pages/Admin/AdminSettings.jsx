import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  resetProfileUpdateSuccess,
  resetPasswordChangeSuccess,
} from "../../Redux/Slicers/adminSlice";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const dispatch = useDispatch();

  // Get profile data from Redux store
  const {
    data: profileData,
    loading: profileLoading,
    updateSuccess: profileUpdateSuccess,
  } = useSelector((state) => state.admin.profile);

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

  // Password state (kept separate from settings as it's handled differently)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch admin profile on component mount
  useEffect(() => {
    dispatch(fetchAdminProfile());
  }, [dispatch]);

  // Update local state when profile data is loaded from backend
  useEffect(() => {
    if (profileData) {
      setAdminProfile({
        phone: profileData.phone || "",
        position: profileData.position || "System Administrator",
        department: profileData.department || "IT",
        permissions: profileData.permissions || {
          manageUsers: true,
          manageEvents: true,
          managePayments: true,
          manageRefunds: true,
          managePlatformSettings: true,
        },
        twoFactorEnabled: profileData.twoFactorEnabled || false,
        emailNotifications: profileData.emailNotifications || {
          newUsers: true,
          newEvents: true,
          refundRequests: true,
          systemAlerts: true,
        },
      });
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

  // Handle input changes for admin profile
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [category, field] = name.split(".");
      setAdminProfile({
        ...adminProfile,
        [category]: {
          ...adminProfile[category],
          [field]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setAdminProfile({
        ...adminProfile,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle password field changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  // Handle admin profile submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting profile data:", adminProfile);
    dispatch(updateAdminProfile(adminProfile));
  };

  // Handle password change submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Send password change request
    dispatch(
      changeAdminPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      })
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
