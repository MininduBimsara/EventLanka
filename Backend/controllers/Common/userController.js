const userService = require("../../Services/Common/userService");

// Get user profile (Only logged-in users can view their profile)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
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

    const updatedUser = await userService.updateUserProfile(
      req.params.id,
      req.body,
      req.file
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(error.message === "No fields to update" ? 400 : 500).json({
      message: error.message,
    });
  }
};

// Delete user profile (Only logged-in users can delete their own profile)
exports.deleteUserProfile = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await userService.deleteUserProfile(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await userService.updateUserStatus(req.params.id, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.message === "User not found" ? 404 : 400).json({
      message: error.message || "Error updating user status",
    });
  }
};

// get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getRegularUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

exports.getAllNonAdminUsers = async (req, res) => {
  try {
    const users = await userService.getAllNonAdminUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Organizer logic from User model
exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await userService.getAllOrganizers();
    res.json(organizers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching organizers" });
  }
};

exports.getOrganizerProfile = async (req, res) => {
  try {
    const organizerProfile = await userService.getOrganizerProfile(
      req.params.id
    );
    res.json(organizerProfile);
  } catch (err) {
    res
      .status(404)
      .json({ error: err.message || "Error fetching organizer profile" });
  }
};

exports.updateOrganizerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await userService.updateOrganizerStatus(
      req.params.organizerId,
      status
    );
    res.json(result);
  } catch (err) {
    res.status(err.message === "Organizer not found" ? 404 : 500).json({
      error: err.message || "Error updating organizer status",
    });
  }
};

exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await userService.getOrganizerEvents(req.params.id);
    res.json(events);
  } catch (err) {
    res.status(err.message === "Organizer not found" ? 404 : 500).json({
      error: err.message || "Error fetching organizer events",
    });
  }
};
