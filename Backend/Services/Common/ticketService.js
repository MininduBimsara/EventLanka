const Ticket = require("../../models/Ticket");
const Event = require("../../models/Event");
const Order = require("../../models/Order");
const User = require("../../models/User");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");

/**
 * Purchase a ticket for an event
 * @param {Object} userData - User details
 * @param {string} eventId - ID of the event
 * @param {string} ticketType - Type of ticket
 * @param {number} quantity - Number of tickets
 * @returns {Promise<Object>} - Ticket and order details
 */
const purchaseTicket = async (userData, eventId, ticketType, quantity) => {
  // Find the event to ensure it exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if the requested ticket type exists
  const ticketOption = event.ticket_types.find((t) => t.type === ticketType);
  if (!ticketOption) {
    throw new Error("Invalid ticket type");
  }

  // Ensure enough tickets are available
  if (ticketOption.availability < quantity) {
    throw new Error("Not enough tickets available");
  }

  // Calculate the total price
  const totalPrice = ticketOption.price * quantity;

  // Create the ticket
  const ticket = await Ticket.create({
    user_id: userData._id,
    event_id: eventId,
    ticket_type: ticketType,
    quantity: quantity,
    price: totalPrice,
    qr_code: null, // Will be generated later
    payment_status: "pending",
  });

  // Reduce ticket availability
  ticketOption.availability -= quantity;
  await event.save();

  // Generate a unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Automatically create an order for this ticket
  const order = await Order.create({
    order_number: orderNumber,
    user_id: userData._id,
    tickets: [ticket._id], // Array with the new ticket ID
    total_amount: totalPrice,
    discount_id: null, // No discount by default
    discount_amount: 0,
    payment_method: "pending", // This will be updated during payment
    payment_status: "pending",
    status: "pending",
  });

  return { ticket, order };
};

/**
 * Get all tickets for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of tickets
 */
const getUserTickets = async (userId) => {
  return await Ticket.find({ user_id: userId }).populate(
    "event_id",
    "title date location"
  );
};

/**
 * Get a specific ticket by ID
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} - Ticket details
 */
const getTicketById = async (ticketId, userId) => {
  const ticket = await Ticket.findById(ticketId).populate(
    "event_id",
    "title date location"
  );

  if (!ticket || ticket.user_id.toString() !== userId) {
    throw new Error("Ticket not found or unauthorized");
  }

  return ticket;
};

/**
 * Cancel a ticket and restore availability
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} - Success message
 */
const cancelTicket = async (ticketId, userId) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket || ticket.user_id.toString() !== userId) {
    throw new Error("Ticket not found or unauthorized");
  }

  // Find the event to restore ticket availability
  const event = await Event.findById(ticket.event_id);
  if (event) {
    const ticketOption = event.ticket_types.find(
      (t) => t.type === ticket.ticket_type
    );
    if (ticketOption) {
      ticketOption.availability += ticket.quantity;
      await event.save();
    }
  }

  await ticket.deleteOne();
  return { message: "Ticket canceled successfully" };
};

/**
 * Generate QR code data for a ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID for authorization
 * @returns {Promise<Object>} - QR code data URL
 */
const generateQRCodeData = async (ticketId, userId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate("user_id", "username email")
    .populate("event_id", "title date location");

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Generate QR code data
  const qrData = JSON.stringify({
    ticketId: ticket._id,
    eventId: ticket.event_id._id,
    userId: ticket.user_id._id,
    type: ticket.ticket_type,
    quantity: ticket.quantity,
    timestamp: Date.now(),
  });

  // Generate QR code as data URL
  const qrCode = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 250,
  });

  return { qrCode };
};

/**
 * Create a PDF ticket document
 * @param {string} ticketId - Ticket ID
 * @param {string} userId - User ID for authorization
 * @param {string} userRole - User role for authorization
 * @returns {Promise<PDFDocument>} - PDF document stream
 */
const createTicketPDF = async (ticketId, userId, userRole) => {
  const ticket = await Ticket.findById(ticketId)
    .populate("user_id", "username email")
    .populate("event_id", "title date location organizer_id banner");

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  // Check if user is authorized (ticket owner, admin, or event organizer)
  const isAuthorized =
    ticket.user_id._id.toString() === userId ||
    userRole === "admin" ||
    (ticket.event_id && ticket.event_id.organizer_id.toString() === userId);

  if (!isAuthorized) {
    throw new Error("Unauthorized to access this ticket");
  }

  // Generate QR code
  const qrData = JSON.stringify({
    ticketId: ticket._id,
    eventId: ticket.event_id._id,
    userId: ticket.user_id._id,
    type: ticket.ticket_type,
    quantity: ticket.quantity,
    timestamp: Date.now(),
  });

  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 150,
  });

  // Create PDF with pdfkit
  const doc = new PDFDocument({ margin: 50 });

  // Format the event date
  const eventDate = ticket.event_id.date
    ? new Date(ticket.event_id.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "TBD";

  // Add title and event info
  doc.fontSize(25).text("E-TICKET", { align: "center" });
  doc.moveDown();
  doc.fontSize(16).text(ticket.event_id.title, { align: "center" });
  doc.moveDown(0.5);

  // Add event details
  doc.fontSize(12).text(`Date: ${eventDate}`);
  doc.moveDown(0.5);
  doc.text(`Location: ${ticket.event_id.location || "TBD"}`);
  doc.moveDown(0.5);
  doc.text(`Ticket Type: ${ticket.ticket_type}`);
  doc.moveDown(0.5);
  doc.text(`Quantity: ${ticket.quantity}`);
  doc.moveDown(0.5);
  doc.text(`Ticket ID: ${ticket._id}`);
  doc.moveDown(0.5);
  doc.text(`Attendee: ${ticket.user_id.username}`);
  doc.moveDown(0.5);
  doc.text(`Email: ${ticket.user_id.email}`);

  // Add QR code
  doc.moveDown(2);
  doc.text("Scan QR code at the event entrance:", { align: "center" });
  doc.moveDown();

  // Add the QR code image
  doc.image(qrCodeDataURL, {
    fit: [150, 150],
    align: "center",
  });

  // Add footer
  doc.moveDown(2);
  doc
    .fontSize(10)
    .text("This ticket is valid for one-time entry only.", { align: "center" });
  doc.text("Please do not share this ticket with others.", { align: "center" });

  return doc;
};

module.exports = {
  purchaseTicket,
  getUserTickets,
  getTicketById,
  cancelTicket,
  generateQRCodeData,
  createTicketPDF,
};
