const express = require("express");
const {
  buyTicket,
  getTickets,
  getTicketById,
  cancelTicket,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to authenticate users
router.use(protect);

router.post("/", buyTicket); // Buy a ticket (only logged-in users)
router.get("/", getTickets); // Get all tickets of the logged-in user
router.get("/:id", getTicketById); // Get a specific ticket by ID
router.delete("/:id", cancelTicket); // Cancel/Delete a ticket

module.exports = router;
