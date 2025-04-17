const User = require("../../models/User");
const Event = require("../../models/Event");
const Payment = require("../../models/Payment");
const RefundRequest = require("../../models/RefundRequest");
const bcrypt = require("bcryptjs");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await User.countDocuments({ role: "organizer" }); // Assuming 'role' field distinguishes organizers
    const totalEvents = await Event.countDocuments();
    const totalRevenue =
      (
        await Payment.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ])
      )[0]?.total || 0;
    const pendingEvents = await Event.countDocuments({
      event_status: "pending",
    });
    const activeRefundRequests = await RefundRequest.countDocuments({
      status: "pending",
    });

    const monthlySales = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const newUserGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalRevenue,
      pendingEvents,
      activeRefundRequests,
      charts: { monthlySales, newUserGrowth },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error in dashboard stats" });
  }
};

// Dummy in-memory settings
let platformSettings = {
  commission: 0.1,
  taxRate: 0.07,
  notificationPreferences: { email: true, sms: false },
  branding: { logo: "", theme: "default" },
};

exports.getSettings = (req, res) => res.json(platformSettings);

exports.updateSettings = (req, res) => {
  const { commission, taxRate, notificationPreferences, branding } = req.body;
  if (commission !== undefined) platformSettings.commission = commission;
  if (taxRate !== undefined) platformSettings.taxRate = taxRate;
  if (notificationPreferences)
    platformSettings.notificationPreferences = notificationPreferences;
  if (branding) platformSettings.branding = branding;
  res.json({ message: "Settings updated", settings: platformSettings });
};

exports.changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Extract userId from the JWT token (assuming it's stored in req.user)
    const userId = req.user.id;
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Unauthorized: User is not an admin" });
    }

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Admin password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while changing password" });
  }
};
