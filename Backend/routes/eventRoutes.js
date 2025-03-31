const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to authenticate users
router.use(protect);

// RESTful routes for events
router.post("/", createEvent); // Create an event
router.get("/", getEvents); // Get events (based on role)
router.put("/:id", updateEvent); // Update an event
router.delete("/:id", deleteEvent); // Delete an event

module.exports = router;
