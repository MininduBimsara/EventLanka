const { default: mongoose } = require("mongoose");

const ticketSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Event",
  },
  ticket_type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  payment_status: {
    type: String,
    enum: ["pending", "paid", "refunded"],
    default: "pending",
  },
  qr_code: {
    type: String,
    default: null,
  },
  issued_at: {
    type: Date,
    default: Date.now,
  },
  validated: {
    type: Boolean,
    default: false,
  },
  attendance_status: {
    type: String,
    enum: ["not_attended", "attended"],
    default: "not_attended",
  },
  check_in_time: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);