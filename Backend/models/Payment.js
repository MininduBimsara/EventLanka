const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  payment_method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);