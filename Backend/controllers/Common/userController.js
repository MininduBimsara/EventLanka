const User = require("../../models/User");
const bcrypt = require("bcryptjs");

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

// Update user profile (Only logged-in users can edit their own profile)
exports.updateUserProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, email, password, profileImage } = req.body;
    const updatedData = { name, email, profileImage };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
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
    const organizer = await User.findOne({ _id: req.params.id, role: "organizer" });
    if (!organizer) return res.status(404).json({ error: "Organizer not found" });
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
    if (!organizer) return res.status(404).json({ error: "Organizer not found" });
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