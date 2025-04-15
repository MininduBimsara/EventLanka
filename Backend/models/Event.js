const mongoose = require("mongoose");

const ticketTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  availability: {
    type: Number,
    required: true,
    min: 0,
  },
});

const eventSchema = new mongoose.Schema({
  organizer_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Organizer",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1, // Ensuring duration is at least 1 hour
  },
  ticket_types: {
    type: [ticketTypeSchema],
    required: true,
  },
  event_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  banner: {
    type: String,
    required: true,
  },
  bookingAvailable: {
    type: Boolean,
    required: true,
    default: true, // Default value if not specified
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
