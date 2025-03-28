const express = require("express");
const {
  buyTicket,
  getTickets,
  getTicketById,
  cancelTicket,
} = require("../controllers/ticketController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, buyTicket); // Buy a ticket (only logged-in users)
router.get("/", protect, getTickets); // Get all tickets of the logged-in user
router.get("/:id", protect, getTicketById); // Get a specific ticket by ID
router.delete("/:id", protect, cancelTicket); // Cancel/Delete a ticket

module.exports = router;
