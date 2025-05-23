const eventService = require("../../Services/Common/eventService");

// Create a new event (Only Organizer)
exports.createEvent = async (req, res) => {
  try {
    const bannerImage = req.file ? req.file.filename : null;

    const event = await eventService.createEvent(
      req.body,
      req.user,
      bannerImage
    );

    res.status(201).json({
      message: "Event created successfully!",
      event,
    });
  } catch (error) {
    res.status(error.message.includes("Access Denied") ? 403 : 400).json({
      message: error.message,
    });
  }
};

exports.getPublicEvents = async (req, res) => {
  try {
    const events = await eventService.getPublicEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all events (Admin sees all, Organizers see their own, Users see only approved events)
exports.getEvents = async (req, res) => {
  try {
    const events = await eventService.getEvents(req.user);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update an event (Only Organizer who created it)
exports.updateEvent = async (req, res) => {
  try {
    const bannerImage = req.file ? req.file.filename : null;

    const updatedEvent = await eventService.updateEvent(
      req.params.id,
      req.body,
      req.user,
      bannerImage
    );

    res.status(200).json({
      message: "Event updated successfully!",
      event: updatedEvent,
    });
  } catch (error) {
    const statusCode = error.message.includes("Access Denied")
      ? 403
      : error.message.includes("not found")
      ? 404
      : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

// Delete an event (Only Organizer who created it)
exports.deleteEvent = async (req, res) => {
  try {
    const result = await eventService.deleteEvent(req.params.id, req.user);
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("Access Denied")
      ? 403
      : error.message.includes("not found")
      ? 404
      : 500;

    res.status(statusCode).json({ message: error.message });
  }
};

// Get pending events (Admin)
exports.listPendingEvents = async (req, res) => {
  try {
    const pendingEvents = await eventService.getPendingEvents();
    res.status(200).json(pendingEvents);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get event by ID (Public - with proper data handling)
exports.getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id, req.user);
    res.status(200).json(event);
  } catch (error) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("not available")
      ? 403
      : 500;

    res.status(statusCode).json({
      message: error.message,
      bookingAvailable: false,
    });
  }
};

// Approve event (Admin)
exports.approveEvent = async (req, res) => {
  try {
    const result = await eventService.updateEventStatus(
      req.params.id,
      "approved"
    );
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};

// Reject event (Admin)
exports.rejectEvent = async (req, res) => {
  try {
    const result = await eventService.updateEventStatus(
      req.params.id,
      "rejected"
    );
    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ message: error.message });
  }
};
