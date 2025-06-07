const adminService = require("../../Services/Admin/adminService");

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStatistics();
    res.json(stats);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Server error in dashboard stats" });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await adminService.getPlatformSettings(req.user.id);
    res.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);

    // Handle specific authorization errors
    if (err.message.includes("Not authorized")) {
      return res.status(403).json({ error: err.message });
    }

    res.status(500).json({ error: "Server error while retrieving settings" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updatedSettings = await adminService.updatePlatformSettings(
      req.user.id,
      req.body
    );
    res.json(updatedSettings);
  } catch (err) {
    console.error("Update settings error:", err);

    // Handle specific authorization errors
    if (err.message.includes("Not authorized")) {
      return res.status(403).json({ error: err.message });
    }

    res.status(500).json({ error: "Server error while updating settings" });
  }
};

exports.changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const result = await adminService.changeAdminPassword(
      req.user.id,
      oldPassword,
      newPassword
    );

    res.json(result);
  } catch (err) {
    console.error("Change password error:", err);

    // Handle specific validation errors
    if (err.message.includes("All fields are required")) {
      return res.status(400).json({ error: err.message });
    }

    if (err.message.includes("User not found")) {
      return res.status(404).json({ error: err.message });
    }

    if (
      err.message.includes("Unauthorized") ||
      err.message.includes("incorrect")
    ) {
      return res.status(401).json({ error: err.message });
    }

    if (err.message.includes("not an admin")) {
      return res.status(403).json({ error: err.message });
    }

    res.status(500).json({ error: "Server error while changing password" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    console.log("🔍 updateAdminProfile called with user ID:", req.user.id);
    console.log("🔍 Request body:", req.body);

    const result = await adminService.updateAdminProfile(req.user.id, req.body);

    console.log("✅ Profile update successful:", result);
    res.json(result);
  } catch (err) {
    console.error("❌ Update admin profile error:", err);

    // Handle specific errors
    if (err.message.includes("User not found")) {
      return res.status(404).json({ error: err.message });
    }

    if (err.message.includes("not an admin")) {
      return res.status(403).json({ error: err.message });
    }

    res
      .status(500)
      .json({ error: "Server error while updating admin profile" });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    console.log("🔍 getAdminProfile called with user ID:", req.user.id);
    console.log("🔍 User object:", req.user);

    const adminProfile = await adminService.getAdminProfile(req.user.id);

    console.log("✅ Profile fetch successful:", adminProfile);
    res.json(adminProfile);
  } catch (err) {
    console.error("❌ Get admin profile error:", err);
    console.error("❌ Error stack:", err.stack);

    // Handle specific errors
    if (
      err.message.includes("User not found") ||
      err.message.includes("not found")
    ) {
      return res.status(404).json({ error: err.message });
    }

    if (err.message.includes("not an admin")) {
      return res.status(403).json({ error: err.message });
    }

    res.status(500).json({ error: "Server error while getting admin profile" });
  }
};
