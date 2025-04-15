// Discount.js
const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
  },
  discount_type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  discount_value: {
    type: Number,
    required: true,
    min: 0,
  },
  start_date: {
    type: Date,
    default: Date.now,
  },
  end_date: {
    type: Date,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  usage_limit: {
    type: Number,
    default: null,
  },
  usage_count: {
    type: Number,
    default: 0,
  },
  minimum_purchase_amount: {
    type: Number,
    default: 0,
  },
  applicable_events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

module.exports = mongoose.model("Discount", discountSchema);
