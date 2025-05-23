const ticketService = require("../../Services/Common/ticketService");
const asyncHandler = require("express-async-handler");

// ===========================
// CREATE A TICKET (Buy Ticket)
// ===========================
exports.buyTicket = asyncHandler(async (req, res) => {
  const { eventId, ticketType, quantity } = req.body;

  // Ensure the user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to buy a ticket." });
  }

  try {
    const result = await ticketService.purchaseTicket(
      req.user,
      eventId,
      ticketType,
      quantity
    );

    res.status(201).json({
      message: "Ticket purchased successfully",
      ticket: result.ticket,
      order: result.order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ===========================
// GET ALL TICKETS (For Logged-in User)
// ===========================
exports.getTickets = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view tickets." });
  }

  const tickets = await ticketService.getUserTickets(req.user._id);
  res.status(200).json(tickets);
});

// ===========================
// GET A SINGLE TICKET (By ID)
// ===========================
exports.getTicketById = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view this ticket." });
  }

  try {
    const ticket = await ticketService.getTicketById(
      req.params.id,
      req.user._id
    );
    res.status(200).json(ticket);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// ===========================
// DELETE A TICKET (Cancel a Ticket)
// ===========================
exports.cancelTicket = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to cancel a ticket." });
  }

  try {
    const result = await ticketService.cancelTicket(
      req.params.id,
      req.user._id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Generate QR code for a ticket
exports.generateQRCode = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to access this ticket." });
  }

  try {
    const result = await ticketService.generateQRCodeData(
      ticketId,
      req.user.id
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Download ticket as PDF
exports.downloadTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { format } = req.params; // pdf

  if (!req.user) {
    return res
      .status(401)
      .json({ message: "You must be logged in to download this ticket." });
  }

  // Check if the requested format is PDF
  if (format !== "pdf") {
    return res.status(400).json({ message: "Invalid format. Use 'pdf'" });
  }

  try {
    const fileName = `ticket-${ticketId}.pdf`;
    const pdfDoc = await ticketService.createTicketPDF(
      ticketId,
      req.user.id,
      req.user.role
    );

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe the PDF directly to the response
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res
      .status(error.message.includes("Unauthorized") ? 403 : 404)
      .json({ message: error.message });
  }
});

module.exports = exports;
