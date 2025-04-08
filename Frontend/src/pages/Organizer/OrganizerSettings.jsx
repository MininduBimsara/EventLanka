import { useState } from "react";
import {
  Bell,
  CreditCard,
  Lock,
  User,
  LogOut,
  Eye,
  EyeOff,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const OrganizerSettings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [emailData, setEmailData] = useState({
    email: "organizer@example.com",
    newEmail: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    newEvent: true,
    registrations: true,
    payouts: true,
    systemUpdates: false,
  });

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  const Tab = ({ id, label, icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center px-4 py-3 w-full ${
          isActive
            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </button>
    );
  };

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Change Email
              </h3>
              <div className="p-6 space-y-4 bg-white border border-gray-200 rounded-lg">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Current Email
                  </label>
                  <input
                    type="email"
                    value={emailData.email}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    New Email
                  </label>
                  <input
                    type="email"
                    name="newEmail"
                    value={emailData.newEmail}
                    onChange={handleEmailChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Update Email
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Change Password
              </h3>
              <div className="p-6 space-y-4 bg-white border border-gray-200 rounded-lg">
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-2 top-2.5 text-gray-500"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  Update Password
                </button>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Delete Account
              </h3>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-start p-4 mb-4 space-x-3 rounded-md bg-red-50">
                  <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm text-red-700">
                      Deleting your account is permanent and cannot be undone.
                      All your data will be permanently removed.
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Notification Settings
            </h3>
            <div className="p-6 space-y-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h4 className="font-medium">Notification Channels</h4>
                  <p className="text-sm text-gray-500">
                    Choose how you'd like to receive notifications
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive notifications on your device
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.push}
                    onChange={() => handleNotificationChange("push")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.email}
                    onChange={() => handleNotificationChange("email")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-4 mt-2 border-t">
                <h4 className="mb-3 font-medium">Notification Types</h4>

                <div className="flex items-center justify-between py-2">
                  <p>New event notifications</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newEvent}
                      onChange={() => handleNotificationChange("newEvent")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2">
                  <p>Registration updates</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.registrations}
                      onChange={() => handleNotificationChange("registrations")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2">
                  <p>Payout notifications</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.payouts}
                      onChange={() => handleNotificationChange("payouts")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-2">
                  <p>System updates</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.systemUpdates}
                      onChange={() => handleNotificationChange("systemUpdates")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Save Preferences
              </button>
            </div>
          </div>
        );
      case "payouts":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Payout Settings
            </h3>
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
              <div className="mb-6">
                <h4 className="mb-4 font-medium">Connected Accounts</h4>
                <div className="flex items-center justify-between p-4 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <CreditCard className="mr-3 text-gray-600" />
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-gray-500">
                        Connected on Apr 3, 2025
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    Update
                  </button>
                </div>
              </div>

              <div>
                <h4 className="mb-4 font-medium">Recent Payouts</h4>
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          Apr 1, 2025
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          $1,240.00
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          Mar 15, 2025
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          $890.50
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          Mar 1, 2025
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          $1,050.75
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <a
                            href="#"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <button className="flex items-center text-blue-600">
                    View all payouts
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Security Settings
            </h3>
            <div className="p-6 space-y-6 bg-white border border-gray-200 rounded-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Enable 2FA
                  </button>
                </div>
                <div className="p-4 text-sm text-blue-800 rounded-md bg-blue-50">
                  <p>
                    Two-factor authentication adds an extra layer of security to
                    your account by requiring more than just a password to sign
                    in.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h4 className="mb-4 font-medium">Recent Login Activity</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500">
                        Apr 8, 2025 • 10:32 AM • New York, USA
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                      Active Now
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                    <div>
                      <p className="font-medium">Chrome on Windows</p>
                      <p className="text-sm text-gray-500">
                        Apr 7, 2025 • 3:15 PM • New York, USA
                      </p>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-800">
                      End Session
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                    <div>
                      <p className="font-medium">Safari on iPhone</p>
                      <p className="text-sm text-gray-500">
                        Apr 6, 2025 • 9:45 AM • New York, USA
                      </p>
                    </div>
                    <button className="text-sm text-red-600 hover:text-red-800">
                      End Session
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="flex items-center text-blue-600">
                    View full activity log
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">Sign Out Everywhere</h4>
                    <p className="text-sm text-gray-500">
                      Log out from all devices
                    </p>
                  </div>
                  <button className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50">
                    <LogOut size={16} className="mr-2" />
                    Sign out all devices
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  This will end all active sessions except your current one.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Account Settings
          </h1>

          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            {/* Sidebar Navigation */}
            <div className="w-full overflow-hidden bg-white border border-gray-200 rounded-lg md:w-64">
              <nav className="flex flex-col">
                <Tab
                  id="account"
                  label="Account Settings"
                  icon={<User size={20} />}
                />
                <Tab
                  id="notifications"
                  label="Notification Settings"
                  icon={<Bell size={20} />}
                />
                <Tab
                  id="payouts"
                  label="Payout Settings"
                  icon={<CreditCard size={20} />}
                />
                <Tab
                  id="security"
                  label="Security Settings"
                  icon={<Lock size={20} />}
                />
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerSettings;
