const User = require("../../models/User");
const Admin = require("../../models/Admin");
const Event = require("../../models/Event");
const Payment = require("../../models/Payment");
const RefundRequest = require("../../models/RefundRequest");
const bcrypt = require("bcryptjs");

class AdminService {
  /**
   * Get dashboard statistics
   * @returns {Object} Dashboard statistics including users, events, revenue, etc.
   */
  async getDashboardStatistics() {
    try {
      // Run all queries in parallel for better performance
      const [
        totalUsers,
        totalOrganizers,
        totalEvents,
        revenueData,
        pendingEvents,
        activeRefundRequests,
        monthlySales,
        newUserGrowth,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "organizer" }),
        Event.countDocuments(),
        Payment.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Event.countDocuments({ event_status: "pending" }),
        RefundRequest.countDocuments({ status: "pending" }),
        Payment.aggregate([
          { $match: { status: "completed" } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              sales: { $sum: 1 },
              revenue: { $sum: "$amount" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        User.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

      const totalRevenue = revenueData[0]?.total || 0;

      return {
        totalUsers,
        totalOrganizers,
        totalEvents,
        totalRevenue,
        pendingEvents,
        activeRefundRequests,
        charts: { monthlySales, newUserGrowth },
      };
    } catch (error) {
      throw new Error(`Failed to get dashboard statistics: ${error.message}`);
    }
  }

  /**
   * Get platform settings
   * @param {string} userId - Admin user ID
   * @returns {Object} Platform settings
   */
  async getPlatformSettings(userId) {
    try {
      // Verify admin user
      const adminUser = await User.findById(userId);
      if (!adminUser || adminUser.role !== "admin") {
        throw new Error("Not authorized as admin");
      }

      // Find the admin profile
      const adminProfile = await Admin.findOne({ user: adminUser._id });

      // Get global platform settings
      // In a real app, this would come from a Settings model
      const settings = {
        commission: 0.1, // 10%
        taxRate: 0.07, // 7%
        notificationPreferences: {
          email: adminProfile?.emailNotifications?.systemAlerts || true,
          sms: false,
        },
        branding: {
          logo: "/logo.png",
          theme: "default",
          primaryColor: "#3B82F6",
          secondaryColor: "#1E40AF",
        },
      };

      return settings;
    } catch (error) {
      throw new Error(`Failed to get platform settings: ${error.message}`);
    }
  }

  /**
   * Update platform settings
   * @param {string} userId - Admin user ID
   * @param {Object} settingsData - Settings to update
   * @returns {Object} Updated settings
   */
  async updatePlatformSettings(userId, settingsData) {
    try {
      const { commission, taxRate, notificationPreferences, branding } =
        settingsData;

      // Verify admin user
      const adminUser = await User.findById(userId);
      if (!adminUser || adminUser.role !== "admin") {
        throw new Error("Not authorized as admin");
      }

      // Update admin profile notification preferences
      const adminProfile = await Admin.findOne({ user: adminUser._id });
      if (adminProfile && notificationPreferences) {
        adminProfile.emailNotifications = {
          ...adminProfile.emailNotifications,
          systemAlerts: notificationPreferences.email,
        };
        await adminProfile.save();
      }

      // Return updated settings (in real app, would update Settings model)
      const updatedSettings = {
        commission: commission !== undefined ? commission : 0.1,
        taxRate: taxRate !== undefined ? taxRate : 0.07,
        notificationPreferences: notificationPreferences || {
          email: true,
          sms: false,
        },
        branding: branding || {
          logo: "/logo.png",
          theme: "default",
          primaryColor: "#3B82F6",
          secondaryColor: "#1E40AF",
        },
      };

      return updatedSettings;
    } catch (error) {
      throw new Error(`Failed to update platform settings: ${error.message}`);
    }
  }

  /**
   * Change admin password
   * @param {string} userId - Admin user ID
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   */
  async changeAdminPassword(userId, oldPassword, newPassword) {
    try {
      // Validate input
      if (!oldPassword || !newPassword) {
        throw new Error("All fields are required");
      }

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is admin
      if (user.role !== "admin") {
        throw new Error("Unauthorized: User is not an admin");
      }

      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      user.password = hashedPassword;
      await user.save();

      // Update last login in admin profile
      const adminProfile = await Admin.findOne({ user: userId });
      if (adminProfile) {
        adminProfile.lastLogin = Date.now();
        await adminProfile.save();
      }

      return { message: "Admin password changed successfully" };
    } catch (error) {
      throw new Error(`Failed to change admin password: ${error.message}`);
    }
  }

  /**
   * Get admin profile
   * @param {string} userId - Admin user ID
   * @returns {Object} Admin profile
   */
  async getAdminProfile(userId) {
    try {
      // Verify user exists and is admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.role !== "admin") {
        throw new Error("User is not an admin");
      }

      // Find admin profile
      const adminProfile = await Admin.findOne({ user: userId });
      if (!adminProfile) {
        throw new Error("Admin profile not found");
      }

      return adminProfile;
    } catch (error) {
      throw new Error(`Failed to get admin profile: ${error.message}`);
    }
  }

  /**
   * Update admin profile
   * @param {string} userId - Admin user ID
   * @param {Object} profileData - Profile data to update
   * @returns {Object} Updated admin profile
   */
  async updateAdminProfile(userId, profileData) {
    try {
      const { phone, position, department, permissions, emailNotifications } =
        profileData;

      // Verify user exists and is admin
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (user.role !== "admin") {
        throw new Error("User is not an admin");
      }

      // Find existing admin profile or create new one
      let adminProfile = await Admin.findOne({ user: userId });

      if (adminProfile) {
        // Update existing profile
        if (phone !== undefined) adminProfile.phone = phone;
        if (position !== undefined) adminProfile.position = position;
        if (department !== undefined) adminProfile.department = department;
        if (permissions !== undefined) {
          adminProfile.permissions = {
            ...adminProfile.permissions,
            ...permissions,
          };
        }
        if (emailNotifications !== undefined) {
          adminProfile.emailNotifications = {
            ...adminProfile.emailNotifications,
            ...emailNotifications,
          };
        }

        await adminProfile.save();
      } else {
        // Create new admin profile
        adminProfile = new Admin({
          user: userId,
          phone: phone || "",
          position: position || "System Administrator",
          department: department || "IT",
          permissions: permissions || {
            manageUsers: true,
            manageEvents: true,
            managePayments: true,
            manageRefunds: true,
            managePlatformSettings: true,
          },
          emailNotifications: emailNotifications || {
            newUsers: true,
            newEvents: true,
            refundRequests: true,
            systemAlerts: true,
          },
        });

        await adminProfile.save();
      }

      return {
        message: "Admin profile updated successfully",
        adminProfile,
      };
    } catch (error) {
      throw new Error(`Failed to update admin profile: ${error.message}`);
    }
  }

  /**
   * Validate admin permissions
   * @param {string} userId - Admin user ID
   * @param {string} permission - Permission to check
   * @returns {boolean} Whether admin has permission
   */
  async validateAdminPermission(userId, permission) {
    try {
      const adminProfile = await Admin.findOne({ user: userId });
      if (!adminProfile) {
        return false;
      }

      return adminProfile.permissions[permission] || false;
    } catch (error) {
      throw new Error(`Failed to validate admin permission: ${error.message}`);
    }
  }
}

module.exports = new AdminService();
