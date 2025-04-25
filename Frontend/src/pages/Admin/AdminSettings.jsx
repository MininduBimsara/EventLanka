import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSettings,
  updateSettings,
  changeAdminPassword,
} from "../../Redux/Slicers/adminSlice";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const dispatch = useDispatch();
  const {
    data: settingsData,
    loading,
    updateSuccess,
    passwordChangeSuccess,
  } = useSelector((state) => state.admin.settings);
  const error = useSelector((state) => state.admin.error);

  // State for all form fields
  const [settings, setSettings] = useState({
    commission: 0.1,
    taxRate: 0.07,
    notificationPreferences: {
      email: true,
      sms: false,
    },
    branding: {
      logo: "",
      theme: "default",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
    },
  });

  // Password state (kept separate from settings as it's handled differently)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update local state when settings data is loaded from backend
  useEffect(() => {
    if (settingsData) {
      // Transform backend data to match frontend state structure
      setSettings({
        commission: settingsData.commission * 100, // Convert decimal to percentage for display
        taxRate: settingsData.taxRate * 100, // Convert decimal to percentage for display
        notificationPreferences: settingsData.notificationPreferences || {
          email: true,
          sms: false,
        },
        branding: {
          ...settingsData.branding,
          primaryColor: settingsData.branding?.primaryColor || "#3B82F6",
          secondaryColor: settingsData.branding?.secondaryColor || "#1E40AF",
        },
      });
    }
  }, [settingsData]);

  // Show toast notifications for success/error states
  useEffect(() => {
    if (updateSuccess) {
      toast.success("Settings updated successfully!");
    }
    if (passwordChangeSuccess) {
      toast.success("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    if (error) {
      toast.error(error);
    }
  }, [updateSuccess, passwordChangeSuccess, error]);

  // Handle input changes for general settings
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [category, field] = name.split(".");
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [field]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setSettings({
        ...settings,
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

  // Handle general settings submission
  const handleSettingsSubmit = (e) => {
    e.preventDefault();

    // Transform data before sending to backend
    const dataToSend = {
      commission: Number(settings.commission) / 100, // Convert percentage to decimal
      taxRate: Number(settings.taxRate) / 100, // Convert percentage to decimal
      notificationPreferences: settings.notificationPreferences,
      branding: settings.branding,
    };

    dispatch(updateSettings(dataToSend));
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

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <>
            {/* General Settings Form */}
            <form onSubmit={handleSettingsSubmit}>
              {/* Commission Settings */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Commission Settings
                </h2>
                <div className="p-4 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <label
                      htmlFor="commission"
                      className="block w-64 font-medium text-gray-700 text-md"
                    >
                      Platform Commission Rate (%)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        id="commission"
                        name="commission"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.commission}
                        onChange={handleChange}
                        className="block w-24 px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                      />
                      <span className="ml-2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Tax Settings */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Global Tax Rate
                </h2>
                <div className="p-4 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <label
                      htmlFor="taxRate"
                      className="block w-64 font-medium text-gray-700 text-md"
                    >
                      Standard Tax Rate (%)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        id="taxRate"
                        name="taxRate"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.taxRate}
                        onChange={handleChange}
                        className="block w-24 px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                      />
                      <span className="ml-2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Notification Preferences */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Notification Preferences
                </h2>
                <div className="p-4 space-y-4 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <label
                      htmlFor="notificationPreferences.email"
                      className="block w-64 font-medium text-gray-700 text-md"
                    >
                      Email Notifications
                    </label>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        id="notificationPreferences.email"
                        name="notificationPreferences.email"
                        checked={settings.notificationPreferences.email}
                        onChange={handleChange}
                        className="w-4 h-4 px-3 py-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label
                      htmlFor="notificationPreferences.sms"
                      className="block w-64 font-medium text-gray-700 text-md"
                    >
                      SMS Notifications
                    </label>
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        id="notificationPreferences.sms"
                        name="notificationPreferences.sms"
                        checked={settings.notificationPreferences.sms}
                        onChange={handleChange}
                        className="w-4 h-4 px-3 py-2 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Platform Branding */}
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-700">
                  Platform Branding
                </h2>
                <div className="p-4 space-y-4 rounded-md bg-gray-50">
                  <div className="flex flex-col">
                    <label
                      htmlFor="branding.logo"
                      className="block mb-1 font-medium text-gray-700 text-md"
                    >
                      Logo URL
                    </label>
                    <input
                      type="text"
                      id="branding.logo"
                      name="branding.logo"
                      value={settings.branding.logo}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                      <label
                        htmlFor="branding.primaryColor"
                        className="block mb-1 font-medium text-gray-700 text-md"
                      >
                        Primary Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="branding.primaryColor"
                          name="branding.primaryColor"
                          value={settings.branding.primaryColor || "#3B82F6"}
                          onChange={handleChange}
                          className="block w-10 h-10 mt-1 border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={settings.branding.primaryColor || "#3B82F6"}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "branding.primaryColor",
                                value: e.target.value,
                              },
                            })
                          }
                          className="block w-full px-3 py-2 ml-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="branding.secondaryColor"
                        className="block mb-1 font-medium text-gray-700 text-md"
                      >
                        Secondary Color
                      </label>
                      <div className="flex items-center">
                        <input
                          type="color"
                          id="branding.secondaryColor"
                          name="branding.secondaryColor"
                          value={settings.branding.secondaryColor || "#1E40AF"}
                          onChange={handleChange}
                          className="block w-10 h-10 mt-1 border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={settings.branding.secondaryColor || "#1E40AF"}
                          onChange={(e) =>
                            handleChange({
                              target: {
                                name: "branding.secondaryColor",
                                value: e.target.value,
                              },
                            })
                          }
                          className="block w-full px-3 py-2 ml-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="branding.theme"
                      className="block mb-1 font-medium text-gray-700 text-md"
                    >
                      Theme
                    </label>
                    <select
                      id="branding.theme"
                      name="branding.theme"
                      value={settings.branding.theme}
                      onChange={handleChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-md"
                    >
                      <option value="default">Default</option>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <h3 className="mb-2 font-medium text-gray-700 text-md">
                      Preview
                    </h3>
                    <div className="flex space-x-4">
                      <div
                        className="flex items-center justify-center w-24 h-12 text-white rounded-md text-md"
                        style={{
                          backgroundColor: settings.branding.primaryColor,
                        }}
                      >
                        Primary
                      </div>
                      <div
                        className="flex items-center justify-center w-24 h-12 text-white rounded-md text-md"
                        style={{
                          backgroundColor: settings.branding.secondaryColor,
                        }}
                      >
                        Secondary
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Settings"}
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
                    disabled={loading}
                  >
                    {loading ? "Changing..." : "Change Password"}
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
