const User = require("../../models/User");
const Event = require("../../models/Event");
const Ticket = require("../../models/Ticket");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// Get organizer profile
exports.getProfile = asyncHandler(async (req, res) => {
  try {
    // User is already authenticated, so we can use req.user
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "organizer") {
      return res
        .status(403)
        .json({ message: "Access denied. Not an organizer account." });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update organizer profile
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const { username, email, bio, contactInfo, socialLinks } = req.body;

    // Find user and update profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        email,
        bio,
        contactInfo,
        socialLinks,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update organizer settings
exports.updateSettings = asyncHandler(async (req, res) => {
  try {
    const {
      notificationPreferences,
      paymentDetails,
      displayName,
      defaultEventSettings,
    } = req.body;

    // Find user and update settings
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        notificationPreferences,
        paymentDetails,
        displayName,
        defaultEventSettings,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Settings updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard data
exports.dashboard = asyncHandler(async (req, res) => {
  try {
    // Get organizer's events
    const events = await Event.find({ organizer_id: req.user.id });

    // Get event IDs
    const eventIds = events.map((event) => event._id);

    // Get tickets sold for these events
    const tickets = await Ticket.find({
      event_id: { $in: eventIds },
      payment_status: "paid",
    });

    // Calculate total revenue
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

    // Calculate tickets sold
    const ticketsSold = tickets.reduce(
      (sum, ticket) => sum + ticket.quantity,
      0
    );

    // Get upcoming events (events with date in the future)
    const upcomingEvents = events
      .filter((event) => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Get top 5

    // Get recent ticket sales
    const recentSales = await Ticket.find({ event_id: { $in: eventIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("event_id", "title")
      .populate("user_id", "username email");

    // Calculate sales by event
    const salesByEvent = {};
    tickets.forEach((ticket) => {
      const eventId = ticket.event_id.toString();
      if (!salesByEvent[eventId]) {
        salesByEvent[eventId] = {
          count: 0,
          revenue: 0,
        };
      }
      salesByEvent[eventId].count += ticket.quantity;
      salesByEvent[eventId].revenue += ticket.price;
    });

    // Add event details to salesByEvent
    for (const eventId in salesByEvent) {
      const event = events.find((e) => e._id.toString() === eventId);
      if (event) {
        salesByEvent[eventId].title = event.title;
        salesByEvent[eventId].date = event.date;
      }
    }

    // Format dashboard data
    const dashboardData = {
      totalEvents: events.length,
      totalRevenue,
      ticketsSold,
      upcomingEvents: upcomingEvents.map((event) => ({
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        ticketTypes: event.ticket_types,
      })),
      recentSales: recentSales.map((sale) => ({
        id: sale._id,
        eventTitle: sale.event_id.title,
        customerEmail: sale.user_id.email,
        customerName: sale.user_id.username,
        quantity: sale.quantity,
        price: sale.price,
        purchaseDate: sale.createdAt,
      })),
      salesByEvent: Object.values(salesByEvent).sort(
        (a, b) => b.revenue - a.revenue
      ),
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    // Find user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = exports;
