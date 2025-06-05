// =============================================
// attendeeService.js - Module Pattern
// =============================================

const EventRepository = require("../../Repository/EventRepository");
const TicketRepository = require("../../Repository/TicketRepository");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

/**
 * Get all attendees for a specific event
 * @param {string} eventId - The event ID
 * @param {string} userId - The requesting user ID
 * @param {string} userRole - The requesting user role
 * @returns {Object} - Event and tickets data
 */
const getAttendeesByEvent = async (eventId, userId, userRole) => {
  const event = await EventRepository.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  if (event.organizer_id.toString() !== userId && userRole !== "admin") {
    throw new Error("Unauthorized to access attendee list");
  }

  const tickets = await TicketRepository.findByEventWithPopulation(
    eventId,
    "username email",
    "user_id ticket_type quantity attendance_status check_in_time"
  );

  return { event, tickets };
};

/**
 * Mark attendance for an attendee
 * @param {string} ticketId - The ticket ID
 * @param {string} status - The attendance status
 * @param {string} userId - The requesting user ID
 * @param {string} userRole - The requesting user role
 * @returns {Object} - Updated ticket
 */
const markAttendance = async (ticketId, status, userId, userRole) => {
  const ticket = await TicketRepository.findById(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const event = await EventRepository.findById(ticket.event_id);
  if (event.organizer_id.toString() !== userId && userRole !== "admin") {
    throw new Error("Unauthorized to mark attendance");
  }

  const checkInTime = status === "attended" ? new Date() : null;
  const updatedTicket = await TicketRepository.updateAttendanceStatus(
    ticketId,
    status,
    checkInTime
  );

  return updatedTicket;
};

/**
 * Format attendee data for export
 * @param {Array} tickets - Array of ticket objects
 * @returns {Array} - Formatted attendee data
 */
const formatAttendeeData = (tickets) => {
  return tickets.map((ticket) => ({
    Name: ticket.user_id?.username || "N/A",
    Email: ticket.user_id?.email || "N/A",
    TicketType: ticket.ticket_type,
    Quantity: ticket.quantity,
    Price: ticket.price,
    Status: ticket.attendance_status,
    CheckInTime: ticket.check_in_time
      ? new Date(ticket.check_in_time).toLocaleString()
      : "Not checked in",
  }));
};

/**
 * Generate CSV export data
 * @param {string} eventId - The event ID
 * @param {string} userId - The requesting user ID
 * @param {string} userRole - The requesting user role
 * @returns {Object} - CSV data and filename
 */
const generateCSVExport = async (eventId, userId, userRole) => {
  const { event, tickets } = await getAttendeesByEvent(eventId, userId, userRole);
  
  const fullTickets = await TicketRepository.findFullDetailsByEventId(eventId);
  const attendeeData = formatAttendeeData(fullTickets);

  const fields = [
    "Name",
    "Email",
    "TicketType",
    "Quantity",
    "Price",
    "Status",
    "CheckInTime",
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(attendeeData);

  return {
    data: csv,
    filename: `attendees-${eventId}.csv`,
    contentType: "text/csv",
  };
};

/**
 * Create email transporter
 * @returns {Object} - Nodemailer transporter
 */
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || "smtp.example.com",
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER || "your-email@example.com",
      pass: process.env.EMAIL_PASSWORD || "your-password",
    },
  });
};

/**
 * Send confirmation email to attendee
 * @param {string} ticketId - The ticket ID
 * @param {string} userId - The requesting user ID
 * @param {string} userRole - The requesting user role
 * @returns {boolean} - Success status
 */
