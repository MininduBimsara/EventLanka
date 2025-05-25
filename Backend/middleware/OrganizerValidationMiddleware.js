const { body, param, validationResult } = require("express-validator");








const attendeeValidations = {
  markAttendance: [
    param("id").isMongoId().withMessage("Invalid ticket ID"),
    body("status")
      .isIn(["attended", "absent", "pending"])
      .withMessage("Invalid attendance status"),
  ],

  resendConfirmation: [
    param("ticketId").isMongoId().withMessage("Invalid ticket ID"),
  ],

  exportList: [
    param("eventId").isMongoId().withMessage("Invalid event ID"),
    param("format")
      .isIn(["csv", "pdf"])
      .withMessage("Format must be either csv or pdf"),
  ],

  generateQRCode: [
    param("ticketId").isMongoId().withMessage("Invalid ticket ID"),
  ],

  validateQRCode: [
    body("qrData").notEmpty().withMessage("QR code data is required"),
  ],
};

// Add validation for event-related endpoints
// const eventValidations = {
//   createEvent: [
//     body("title")
//       .notEmpty()
//       .withMessage("Event title is required")
//       .isLength({ min: 3, max: 100 })
//       .withMessage("Title must be between 3 and 100 characters"),
//     body("description").notEmpty().withMessage("Event description is required"),
//     body("date").isISO8601().withMessage("Invalid date format"),
//     body("location").notEmpty().withMessage("Event location is required"),
//     body("category").notEmpty().withMessage("Event category is required"),
//     body("tickets").isArray().withMessage("Tickets must be an array"),
//     body("tickets.*.type").notEmpty().withMessage("Ticket type is required"),
//     body("tickets.*.price")
//       .isNumeric()
//       .withMessage("Ticket price must be a number"),
//     body("tickets.*.quantity")
//       .isInt({ min: 1 })
//       .withMessage("Ticket quantity must be at least 1"),
//   ],

//   updateEvent: [
//     param("id").isMongoId().withMessage("Invalid event ID"),
//     body("title")
//       .optional()
//       .isLength({ min: 3, max: 100 })
//       .withMessage("Title must be between 3 and 100 characters"),
//     body("date").optional().isISO8601().withMessage("Invalid date format"),
//     body("tickets.*.price")
//       .optional()
//       .isNumeric()
//       .withMessage("Ticket price must be a number"),
//     body("tickets.*.quantity")
//       .optional()
//       .isInt({ min: 0 })
//       .withMessage("Ticket quantity must be a positive integer"),
//   ],
// };

// Add validation for discount-related endpoints
const discountValidations = {
  createDiscount: [
    body("code")
      .notEmpty()
      .withMessage("Discount code is required")
      .isLength({ min: 3, max: 20 })
      .withMessage("Code must be between 3 and 20 characters"),
    body("discountType")
      .isIn(["percentage", "fixed"])
      .withMessage("Discount type must be either percentage or fixed"),
    body("value").isNumeric().withMessage("Discount value must be a number"),
    body("maxUses")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Maximum uses must be at least 1"),
    body("expiryDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format"),
    body("eventId").isMongoId().withMessage("Invalid event ID"),
  ],

  updateDiscount: [
    param("discountId").isMongoId().withMessage("Invalid discount ID"),
    body("code")
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage("Code must be between 3 and 20 characters"),
    body("discountType")
      .optional()
      .isIn(["percentage", "fixed"])
      .withMessage("Discount type must be either percentage or fixed"),
    body("value")
      .optional()
      .isNumeric()
      .withMessage("Discount value must be a number"),
    body("maxUses")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Maximum uses must be at least 1"),
    body("expiryDate")
      .optional()
      .isISO8601()
      .withMessage("Invalid date format"),
  ],

  validateCode: [
    body("code").notEmpty().withMessage("Discount code is required"),
    body("eventId").isMongoId().withMessage("Invalid event ID"),
  ],
};

module.exports = {
  validate,
  attendeeValidations,
  eventValidations,
  discountValidations,
};
