const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Event = require("../../models/Event");

// Get user profile (Only logged-in users can view their profile)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is already set by the protect middleware
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Return the user object (already excludes password because of the middleware)
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile (Only logged-in users can edit their own profile)
exports.updateUserProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Extract fields from request body
    const updatedData = {};

    // Only add fields that are provided in the request
    const allowedFields = [
      "name",
      "email",
      "profileImage",
      "firstName",
      "lastName",
      "phone",
      "address",
      "city",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updatedData[field] = req.body[field];
      }
    });

    // Handle username created from firstName and lastName
    if (req.body.username) {
      updatedData.name = req.body.username;
    }

    // Only handle password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(req.body.password, salt);
    }

    // Only update if there are fields to update
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user profile (Only logged-in users can delete their own profile)
exports.deleteUserProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ error: "Error updating user status" });
  }
};

// get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Organizer logic from User model
exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: "organizer" });
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching organizers" });
  }
};

exports.getOrganizerProfile = async (req, res) => {
  try {
    const organizer = await User.findOne({
      _id: req.params.id,
      role: "organizer",
    });
    if (!organizer)
      return res.status(404).json({ error: "Organizer not found" });
    res.json(organizer);
  } catch (err) {
    res.status(500).json({ error: "Error fetching organizer profile" });
  }
};

exports.updateOrganizerStatus = async (req, res) => {
  try {
    const organizer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "organizer" },
      { status: req.body.status },
      { new: true }
    );
    if (!organizer)
      return res.status(404).json({ error: "Organizer not found" });
    res.json({ message: "Organizer status updated", organizer });
  } catch (err) {
    res.status(500).json({ error: "Error updating organizer status" });
  }
};

exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer_id: req.params.id });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Error fetching organizer events" });
  }
};
