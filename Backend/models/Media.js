// Media.js
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  original_filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  file_type: {
    type: String,
    required: true,
    enum: ["image", "video", "document", "other"],
  },
  mime_type: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  is_public: {
    type: Boolean,
    default: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Media", mediaSchema);
