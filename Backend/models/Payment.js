const mongoose = require("mongoose");

const paymentDetailsSchema = new mongoose.Schema({
  paypal_order_id: {
    type: String,
  },
  paypal_payer_id: {
    type: String,
    default: "unknown",
  },
  paypal_status: {
    type: String,
  },
  payment_intent_id: {
    // Add this field
    type: String,
  },
});

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
  payment_status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  payment_details: {
    type: paymentDetailsSchema, // Nested schema for payment details
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
