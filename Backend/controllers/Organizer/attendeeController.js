const Ticket = require("../../models/Ticket");
const Event = require("../../models/Event");
const asyncHandler = require("express-async-handler");

// Get all attendees for a specific event
exports.getByEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  // Check if user is authorized (event organizer or admin)
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (
    event.organizer_id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access attendee list" });
  }

  const tickets = await Ticket.find({ event_id: eventId })
    .populate("user_id", "username email")
    .select("user_id ticket_type quantity attendance_status check_in_time");

  res.status(200).json(tickets);
});

// Mark attendance for an attendee
exports.markAttendance = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // Check if user is authorized (event organizer or admin)
  const event = await Event.findById(ticket.event_id);
  if (
    event.organizer_id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Unauthorized to mark attendance" });
  }

  ticket.attendance_status = status;
  ticket.check_in_time =
    status === "attended" ? new Date() : ticket.check_in_time;
  await ticket.save();

  res.status(200).json({ message: "Attendance marked successfully", ticket });
});

// Export attendee list (CSV/PDF)
exports.exportList = asyncHandler(async (req, res) => {
  const { eventId, format } = req.params;

  // Check if user is authorized (event organizer or admin)
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (
    event.organizer_id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "Unauthorized to export attendee list" });
  }

  const tickets = await Ticket.find({ event_id: eventId })
    .populate("user_id", "username email")
    .select(
      "user_id ticket_type quantity price attendance_status check_in_time"
    );

  // Format the data based on requested format (CSV/PDF)
  // This is a placeholder - you'll need to implement actual CSV/PDF generation
  if (format === "csv") {
    // Generate CSV
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendees-${eventId}.csv"`
    );
    // CSV generation logic... (like csv-writer or pdfkit).

    // Placeholder response
    res.status(200).send("CSV data would be here");
  } else if (format === "pdf") {
    // Generate PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="attendees-${eventId}.pdf"`
    );
    // PDF generation logic...

    // Placeholder response
    res.status(200).send("PDF data would be here");
  } else {
    res
      .status(400)
      .json({ message: "Invalid export format. Use 'csv' or 'pdf'" });
  }
});

// Resend confirmation email to attendee
exports.resendConfirmation = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId)
    .populate("user_id", "email username")
    .populate("event_id", "title date location");

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // Check if user is authorized (event organizer, admin, or ticket owner)
  const event = await Event.findById(ticket.event_id);
  const isAuthorized =
    event.organizer_id.toString() === req.user.id ||
    req.user.role === "admin" ||
    ticket.user_id._id.toString() === req.user.id;

  if (!isAuthorized) {
    return res
      .status(403)
      .json({ message: "Unauthorized to resend confirmation" });
  }

  // Send email logic would go here
  // For now, we'll just simulate success

  res.status(200).json({ message: "Confirmation email sent successfully" });
});

module.exports = exports;
