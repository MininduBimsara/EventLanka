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
    required: true,
  },
  issued_at: {
    type: Date,
    default: Date.now,
  },
  validated: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);