const express = require("express");
const router = express.Router();
const multer = require("multer"); // For file uploads
const path = require("path");

// Import middleware
const {
  protect,
  adminOnly,
  organizerOnly,
} = require("../middleware/authMiddleware");

// Configure multer for file uploads
const eventStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sure this path exists and is accessible
    cb(null, "uploads/event-images/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const eventUpload = multer({ eventStorage });

// Configure multer for profile image uploads
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile-images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, "profile-" + uniqueSuffix + fileExt);
  },
});

const profileUpload = multer({ 
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."), false);
    }
  }
});

// Import controllers
const eventController = require("../controllers/Common/eventController");
const attendeeController = require("../controllers/Organizer/attendeeController");
const discountController = require("../controllers/Organizer/discountController");
const salesController = require("../controllers/Organizer/salesController");
const organizerController = require("../controllers/Organizer/organizerController");

/* ===== Event Routes ===== */
// For the event routes, add the upload middleware:
router.post(
  "/events",
  protect,
  organizerOnly,
  eventUpload.single("banner"), // Add this line to handle file uploads with field name 'banner'
  eventController.createEvent
);
router.put("/events/:id", protect, eventController.updateEvent);
router.get("/events", protect, organizerOnly, eventController.getEvents);
router.get("/events/:id", eventController.getEventById);
router.delete("/events/:id", protect, eventController.deleteEvent);
// router.put(
//   "/events/:id/status",
//   protect,
//   adminOnly,
//   eventController.updateEventStatus
// );

/* ===== Attendee Routes ===== */
router.get(
  "/events/:eventId/attendees",
  protect,
  attendeeController.getByEvent
);
// router.post("/attendees", protect, attendeeController.create);
// router.put("/attendees/:id", protect, attendeeController.update);
router.put(
  "/attendees/:id/attendance",
  protect,
  attendeeController.markAttendance
);
router.post(
  "/attendees/:ticketId/resend-confirmation",
  protect,
  attendeeController.resendConfirmation
);
router.get(
  "/events/:eventId/attendees/export/:format",
  protect,
  attendeeController.exportList
);

/* ===== Discount Routes ===== */
router.post("/discounts", protect, organizerOnly, discountController.create);
router.put(
  "/discounts/:discountId",
  protect,
  organizerOnly,
  discountController.update
);
router.delete(
  "/discounts/:discountId",
  protect,
  organizerOnly,
  discountController.delete
);
router.get("/events/:eventId/discounts", protect, discountController.getAll);
router.post("/discounts/validate", discountController.validateCode);

/* ===== Sales Routes ===== */
router.get("/sales/event/:eventId", protect, salesController.getSalesByEvent);
router.get("/sales/period", protect, salesController.getSalesByPeriod);
router.get("/sales/analytics", protect, salesController.getAnalytics);

/* ===== Organizer Routes ===== */
router.get(
  "/organizer/profile",
  protect,
  organizerOnly,
  organizerController.getProfile
);
router.put(
  "/organizer/profile",
  protect,
  organizerOnly,
  profileUpload.single("profileImage"),
  organizerController.updateProfile
);
router.put(
  "/organizer/settings",
  protect,
  organizerOnly,
  organizerController.updateSettings
);
router.get(
  "/organizer/dashboard",
  protect,
  organizerOnly,
  organizerController.dashboard
);
router.put("/organizer/password", protect, organizerController.changePassword);


// Add new routes for admin access to organizers
// router.get(
//   "/all",
//   protect,
//   adminOnly,
//   organizerController.getAllOrganizers
// );
// router.get(
//   "/:id",
//   protect,
//   organizerController.getOrganizerById
// );
// router.put(
//   "/:id/status",
//   protect,
//   adminOnly,
//   organizerController.updateOrganizerStatus
// );

module.exports = router;
