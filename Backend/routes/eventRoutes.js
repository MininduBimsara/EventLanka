const express = require("express");
const {
  createEvent,
  getEvents,
  updateEvent,
  getEventById,
  deleteEvent,
  getPublicEvents,
} = require("../controllers/Common/eventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// RESTful routes for events
router.post("/", protect, createEvent);
router.get("/", protect, getEvents);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

// 🔥 Move this BEFORE router.get("/:id")
router.get("/all", getPublicEvents);

router.get("/:id", protect, getEventById);

module.exports = router;
