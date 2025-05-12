const Event = require("../../models/Event");

// Create a new event (Only Organizer)
exports.createEvent = async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res
        .status(403)
        .json({ message: "Access Denied. Only organizers can create events." });
    }

    const {
      title,
      description,
      location,
      date,
      category,
      duration,
      ticket_types,
    } = req.body;

    const bannerImage = req.file ? req.file.filename : null;

    // ✅ Removed bannerImage from required field check
    if (!title || !description || !location || !date || !ticket_types) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Parse ticket_types if it's sent as a string
    const parsedTicketTypes =
      typeof ticket_types === "string"
        ? JSON.parse(ticket_types)
        : ticket_types;

    const newEvent = new Event({
      organizer_id: req.user.id,
      title,
      description,
      location,
      date,
      duration: duration || 1, // Default duration is 1 hour
      category: category || "Other", // Default category is "Other"
      ticket_types: parsedTicketTypes,
      banner: bannerImage, // 👈 null if no image uploaded
      event_status: "pending",
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully!",
      event: {
        ...newEvent._doc,
        banner: bannerImage ? `/event-images/${bannerImage}` : null, // 👈 handle null case in response
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find({ event_status: "approved" }).lean();

    // Transform banner URLs to be fully qualified
    const transformedEvents = events.map((event) => ({
      ...event,
      banner: event.banner ? `/event-images/${event.banner}` : null,
    }));

    res.status(200).json(transformedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// Get all events (Admin sees all, Organizers see their own, Users see only approved events)
exports.getEvents = async (req, res) => {
  try {
    let events;

    // Check if req.user exists before accessing its properties
    if (req.user && req.user.role === "admin") {
      events = await Event.find(); // Admin sees all events
    } else if (req.user && req.user.role === "organizer") {
      events = await Event.find({ organizer_id: req.user.id }); // Organizer sees their own
    } else {
      events = await Event.find({ event_status: "approved" }); // Regular users see only approved events
    }

    // Transform banner URLs to be fully qualified
    const transformedEvents = events.map((event) => ({
      ...event._doc,
      banner: event.banner ? `/event-images/${event.banner}` : null,
    }));

    res.status(200).json(transformedEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update an event (Only Organizer who created it)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.organizer_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access Denied. You can only update your own events.",
      });
    }

    // Handle file upload if there's a new banner
    const updateData = { ...req.body };

    if (req.file) {
      updateData.banner = req.file.filename;
    }

    // Parse ticket_types if it's sent as a string
    if (
      updateData.ticket_types &&
      typeof updateData.ticket_types === "string"
    ) {
      updateData.ticket_types = JSON.parse(updateData.ticket_types);
    }

    if (req.user.role === "organizer") {
      updateData.event_status = "pending"; // Re-review after changes
    }

    updateData.updatedAt = Date.now(); // Update the timestamp

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Ensure validation is applied
    );

    res.status(200).json({
      message: "Event updated successfully!",
      event: {
        ...updatedEvent._doc,
        banner: updatedEvent.banner
          ? `/event-images/${updatedEvent.banner}`
          : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete an event (Only Organizer who created it)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.organizer_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access Denied. You can only delete your own events.",
      });
    }

    //You might want to handle file deletion here
    const fs = require('fs');
    const path = require('path');
    if (event.banner) {
      const filePath = path.join(__dirname, '../../public/event-images', event.banner);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get pending events (Admin)
exports.listPendingEvents = async (req, res) => {
  try {
    const pendingEvents = await Event.find({ event_status: "pending" });
    res.status(200).json(pendingEvents);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get event by ID (Admin)
// Get event by ID (Public - with proper data handling)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // For non-admin/non-organizers, only show approved events
    if (
      (!req.user || (req.user.role !== "admin" && req.user.role !== "organizer")) && 
      event.event_status !== "approved"
    ) {
      return res.status(403).json({ 
        message: "This event is not available for booking",
        bookingAvailable: false
      });
    }
    
    // For organizers, only show their own events or approved events
    if (
      req.user && 
      req.user.role === "organizer" && 
      event.organizer_id.toString() !== req.user.id && 
      event.event_status !== "approved"
    ) {
      return res.status(403).json({ 
        message: "This event is not available for booking",
        bookingAvailable: false
      });
    }
    
    // Transform banner URL
    const transformedEvent = {
      ...event._doc,
      banner: event.banner ? `/event-images/${event.banner}` : null,
      bookingAvailable: event.event_status === "approved"
    };
    
    res.status(200).json(transformedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Approve event (Admin)
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.event_status = "approved";
    await event.save();
    res.status(200).json({ message: "Event approved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Reject event (Admin)
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.event_status = "rejected";
    await event.save();
    res.status(200).json({ message: "Event rejected successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
