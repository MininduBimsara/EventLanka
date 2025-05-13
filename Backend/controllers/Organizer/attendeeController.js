const Ticket = require("../../models/Ticket");
const Event = require("../../models/Event");
const asyncHandler = require("express-async-handler");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

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

  // Format the data for export
  const attendeeData = tickets.map((ticket) => {
    return {
      Name: ticket.user_id?.username || "N/A",
      Email: ticket.user_id?.email || "N/A",
      TicketType: ticket.ticket_type,
      Quantity: ticket.quantity,
      Price: ticket.price,
      Status: ticket.attendance_status,
      CheckInTime: ticket.check_in_time
        ? new Date(ticket.check_in_time).toLocaleString()
        : "Not checked in",
    };
  });

  if (format === "csv") {
    // Generate CSV with json2csv
    try {
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

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="attendees-${eventId}.csv"`
      );
      return res.status(200).send(csv);
    } catch (err) {
      // console.error("CSV generation error:", err);
      return res.status(500).json({ message: "Error generating CSV file" });
    }
  } else if (format === "pdf") {
    // Generate PDF with pdfkit
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `attendees-${eventId}.pdf`;

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      // Pipe the PDF directly to the response
      doc.pipe(res);

      // Add event info to the PDF
      doc
        .fontSize(16)
        .text(`Attendee List - ${event.title}`, { align: "center" });
      doc.moveDown();
      doc
        .fontSize(12)
        .text(`Date: ${new Date(event.date).toLocaleDateString()}`, {
          align: "center",
        });
      doc.moveDown(2);

      // Add table headers
      const tableTop = 150;
      const tableHeaders = ["Name", "Email", "Ticket Type", "Status"];
      const columnWidths = [120, 150, 100, 100];
      let currentXPosition = 50;

      // Draw header row
      doc.font("Helvetica-Bold");
      tableHeaders.forEach((header, i) => {
        doc.text(header, currentXPosition, tableTop);
        currentXPosition += columnWidths[i];
      });
      doc.moveDown();

      // Draw data rows
      doc.font("Helvetica");
      let rowY = tableTop + 20;

      attendeeData.forEach((attendee) => {
        if (rowY > 700) {
          // Check if we need a new page
          doc.addPage();
          rowY = 50;
        }

        currentXPosition = 50;
        doc.text(attendee.Name, currentXPosition, rowY);
        currentXPosition += columnWidths[0];

        doc.text(attendee.Email, currentXPosition, rowY);
        currentXPosition += columnWidths[1];

        doc.text(attendee.TicketType, currentXPosition, rowY);
        currentXPosition += columnWidths[2];

        doc.text(attendee.Status, currentXPosition, rowY);

        rowY += 20;
      });

      // Finalize the PDF
      doc.end();
    } catch (err) {
      // console.error("PDF generation error:", err);
      return res.status(500).json({ message: "Error generating PDF file" });
    }
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
    .populate("event_id", "title date location organizer_id");

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // Check if user is authorized (event organizer, admin, or ticket owner)
  const isAuthorized =
    ticket.event_id.organizer_id.toString() === req.user.id ||
    req.user.role === "admin" ||
    ticket.user_id._id.toString() === req.user.id;

  if (!isAuthorized) {
    return res
      .status(403)
      .json({ message: "Unauthorized to resend confirmation" });
  }

  try {
    // Create a Nodemailer transporter
    // Note: In production, use environment variables for sensitive info
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "your-email@example.com",
        pass: process.env.EMAIL_PASSWORD || "your-password",
      },
    });

    // Format the event date
    const eventDate = new Date(ticket.event_id.date).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    // Create email content
    const emailContent = {
      from:
        process.env.EMAIL_FROM || '"Event Manager" <notifications@example.com>',
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
          
          <p>Please keep this email as your confirmation. You can also log in to your account to view your tickets.</p>
          
          <p>We're looking forward to seeing you at the event!</p>
          
          <p>Best regards,<br>The Event Team</p>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(emailContent);

    res.status(200).json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    // console.error("Email sending error:", error);
    res
      .status(500)
      .json({
        message: "Failed to send confirmation email",
        error: error.message,
      });
  }
});

// Generate QR code for a ticket
exports.generateQRCode = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId).populate(
    "event_id",
    "title organizer_id"
  );

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  // Check if user is authorized (ticket owner, event organizer, or admin)
  const isAuthorized =
    ticket.user_id.toString() === req.user.id ||
    ticket.event_id.organizer_id.toString() === req.user.id ||
    req.user.role === "admin";

  if (!isAuthorized) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access this ticket" });
  }

  // Create QR code data with ticket information
  const qrData = JSON.stringify({
    ticketId: ticket._id,
    eventId: ticket.event_id._id,
    userId: ticket.user_id,
    type: ticket.ticket_type,
    quantity: ticket.quantity,
    timestamp: Date.now(), // Add timestamp for security
  });

  try {
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });

    // For API response with an image
    res.status(200).json({
      message: "QR code generated successfully",
      qrCode: qrCodeDataURL,
    });
  } catch (error) {
    // console.error("QR code generation error:", error);
    res
      .status(500)
      .json({ message: "Failed to generate QR code", error: error.message });
  }
});

// Validate a QR code (for check-in)
exports.validateQRCode = asyncHandler(async (req, res) => {
  const { qrData } = req.body;

  if (!qrData) {
    return res.status(400).json({ message: "QR code data is required" });
  }

  try {
    // Parse the QR code data
    const ticketData = JSON.parse(qrData);
    const { ticketId } = ticketData;

    if (!ticketId) {
      return res.status(400).json({ message: "Invalid QR code format" });
    }

    // Find the ticket
    const ticket = await Ticket.findById(ticketId)
      .populate("event_id", "title organizer_id date")
      .populate("user_id", "username email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if user is authorized (event organizer or admin)
    const isAuthorized =
      ticket.event_id.organizer_id.toString() === req.user.id ||
      req.user.role === "admin";

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Unauthorized to validate tickets" });
    }

    // Check if the event date has passed
    const eventDate = new Date(ticket.event_id.date);
    const now = new Date();

    if (eventDate < now && eventDate.getDate() !== now.getDate()) {
      return res
        .status(400)
        .json({ message: "This event has already occurred" });
    }

    // Check if ticket has already been used
    if (ticket.attendance_status === "attended") {
      return res.status(400).json({
        message: "This ticket has already been used",
        checkInTime: ticket.check_in_time,
      });
    }

    // Mark ticket as attended
    ticket.attendance_status = "attended";
    ticket.check_in_time = new Date();
    await ticket.save();

    return res.status(200).json({
      message: "Ticket validated successfully",
      ticket: {
        id: ticket._id,
        eventTitle: ticket.event_id.title,
        attendeeName: ticket.user_id.username,
        attendeeEmail: ticket.user_id.email,
        ticketType: ticket.ticket_type,
        quantity: ticket.quantity,
        checkInTime: ticket.check_in_time,
      },
    });
  } catch (error) {
    // console.error("QR validation error:", error);
    res
      .status(500)
      .json({ message: "Failed to validate QR code", error: error.message });
  }
});

module.exports = exports;
