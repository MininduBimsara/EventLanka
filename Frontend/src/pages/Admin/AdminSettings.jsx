import React, { useState } from "react";

const AdminSettings = () => {
  // State for all form fields
  const [settings, setSettings] = useState({
    commission: 5,
    taxRates: {
      standard: 20,
      reduced: 10,
      zero: 0,
    },
    notifications: {
      email: true,
      sms: false,
    },
    password: "",
    confirmPassword: "",
    branding: {
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      logoUrl: "/logo.png",
    },
  });

  // Handle input changes
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

  // Handle tax rate changes
  const handleTaxRateChange = (taxType, value) => {
    setSettings({
      ...settings,
      taxRates: {
        ...settings.taxRates,
        [taxType]: Number(value),
      },
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (settings.password && settings.password !== settings.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    // Here you would typically send the data to your API
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Admin Settings
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Commission Settings */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Commission Settings
            </h2>
            <div className="p-4 rounded-md bg-gray-50">
              <div className="flex items-center">
                <label
                  htmlFor="commission"
                  className="block w-64 text-sm font-medium text-gray-700"
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
                    className="block w-24 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <span className="ml-2 text-gray-500">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Tax Settings */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Global Tax Rates
            </h2>
            <div className="p-4 space-y-4 rounded-md bg-gray-50">
              <div className="flex items-center">
                <label
                  htmlFor="standard-tax"
                  className="block w-64 text-sm font-medium text-gray-700"
                >
                  Standard Rate
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="standard-tax"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.taxRates.standard}
                    onChange={(e) =>
                      handleTaxRateChange("standard", e.target.value)
                    }
                    className="block w-24 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <span className="ml-2 text-gray-500">%</span>
                </div>
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="reduced-tax"
                  className="block w-64 text-sm font-medium text-gray-700"
                >
                  Reduced Rate
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="reduced-tax"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.taxRates.reduced}
                    onChange={(e) =>
                      handleTaxRateChange("reduced", e.target.value)
                    }
                    className="block w-24 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <span className="ml-2 text-gray-500">%</span>
                </div>
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="zero-tax"
                  className="block w-64 text-sm font-medium text-gray-700"
                >
                  Zero Rate
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="zero-tax"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.taxRates.zero}
                    onChange={(e) =>
                      handleTaxRateChange("zero", e.target.value)
                    }
                    className="block w-24 mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                  htmlFor="notifications.email"
                  className="block w-64 text-sm font-medium text-gray-700"
                >
                  Email Notifications
                </label>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="notifications.email"
                    name="notifications.email"
                    checked={settings.notifications.email}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label
                  htmlFor="notifications.sms"
                  className="block w-64 text-sm font-medium text-gray-700"
                >
                  SMS Notifications
                </label>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    id="notifications.sms"
                    name="notifications.sms"
                    checked={settings.notifications.sms}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Admin Password */}
          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Admin Password
            </h2>
            <div className="p-4 space-y-4 rounded-md bg-gray-50">
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={settings.password}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={settings.confirmPassword}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Confirm new password"
                />
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
                  htmlFor="branding.logoUrl"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Logo URL
                </label>
                <input
                  type="text"
                  id="branding.logoUrl"
                  name="branding.logoUrl"
                  value={settings.branding.logoUrl}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col">
                  <label
                    htmlFor="branding.primaryColor"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Primary Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="branding.primaryColor"
                      name="branding.primaryColor"
                      value={settings.branding.primaryColor}
                      onChange={handleChange}
                      className="block w-10 h-10 mt-1 border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={settings.branding.primaryColor}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "branding.primaryColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="block w-full ml-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="branding.secondaryColor"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Secondary Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      id="branding.secondaryColor"
                      name="branding.secondaryColor"
                      value={settings.branding.secondaryColor}
                      onChange={handleChange}
                      className="block w-10 h-10 mt-1 border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={settings.branding.secondaryColor}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "branding.secondaryColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="block w-full ml-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Preview
                </h3>
                <div className="flex space-x-4">
                  <div
                    className="flex items-center justify-center w-24 h-12 text-sm text-white rounded-md"
                    style={{ backgroundColor: settings.branding.primaryColor }}
                  >
                    Primary
                  </div>
                  <div
                    className="flex items-center justify-center w-24 h-12 text-sm text-white rounded-md"
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
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
