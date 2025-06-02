const EventRepository = require("../repositories/EventRepository");
const TicketRepository = require("../repositories/TicketRepository");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

class AttendeeService {
  /**
   * Get all attendees for a specific event
   * @param {string} eventId - The event ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Object} - Event and tickets data
   */
  async getAttendeesByEvent(eventId, userId, userRole) {
    // Check if event exists and user is authorized
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
  }

  /**
   * Mark attendance for an attendee
   * @param {string} ticketId - The ticket ID
   * @param {string} status - The attendance status
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Object} - Updated ticket
   */
  async markAttendance(ticketId, status, userId, userRole) {
    const ticket = await TicketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Check authorization
    const event = await EventRepository.findById(ticket.event_id);
    if (event.organizer_id.toString() !== userId && userRole !== "admin") {
      throw new Error("Unauthorized to mark attendance");
    }

    // Update ticket
    const checkInTime = status === "attended" ? new Date() : null;
    const updatedTicket = await TicketRepository.updateAttendanceStatus(
      ticketId,
      status,
      checkInTime
    );

    return updatedTicket;
  }

  /**
   * Format attendee data for export
   * @param {Array} tickets - Array of ticket objects
   * @returns {Array} - Formatted attendee data
   */
  formatAttendeeData(tickets) {
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
  }

  /**
   * Generate CSV export data
   * @param {string} eventId - The event ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Object} - CSV data and filename
   */
  async generateCSVExport(eventId, userId, userRole) {
    const { event, tickets } = await this.getAttendeesByEvent(
      eventId,
      userId,
      userRole
    );

    const fullTickets = await TicketRepository.findFullDetailsByEventId(
      eventId
    );

    const attendeeData = this.formatAttendeeData(fullTickets);

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
  }

  /**
   * Generate PDF export
   * @param {string} eventId - The event ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Object} - PDF document and filename
   */
  async generatePDFExport(eventId, userId, userRole) {
    const { event, tickets } = await this.getAttendeesByEvent(
      eventId,
      userId,
      userRole
    );

    const fullTickets = await Ticket.find({ event_id: eventId })
      .populate("user_id", "username email")
      .select(
        "user_id ticket_type quantity price attendance_status check_in_time"
      );

    const attendeeData = this.formatAttendeeData(fullTickets);

    const doc = new PDFDocument({ margin: 50 });
    const fileName = `attendees-${eventId}.pdf`;

    // Add event info to PDF
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

    return {
      document: doc,
      filename: fileName,
      contentType: "application/pdf",
    };
  }

  /**
   * Create email transporter
   * @returns {Object} - Nodemailer transporter
   */
  createEmailTransporter() {
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || "smtp.example.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER || "your-email@example.com",
        pass: process.env.EMAIL_PASSWORD || "your-password",
      },
    });
  }

  /**
   * Send confirmation email to attendee
   * @param {string} ticketId - The ticket ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {boolean} - Success status
   */
  async sendConfirmationEmail(ticketId, userId, userRole) {
    const ticket = await TicketRepository.findByIdWithPopulation(
      ticketId,
      "email username",
      "title date location organizer_id"
    );

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Check authorization
    const isAuthorized =
      ticket.event_id.organizer_id.toString() === userId ||
      userRole === "admin" ||
      ticket.user_id._id.toString() === userId;

    if (!isAuthorized) {
      throw new Error("Unauthorized to resend confirmation");
    }

    const transporter = this.createEmailTransporter();

    // Format event date
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

    await transporter.sendMail(emailContent);
    return true;
  }

  /**
   * Generate QR code for ticket
   * @param {string} ticketId - The ticket ID
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {string} - QR code data URL
   */
  async generateTicketQRCode(ticketId, userId, userRole) {
    const ticket = await TicketRepository.findByIdWithPopulation(
      ticketId,
      "",
      "title organizer_id"
    );

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Check authorization
    const isAuthorized =
      ticket.user_id.toString() === userId ||
      ticket.event_id.organizer_id.toString() === userId ||
      userRole === "admin";

    if (!isAuthorized) {
      throw new Error("Unauthorized to access this ticket");
    }

    // Create QR code data
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
  }

  /**
   * Validate QR code and check in attendee
   * @param {string} qrData - The QR code data
   * @param {string} userId - The requesting user ID
   * @param {string} userRole - The requesting user role
   * @returns {Object} - Validation result and ticket info
   */
  async validateQRCodeAndCheckIn(qrData, userId, userRole) {
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

    // Check authorization
    const isAuthorized =
      ticket.event_id.organizer_id.toString() === userId ||
      userRole === "admin";

    if (!isAuthorized) {
      throw new Error("Unauthorized to validate tickets");
    }

    // Check event date
    const eventDate = new Date(ticket.event_id.date);
    const now = new Date();

    if (eventDate < now && eventDate.getDate() !== now.getDate()) {
      throw new Error("This event has already occurred");
    }

    // Check if already used
    if (ticket.attendance_status === "attended") {
      throw new Error("This ticket has already been used");
    }

    // Mark as attended
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
  }
}

module.exports = new AttendeeService();
