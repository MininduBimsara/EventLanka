const organizerService = require("../../Services/Organizer/organizerService");
const asyncHandler = require("express-async-handler");

// Get organizer profile
exports.getProfile = asyncHandler(async (req, res) => {
  try {
    const organizerData = await organizerService.getOrganizerProfile(
      req.user.id
    );
    res.status(200).json(organizerData);
  } catch (error) {
    // console.error("Error fetching organizer profile:", error);
    if (error.message === "Organizer not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Update organizer profile
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const profileImageFilename = req.file ? req.file.filename : null;

    // Parse categories if it's a string (from FormData)
    let updateData = { ...req.body };
    if (typeof updateData.categories === "string") {
      try {
        updateData.categories = JSON.parse(updateData.categories);
      } catch (parseError) {
        // console.error("Error parsing categories:", parseError);
        updateData.categories = [];
      }
    }

    // Convert string boolean to actual boolean for isPublic
    if (typeof updateData.isPublic === "string") {
      updateData.isPublic = updateData.isPublic === "true";
    }

    const updatedOrganizerData = await organizerService.updateOrganizerProfile(
      req.user.id,
      updateData,
      profileImageFilename
    );

    res.status(200).json({
      message: "Profile updated successfully",
      organizer: updatedOrganizerData,
    });
  } catch (error) {
    // console.error("Profile update error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update organizer settings
exports.updateSettings = asyncHandler(async (req, res) => {
  try {
    const updatedUser = await organizerService.updateOrganizerSettings(
      req.user.id,
      req.body
    );

    res.status(200).json({
      message: "Settings updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard data
exports.dashboard = asyncHandler(async (req, res) => {
  try {
    const dashboardData = await organizerService.getDashboardData(req.user.id);
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await organizerService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    if (
      error.message === "Current password and new password are required" ||
      error.message === "Current password is incorrect"
    ) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get all organizers with complete profiles
exports.getAllOrganizers = asyncHandler(async (req, res) => {
  try {
    const organizerData = await organizerService.getAllOrganizers();
    res.status(200).json(organizerData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = exports;
