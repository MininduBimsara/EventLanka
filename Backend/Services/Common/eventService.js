const Event = require("../../models/Event");
const fs = require("fs");
const path = require("path");

/**
 * Create a new event
 * @param {Object} eventData - Event data
 * @param {Object} user - Current user
 * @param {String} bannerImageFilename - Uploaded banner image filename (optional)
 * @returns {Object} Created event
 */
const createEvent = async (eventData, user, bannerImageFilename = null) => {
  if (user.role !== "organizer") {
    throw new Error("Access Denied. Only organizers can create events.");
  }

  const {
    title,
    description,
    location,
    date,
    category,
    duration,
    ticket_types,
  } = eventData;

  if (!title || !description || !location || !date || !ticket_types) {
    throw new Error("Missing required fields.");
  }

  // Parse ticket_types if it's sent as a string
  const parsedTicketTypes =
    typeof ticket_types === "string" ? JSON.parse(ticket_types) : ticket_types;

  const newEvent = new Event({
    organizer_id: user.id,
    title,
    description,
    location,
    date,
    duration: duration || 1, // Default duration is 1 hour
    category: category || "Other", // Default category is "Other"
    ticket_types: parsedTicketTypes,
    banner: bannerImageFilename,
    event_status: "pending",
  });

  await newEvent.save();

  return {
    ...newEvent._doc,
    banner: bannerImageFilename ? `/event-images/${bannerImageFilename}` : null,
  };
};

/**
 * Get all public events
 * @returns {Array} List of public events
 */
const getPublicEvents = async () => {
  const events = await Event.find({ event_status: "approved" }).lean();

  return events.map((event) => ({
    ...event,
    banner: event.banner ? `/event-images/${event.banner}` : null,
  }));
};

/**
 * Get events based on user role
 * @param {Object} user - Current user (optional)
 * @returns {Array} List of events
 */
const getEvents = async (user) => {
  let events;

  if (user && user.role === "admin") {
    events = await Event.find(); // Admin sees all events
  } else if (user && user.role === "organizer") {
    events = await Event.find({ organizer_id: user.id }); // Organizer sees their own
  } else {
    events = await Event.find({ event_status: "approved" }); // Regular users see only approved events
  }

  return events.map((event) => ({
    ...event._doc,
    banner: event.banner ? `/event-images/${event.banner}` : null,
  }));
};

/**
 * Update an event
 * @param {String} eventId - Event ID
 * @param {Object} updateData - Updated event data
 * @param {Object} user - Current user
 * @param {String} bannerImageFilename - Uploaded banner image filename (optional)
 * @returns {Object} Updated event
 */
const updateEvent = async (
  eventId,
  updateData,
  user,
  bannerImageFilename = null
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.organizer_id.toString() !== user.id && user.role !== "admin") {
    throw new Error("Access Denied. You can only update your own events.");
  }

  // Create update data object
  const eventUpdateData = { ...updateData };

  // Add banner if provided
  if (bannerImageFilename) {
    eventUpdateData.banner = bannerImageFilename;
  }

  // Parse ticket_types if it's sent as a string
  if (
    eventUpdateData.ticket_types &&
    typeof eventUpdateData.ticket_types === "string"
  ) {
    eventUpdateData.ticket_types = JSON.parse(eventUpdateData.ticket_types);
  }

  // Reset event status to pending if organizer is updating
  if (user.role === "organizer") {
    eventUpdateData.event_status = "pending";
  }

  eventUpdateData.updatedAt = Date.now();

  const updatedEvent = await Event.findByIdAndUpdate(eventId, eventUpdateData, {
    new: true,
    runValidators: true,
  });

  return {
    ...updatedEvent._doc,
    banner: updatedEvent.banner ? `/event-images/${updatedEvent.banner}` : null,
  };
};

/**
 * Delete an event
 * @param {String} eventId - Event ID
 * @param {Object} user - Current user
 */
const deleteEvent = async (eventId, user) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  if (event.organizer_id.toString() !== user.id && user.role !== "admin") {
    throw new Error("Access Denied. You can only delete your own events.");
  }

  // Delete banner image if exists
  if (event.banner) {
    const filePath = path.join(
      __dirname,
      "../../public/event-images",
      event.banner
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await event.deleteOne();
  return { message: "Event deleted successfully!" };
};

/**
 * Get pending events (Admin only)
 * @returns {Array} List of pending events
 */
const getPendingEvents = async () => {
  return await Event.find({ event_status: "pending" });
};

/**
 * Get event by ID
 * @param {String} eventId - Event ID
 * @param {Object} user - Current user (optional)
 * @returns {Object} Event data
 */
const getEventById = async (eventId, user = null) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  // For non-admin/non-organizers, only show approved events
  if (
    (!user || (user.role !== "admin" && user.role !== "organizer")) &&
    event.event_status !== "approved"
  ) {
    throw new Error("This event is not available for booking");
  }

  // For organizers, only show their own events or approved events
  if (
    user &&
    user.role === "organizer" &&
    event.organizer_id.toString() !== user.id &&
    event.event_status !== "approved"
  ) {
    throw new Error("This event is not available for booking");
  }

  return {
    ...event._doc,
    banner: event.banner ? `/event-images/${event.banner}` : null,
    bookingAvailable: event.event_status === "approved",
  };
};

/**
 * Update event status
 * @param {String} eventId - Event ID
 * @param {String} status - New status ('approved' or 'rejected')
 */
const updateEventStatus = async (eventId, status) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  event.event_status = status;
  await event.save();

  return { message: `Event ${status} successfully!` };
};

module.exports = {
  createEvent,
  getPublicEvents,
  getEvents,
  updateEvent,
  deleteEvent,
  getPendingEvents,
  getEventById,
  updateEventStatus,
};
