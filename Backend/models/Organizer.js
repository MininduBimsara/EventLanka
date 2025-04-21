const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizerSchema = new Schema({
  // Reference to the user document
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  // Organizer-specific fields
  phone: {
    type: String,
  },
  bio: {
    type: String,
  },
  website: {
    type: String,
  },
  instagram: {
    type: String,
  },
  facebook: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  categories: {
    type: [String],
    default: [],
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  // Any other organizer-specific fields you need
});

const Organizer = mongoose.model("Organizer", organizerSchema);

module.exports = Organizer;
