const User = require("../../models/User");
const Organizer = require("../../models/Organizer");
const Event = require("../../models/Event");
const Ticket = require("../../models/Ticket");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// Get organizer profile

exports.getProfile = asyncHandler(async (req, res) => {
  try {
    const organizer = await Organizer.findOne({
      user: req.user.id,  // Changed from req.params.id
    }).populate("user", "-password");

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Combine user and organizer data
    const organizerData = {
      ...organizer.user._doc,
      ...organizer._doc,
      id: organizer.user._id,
    };

    res.status(200).json(organizerData);
  } catch (error) {
    console.error("Error fetching organizer profile:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update organizer profile
exports.updateProfile = async (req, res) => {
  try {
    // Extract fields to update in User model
    const userUpdates = {};
    const userFields = ["username", "email"];

    userFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        userUpdates[field] = req.body[field];
      }
    });

    // Handle profile image if uploaded
    if (req.file) {
      userUpdates.profileImage = req.file.filename;
    }

    // Update User document if needed
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user.id, userUpdates);
    }

    // Extract organizer-specific fields
    const organizerUpdates = {};
    const organizerFields = [
      "phone",
      "bio",
      "website",
      "instagram",
      "facebook",
      "linkedin",
      "categories",
      "isPublic",
    ];

    organizerFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        organizerUpdates[field] = req.body[field];
      }
    });

    // Find and update or create organizer profile
    let organizer = await Organizer.findOne({ user: req.user.id });

    if (organizer) {
      // Update existing organizer document
      organizer = await Organizer.findOneAndUpdate(
        { user: req.user.id },
        organizerUpdates,
        { new: true }
      ).populate("user", "-password");
    } else {
      // Create new organizer document if doesn't exist
      organizerUpdates.user = req.user.id;
      organizer = new Organizer(organizerUpdates);
      await organizer.save();
      organizer = await Organizer.findOne({ user: req.user.id }).populate(
        "user",
        "-password"
      );
    }

    // Combine user and organizer data
    const updatedOrganizerData = {
      ...organizer.user._doc,
      ...organizer._doc,
      id: organizer.user._id,
    };

    res.status(200).json({
      message: "Profile updated successfully",
      organizer: updatedOrganizerData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

// Get all organizers with complete profiles
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find().populate('user', '-password');
    
    const organizerData = organizers.map(organizer => ({
      ...organizer.user._doc,
      ...organizer._doc,
      id: organizer.user._id
    }));
    
    res.status(200).json(organizerData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Admin functionality: Get all organizers
// exports.getAllOrganizers = async (req, res) => {
//   try {
//     const organizers = await Organizer.find().populate('user', '-password');
    
//     const organizerData = organizers.map(organizer => ({
//       ...organizer.user._doc,
//       ...organizer._doc,
//       id: organizer.user._id
//     }));
    
//     res.status(200).json(organizerData);
//   } catch (error) {
//     console.error("Error fetching all organizers:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get organizer by ID
// exports.getOrganizerById = async (req, res) => {
//   try {
//     const organizer = await Organizer.findOne({
//       user: req.params.id
//     }).populate('user', '-password');
    
//     if (!organizer) {
//       return res.status(404).json({ message: "Organizer not found" });
//     }

//     // Combine user and organizer data
//     const organizerData = {
//       ...organizer.user._doc,
//       ...organizer._doc,
//       id: organizer.user._id
//     };
    
//     res.status(200).json(organizerData);
//   } catch (error) {
//     console.error("Error fetching organizer by ID:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update organizer status (for admin)
// exports.updateOrganizerStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     if (!status || !['active', 'banned'].includes(status)) {
//       return res.status(400).json({ message: "Valid status is required" });
//     }
    
//     // Update user status
//     await User.findByIdAndUpdate(req.params.id, { status });
    
//     res.status(200).json({ message: "Organizer status updated successfully" });
//   } catch (error) {
//     console.error("Error updating organizer status:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

module.exports = exports;
