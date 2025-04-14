const mongoose = require("mongoose");

const refundRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  ticket_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  amount: { type: Number, required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RefundRequest", refundRequestSchema);
