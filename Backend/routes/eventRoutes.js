const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  getEventById ,
  deleteEvent,
} = require("../controllers/Common/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to authenticate users
router.use(protect);

// RESTful routes for events
router.post("/", createEvent); // Create an event
router.get("/", getEvents); // Get events (based on role)
router.put("/:id", updateEvent); // Update an event
router.delete("/:id", deleteEvent); // Delete an event
router.get("/:id", getEventById); // Get an event by ID

module.exports = router;
