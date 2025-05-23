const User = require("../../models/User");
const Organizer = require("../../models/Organizer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {String} profileImageFilename - Uploaded profile image filename (optional)
 * @returns {Object} User data and JWT token
 */
const registerUser = async (userData, profileImageFilename = null) => {
  const { username, email, password, role } = userData;

  if (!username || !email || !password || !role) {
    throw new Error("All fields are required");
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  user = new User({
    username,
    email,
    password: hashedPassword,
    role,
    profileImage: profileImageFilename,
  });

  await user.save();

  // Create organizer profile if role is organizer
  if (role === "organizer") {
    await createOrganizerProfile(user._id);
  }

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: formatUserResponse(user, profileImageFilename),
  };
};

/**
 * Create a default organizer profile for a new organizer user
 * @param {String} userId - User ID
 */
const createOrganizerProfile = async (userId) => {
  const organizer = new Organizer({
    user: userId,
    phone: "",
    bio: "",
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    categories: [],
    isPublic: true,
  });
  await organizer.save();
};

/**
 * Authenticate a user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User data and JWT token
 */
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // Generate JWT token
  const token = generateToken(user._id, user.role);

  return {
    token,
    user: formatUserResponse(user),
  };
};

/**
 * Generate JWT token
 * @param {String} userId - User ID
 * @param {String} role - User role
 * @returns {String} JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

/**
 * Format user response object
 * @param {Object} user - User document
 * @returns {Object} Formatted user object
 */
const formatUserResponse = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage
      ? `/profile-images/${user.profileImage}`
      : null,
  };
};

/**
 * Get user data from token
 * @param {Object} user - User document
 * @returns {Object} User data
 */
const getUserData = (user) => {
  if (!user) throw new Error("Not authenticated");

  return formatUserResponse(user);
};

module.exports = {
  registerUser,
  loginUser,
  getUserData,
  generateToken,
  formatUserResponse,
};
