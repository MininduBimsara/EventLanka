const User = require("../models/User");
const Event = require("../models/Event");
const Payment = require("../models/Payment");
const RefundRequest = require("../models/RefundRequest");

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

exports.changeAdminPassword = (req, res) => {
  res.json({ message: "Admin password changed (dummy)" });
};
