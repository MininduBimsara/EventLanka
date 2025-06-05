const UserRepository = require("../../Repository/UserRepository");
const OrganizerRepository = require("../../Repository/OrganizerRepository");
const EventRepository = require("../../Repository/EventRepository");
const TicketRepository = require("../../Repository/TicketRepository");
const bcrypt = require("bcryptjs");

/**
 * Get organizer profile by user ID
 * @param {string} userId - User ID
 * @returns {Object} Combined organizer and user data
 */
async function getOrganizerProfile(userId) {
  const organizer = await OrganizerRepository.findByUserId(userId);

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Get user data separately
  const user = await UserRepository.findById(userId);

  // Combine user and organizer data
  return {
    ...user._doc,
    ...organizer._doc,
    id: user._id,
  };
}

/**
 * Update organizer profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @param {string} profileImageFilename - Profile image filename if uploaded
 * @returns {Object} Updated organizer data
 */
async function updateOrganizerProfile(
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
    await UserRepository.updateById(userId, userUpdates);
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
  let organizer = await OrganizerRepository.findByUserId(userId);

  if (organizer) {
    // Update existing organizer document
    organizer = await OrganizerRepository.updateByUserId(
      userId,
      organizerUpdates
    );
  } else {
    // Create new organizer document if doesn't exist
    organizerUpdates.user = userId;
    organizer = await OrganizerRepository.create(organizerUpdates);
  }

  // Get updated user data
  const user = await UserRepository.findById(userId);

  // Combine user and organizer data
  return {
    ...user._doc,
    ...organizer._doc,
    id: user._id,
  };
}

/**
 * Update organizer settings
 * @param {string} userId - User ID
 * @param {Object} settingsData - Settings data to update
 * @returns {Object} Updated user data
 */
async function updateOrganizerSettings(userId, settingsData) {
  const {
    notificationPreferences,
    paymentDetails,
    displayName,
    defaultEventSettings,
  } = settingsData;

  const updatedUser = await UserRepository.updateById(userId, {
    notificationPreferences,
    paymentDetails,
    displayName,
    defaultEventSettings,
  });

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
async function getDashboardData(userId) {
  // Get organizer's events
  const events = await EventRepository.findByOrganizerId(userId);

  // Get event IDs
  const eventIds = events.map((event) => event._id);

  // Get tickets sold for these events
  const tickets = await TicketRepository.findAll({
    event_id: { $in: eventIds },
    payment_status: "paid",
  });

  // Calculate total revenue
  const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

  // Calculate tickets sold
  const ticketsSold = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

  // Get upcoming events (events with date in the future)
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Get top 5

  // Get recent ticket sales
  const recentSales = await TicketRepository.findAll(
    { event_id: { $in: eventIds } },
    {
      sort: { createdAt: -1 },
      limit: 10,
      populate: { event: true, user: true },
    }
  );

  // Calculate sales by event
  const salesByEvent = calculateSalesByEvent(tickets, events);

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
async function changePassword(userId, currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  // Find user
  const user = await UserRepository.findById(userId);

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
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await UserRepository.updateById(userId, { password: hashedPassword });
}

/**
 * Get all organizers with complete profiles
 * @returns {Array} Array of organizer data
 */
async function getAllOrganizers() {
  const organizers = await OrganizerRepository.findPublic({
    populate: "user",
  });

  return organizers.map((organizer) => ({
    ...organizer.user._doc,
    ...organizer._doc,
    id: organizer.user._id,
  }));
}

/**
 * Helper function to calculate sales by event
 * @param {Array} tickets - Array of tickets
 * @param {Array} events - Array of events
 * @returns {Object} Sales data grouped by event
 */
function calculateSalesByEvent(tickets, events) {
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

module.exports = {
  getOrganizerProfile,
  updateOrganizerProfile,
  updateOrganizerSettings,
  getDashboardData,
  changePassword,
  getAllOrganizers,
  calculateSalesByEvent,
};