const sendConfirmationEmail = async (ticketId, userId, userRole) => {
  const ticket = await TicketRepository.findByIdWithPopulation(
    ticketId,
    "email username",
    "title date location organizer_id"
  );

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const isAuthorized =
    ticket.event_id.organizer_id.toString() === userId ||
    userRole === "admin" ||
    ticket.user_id._id.toString() === userId;

  if (!isAuthorized) {
    throw new Error("Unauthorized to resend confirmation");
  }

  const transporter = createEmailTransporter();

  const eventDate = new Date(ticket.event_id.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const emailContent = {
    from: process.env.EMAIL_FROM || '"Event Manager" <notifications@example.com>',
    to: ticket.user_id.email,
    subject: `Your Ticket Confirmation for ${ticket.event_id.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Ticket Confirmation</h2>
        <p>Hello ${ticket.user_id.username},</p>
        <p>Thank you for purchasing tickets to <strong>${ticket.event_id.title}</strong>.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Event Details:</h3>
          <p><strong>Event:</strong> ${ticket.event_id.title}</p>
          <p><strong>Date & Time:</strong> ${eventDate}</p>
          <p><strong>Location:</strong> ${ticket.event_id.location}</p>
          <p><strong>Ticket Type:</strong> ${ticket.ticket_type}</p>
          <p><strong>Quantity:</strong> ${ticket.quantity}</p>
        </div>
        
        <p>Please keep this email as your confirmation.</p>
        <p>Best regards,<br>The Event Team</p>
      </div>
    `,
  };

  await transporter.sendMail(emailContent);
  return true;
};

/**
 * Generate QR code for ticket
 * @param {string} ticketId - The ticket ID
 * @param {string} userId - The requesting user ID
 * @param {string} userRole - The requesting user role
 * @returns {string} - QR code data URL
 */
const generateTicketQRCode = async (ticketId, userId, userRole) => {
  const ticket = await TicketRepository.findByIdWithPopulation(
    ticketId,
    "",
    "title organizer_id"
  );

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const isAuthorized =
    ticket.user_id.toString() === userId ||
    ticket.event_id.organizer_id.toString() === userId ||
    userRole === "admin";

  if (!isAuthorized) {
    throw new Error("Unauthorized to access this ticket");
  }

  const qrData = JSON.stringify({
    ticketId: ticket._id,
    eventId: ticket.event_id._id,
    userId: ticket.user_id,
    type: ticket.ticket_type,
    quantity: ticket.quantity,
    timestamp: Date.now(),
  });

  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 300,
  });

  return qrCodeDataURL;
};

/**
 * Validate QR code and check in attendee
 * @param {string} qrData - The QR code data
 * @param {string} userId - The requesting user ID
 * @param {string} userRole - The requesting user role
 * @returns {Object} - Validation result and ticket info
 */
const validateQRCodeAndCheckIn = async (qrData, userId, userRole) => {
  if (!qrData) {
    throw new Error("QR code data is required");
  }

  let ticketData;
  try {
    ticketData = JSON.parse(qrData);
  } catch (error) {
    throw new Error("Invalid QR code format");
  }

  const { ticketId } = ticketData;
  if (!ticketId) {
    throw new Error("Invalid QR code format");
  }

  const ticket = await TicketRepository.findByIdWithPopulation(
    ticketId,
    "username email",
    "title organizer_id date"
  );

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const isAuthorized =
    ticket.event_id.organizer_id.toString() === userId ||
    userRole === "admin";

  if (!isAuthorized) {
    throw new Error("Unauthorized to validate tickets");
  }

  const eventDate = new Date(ticket.event_id.date);
  const now = new Date();

  if (eventDate < now && eventDate.getDate() !== now.getDate()) {
    throw new Error("This event has already occurred");
  }

  if (ticket.attendance_status === "attended") {
    throw new Error("This ticket has already been used");
  }

  await TicketRepository.updateAttendanceStatus(
    ticketId,
    "attended",
    new Date()
  );

  return {
    id: ticket._id,
    eventTitle: ticket.event_id.title,
    attendeeName: ticket.user_id.username,
    attendeeEmail: ticket.user_id.email,
    ticketType: ticket.ticket_type,
    quantity: ticket.quantity,
    checkInTime: ticket.check_in_time,
  };
};

module.exports = {
  getAttendeesByEvent,
  markAttendance,
  formatAttendeeData,
  generateCSVExport,
  createEmailTransporter,
  sendConfirmationEmail,
  generateTicketQRCode,
  validateQRCodeAndCheckIn,
};