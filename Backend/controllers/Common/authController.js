const authService = require("../../Services/Common/authService");

// Registration handler
const register = async (req, res) => {
  try {
    const profileImageData = req.file ? req.file.filename : null;

    const result = await authService.registerUser(req.body, profileImageData);

    // Set cookie with JWT token
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(error.message === "User already exists" ? 400 : 500).json({
      message: error.message,
    });
  }
};

// Login handler
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    // Set cookie with JWT token
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(error.message === "Invalid credentials" ? 400 : 500).json({
      message: error.message,
    });
  }
};

// Verify token handler
const verifyToken = async (req, res) => {
  try {
    const userData = authService.getUserData(req.user);

    res.status(200).json({
      user: userData,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Logout handler
const logout = (req, res) => {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  // Send a successful response
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const syncFirebasePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // Sync password in backend database
    await authService.syncPasswordFromFirebase(email, newPassword);

    res.status(200).json({
      message: "Password synced successfully",
    });
  } catch (error) {
    console.error("Password sync error:", error);
    res.status(500).json({
      message: error.message || "Password sync failed",
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  logout,
  syncFirebasePassword,
};
