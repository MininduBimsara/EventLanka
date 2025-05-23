const attendeeService = require("../../Services/Organizer/attendeeService");
const asyncHandler = require("express-async-handler");

// Get all attendees for a specific event
exports.getByEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  try {
    const { event, tickets } = await attendeeService.getAttendeesByEvent(
      eventId,
      req.user.id,
      req.user.role
    );

    res.status(200).json(tickets);
  } catch (error) {
    if (error.message === "Event not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Unauthorized to access attendee list") {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Mark attendance for an attendee
exports.markAttendance = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  const { status } = req.body;

  try {
    const ticket = await attendeeService.markAttendance(
      ticketId,
      status,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      message: "Attendance marked successfully",
      ticket,
    });
  } catch (error) {
    if (error.message === "Ticket not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Unauthorized to mark attendance") {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Export attendee list (CSV/PDF)
exports.exportList = asyncHandler(async (req, res) => {
  const { eventId, format } = req.params;

  if (!["csv", "pdf"].includes(format)) {
    return res.status(400).json({
      message: "Invalid export format. Use 'csv' or 'pdf'",
    });
  }

  try {
    if (format === "csv") {
      const { data, filename, contentType } =
        await attendeeService.generateCSVExport(
          eventId,
          req.user.id,
          req.user.role
        );

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      return res.status(200).send(data);
    } else if (format === "pdf") {
      const { document, filename, contentType } =
        await attendeeService.generatePDFExport(
          eventId,
          req.user.id,
          req.user.role
        );

      res.setHeader("Content-Type", contentType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Pipe the PDF directly to the response
      document.pipe(res);
      document.end();
    }
  } catch (error) {
    if (error.message === "Event not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Unauthorized to export attendee list") {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({
      message: `Error generating ${format.toUpperCase()} file`,
      error: error.message,
    });
  }
});

// Resend confirmation email to attendee
exports.resendConfirmation = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  try {
    await attendeeService.sendConfirmationEmail(
      ticketId,
      req.user.id,
      req.user.role
    );

    res.status(200).json({ message: "Confirmation email sent successfully" });
  } catch (error) {
    if (error.message === "Ticket not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Unauthorized to resend confirmation") {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Failed to send confirmation email",
      error: error.message,
    });
  }
});

// Generate QR code for a ticket
exports.generateQRCode = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  try {
    const qrCodeDataURL = await attendeeService.generateTicketQRCode(
      ticketId,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      message: "QR code generated successfully",
      qrCode: qrCodeDataURL,
    });
  } catch (error) {
    if (error.message === "Ticket not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Unauthorized to access this ticket") {
      return res.status(403).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Failed to generate QR code",
      error: error.message,
    });
  }
});

// Validate a QR code (for check-in)
exports.validateQRCode = asyncHandler(async (req, res) => {
  const { qrData } = req.body;

  try {
    const ticketInfo = await attendeeService.validateQRCodeAndCheckIn(
      qrData,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      message: "Ticket validated successfully",
      ticket: ticketInfo,
    });
  } catch (error) {
    const errorMessages = {
      "QR code data is required": 400,
      "Invalid QR code format": 400,
      "Ticket not found": 404,
      "Unauthorized to validate tickets": 403,
      "This event has already occurred": 400,
      "This ticket has already been used": 400,
    };

    const statusCode = errorMessages[error.message] || 500;

    if (
      statusCode === 400 &&
      error.message === "This ticket has already been used"
    ) {
      // For already used tickets, we might want to include check-in time info
      return res.status(400).json({
        message: error.message,
        // Note: If you need checkInTime info, you'd need to modify the service to return it
      });
    }

    res.status(statusCode).json({
      message:
        error.message === "This ticket has already been used"
          ? error.message
          : statusCode === 500
          ? "Failed to validate QR code"
          : error.message,
      ...(statusCode === 500 && { error: error.message }),
    });
  }
});

module.exports = exports;
