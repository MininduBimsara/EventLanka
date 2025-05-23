const User = require("../../models/User");
const Organizer = require("../../models/Organizer");
const Event = require("../../models/Event");
const Ticket = require("../../models/Ticket");
const bcrypt = require("bcryptjs");

class OrganizerService {
  /**
   * Get organizer profile by user ID
   * @param {string} userId - User ID
   * @returns {Object} Combined organizer and user data
   */
  async getOrganizerProfile(userId) {
    const organizer = await Organizer.findOne({
      user: userId,
    }).populate("user", "-password");

    if (!organizer) {
      throw new Error("Organizer not found");
    }

    // Combine user and organizer data
    return {
      ...organizer.user._doc,
      ...organizer._doc,
      id: organizer.user._id,
    };
  }

  /**
   * Update organizer profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @param {string} profileImageFilename - Profile image filename if uploaded
   * @returns {Object} Updated organizer data
   */
  async updateOrganizerProfile(
    userId,
    updateData,
    profileImageFilename = null
  ) {
    // Extract fields to update in User model
    const userUpdates = {};
    const userFields = ["username", "email"];

    userFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        userUpdates[field] = updateData[field];
      }
    });

    // Handle profile image if uploaded
    if (profileImageFilename) {
      userUpdates.profileImage = profileImageFilename;
    }

    // Update User document if needed
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, userUpdates);
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
      if (updateData[field] !== undefined) {
        organizerUpdates[field] = updateData[field];
      }
    });

    // Find and update or create organizer profile
    let organizer = await Organizer.findOne({ user: userId });

    if (organizer) {
      // Update existing organizer document
      organizer = await Organizer.findOneAndUpdate(
        { user: userId },
        organizerUpdates,
        { new: true }
      ).populate("user", "-password");
    } else {
      // Create new organizer document if doesn't exist
      organizerUpdates.user = userId;
      organizer = new Organizer(organizerUpdates);
      await organizer.save();
      organizer = await Organizer.findOne({ user: userId }).populate(
        "user",
        "-password"
      );
    }

    // Combine user and organizer data
    return {
      ...organizer.user._doc,
      ...organizer._doc,
      id: organizer.user._id,
    };
  }

  /**
   * Update organizer settings
   * @param {string} userId - User ID
   * @param {Object} settingsData - Settings data to update
   * @returns {Object} Updated user data
   */
  async updateOrganizerSettings(userId, settingsData) {
    const {
      notificationPreferences,
      paymentDetails,
      displayName,
      defaultEventSettings,
    } = settingsData;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        notificationPreferences,
        paymentDetails,
        displayName,
        defaultEventSettings,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  /**
   * Get dashboard data for organizer
   * @param {string} userId - User ID
   * @returns {Object} Dashboard data
   */
  async getDashboardData(userId) {
    // Get organizer's events
    const events = await Event.find({ organizer_id: userId });

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
    const salesByEvent = this._calculateSalesByEvent(tickets, events);

    // Format dashboard data
    return {
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
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
  }

  /**
   * Get all organizers with complete profiles
   * @returns {Array} Array of organizer data
   */
  async getAllOrganizers() {
    const organizers = await Organizer.find().populate("user", "-password");

    return organizers.map((organizer) => ({
      ...organizer.user._doc,
      ...organizer._doc,
      id: organizer.user._id,
    }));
  }

  /**
   * Private method to calculate sales by event
   * @param {Array} tickets - Array of tickets
   * @param {Array} events - Array of events
   * @returns {Object} Sales data grouped by event
   */
  _calculateSalesByEvent(tickets, events) {
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

    return salesByEvent;
  }
}

module.exports = new OrganizerService();
