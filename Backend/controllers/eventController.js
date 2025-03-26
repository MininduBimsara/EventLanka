const Event = require("../models/Event");

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
      ticket_types,
      banner,
      category,
      duration,
    } = req.body;

    // Validate required fields
    if (!title || !description || !location || !date) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newEvent = new Event({
      organizer_id: req.user.id,
      title,
      description,
      location,
      date,
      duration: duration || 1, // Default duration is 1 hour
      category: category || "Other", // Default category is "Other"
      ticket_types,
      banner,
      event_status: "pending",
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully!", event: newEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get all events (Admin sees all, Organizers see their own, Users see only approved events)
exports.getEvents = async (req, res) => {
  try {
    let events;

    if (req.user.role === "admin") {
      events = await Event.find(); // Admin sees all events
    } else if (req.user.role === "organizer") {
      events = await Event.find({ organizer_id: req.user.id }); // Organizer sees their own
    } else {
      events = await Event.find({ event_status: "approved" }); // Regular users see only approved events
    }

    res.status(200).json(events);
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

    if (event.organizer_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access Denied. You can only update your own events.",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Ensure validation is applied
    );

    res
      .status(200)
      .json({ message: "Event updated successfully!", event: updatedEvent });
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

    if (event.organizer_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Access Denied. You can only delete your own events.",
      });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
