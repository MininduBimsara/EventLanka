const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  getEventById ,
  deleteEvent,
  getAllEvents,
} = require("../controllers/Common/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// RESTful routes for events
router.post("/",
  protect, createEvent); // Create an event
router.get("/", protect, getEvents); // Get events (based on role)
router.put("/:id", protect, updateEvent); // Update an event
router.delete("/:id", protect, deleteEvent); // Delete an event
router.get("/:id", protect, getEventById); // Get an event by ID


router.get("/all", getAllEvents); // Get all events (for admin)

module.exports = router;
