const UserRepository = require("../../Repository/UserRepository");
const AdminRepository = require("../../Repository/AdminRepository");
const EventRepository = require("../../Repository/EventRepository");
const PaymentRepository = require("../../Repository/PaymentRepository");
const RefundRequestRepository = require("../../Repository/RefundRequestRepository");
const bcrypt = require("bcryptjs");

// Dashboard statistics
const getDashboardStatistics = async () => {
  try {
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
      UserRepository.count(),
      UserRepository.count({ role: "organizer" }),
      EventRepository.count(),
      PaymentRepository.getStatistics({ payment_status: "completed" }),
      EventRepository.count({ event_status: "pending" }),
      RefundRequestRepository.count({ status: "pending" }),
      PaymentRepository.getRevenueByDateRange(
        new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        new Date(),
        "month"
      ),
      UserRepository.findAll(
        {},
        {
          sort: { createdAt: 1 },
          limit: 12,
        }
      ),
    ]);

    const totalRevenue = revenueData.totalRevenue || 0;

    // Process monthly sales data
    const processedMonthlySales = monthlySales.map((item) => ({
      _id: `${item._id.year}-${String(item._id.period).padStart(2, "0")}`,
      sales: item.count,
      revenue: item.revenue,
    }));

    // Process user growth data
    const monthlyUserGrowth = {};
    newUserGrowth.forEach((user) => {
      const month = new Date(user.createdAt).toISOString().slice(0, 7);
      monthlyUserGrowth[month] = (monthlyUserGrowth[month] || 0) + 1;
    });

    const processedUserGrowth = Object.entries(monthlyUserGrowth).map(
      ([month, count]) => ({ _id: month, count })
    );

    return {
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalRevenue,
      pendingEvents,
      activeRefundRequests,
      charts: {
        monthlySales: processedMonthlySales,
        newUserGrowth: processedUserGrowth,
      },
    };
  } catch (error) {
    throw new Error(`Failed to get dashboard statistics: ${error.message}`);
  }
};

// Platform settings
const getPlatformSettings = async (userId) => {
  try {
    const adminUser = await UserRepository.findById(userId);
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Not authorized as admin");
    }
    const adminProfile = await AdminRepository.findByUserId(adminUser._id);

    const settings = {
      commission: 0.1,
      taxRate: 0.07,
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
};

const updatePlatformSettings = async (userId, settingsData) => {
  try {
    const { commission, taxRate, notificationPreferences, branding } =
      settingsData;

    const adminUser = await UserRepository.findById(userId);
    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Not authorized as admin");
    }

    const adminProfile = await AdminRepository.findByUserId(adminUser._id);
    if (adminProfile && notificationPreferences) {
      await AdminRepository.updateByUserId(adminUser._id, {
        emailNotifications: {
          ...adminProfile.emailNotifications,
          systemAlerts: notificationPreferences.email,
        },
      });
    }

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
};

// Change admin password
const changeAdminPassword = async (userId, oldPassword, newPassword) => {
  try {
    if (!oldPassword || !newPassword) {
      throw new Error("All fields are required");
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "admin") {
      throw new Error("Unauthorized: User is not an admin");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.updateById(userId, { password: hashedPassword });
    await AdminRepository.updateByUserId(userId, { lastLogin: Date.now() });

    return { message: "Admin password changed successfully" };
  } catch (error) {
    throw new Error(`Failed to change admin password: ${error.message}`);
  }
};

// Get admin profile
const getAdminProfile = async (userId) => {
  try {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "admin") {
      throw new Error("User is not an admin");
    }
    const adminProfile = await AdminRepository.findByUserId(userId);
    if (!adminProfile) {
      throw new Error("Admin profile not found");
    }
    return adminProfile;
  } catch (error) {
    throw new Error(`Failed to get admin profile: ${error.message}`);
  }
};

// Update admin profile
const updateAdminProfile = async (userId, profileData) => {
  try {
    const { phone, position, department, permissions, emailNotifications } =
      profileData;

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "admin") {
      throw new Error("User is not an admin");
    }

    let adminProfile = await AdminRepository.findByUserId(userId);

    if (adminProfile) {
      const updateData = {};
      if (phone !== undefined) updateData.phone = phone;
      if (position !== undefined) updateData.position = position;
      if (department !== undefined) updateData.department = department;
      if (permissions !== undefined) {
        updateData.permissions = {
          ...adminProfile.permissions,
          ...permissions,
        };
      }
      if (emailNotifications !== undefined) {
        updateData.emailNotifications = {
          ...adminProfile.emailNotifications,
          ...emailNotifications,
        };
      }
      adminProfile = await AdminRepository.updateByUserId(userId, updateData);
    } else {
      adminProfile = await AdminRepository.create({
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
    }

    return {
      message: "Admin profile updated successfully",
      adminProfile,
    };
  } catch (error) {
    throw new Error(`Failed to update admin profile: ${error.message}`);
  }
};

// Validate admin permission
const validateAdminPermission = async (userId, permission) => {
  try {
    const adminProfile = await AdminRepository.findByUserId(userId);
    if (!adminProfile) {
      return false;
    }
    return adminProfile.permissions[permission] || false;
  } catch (error) {
    throw new Error(`Failed to validate admin permission: ${error.message}`);
  }
};

module.exports = {
  getDashboardStatistics,
  getPlatformSettings,
  updatePlatformSettings,
  changeAdminPassword,
  getAdminProfile,
  updateAdminProfile,
  validateAdminPermission,
};
