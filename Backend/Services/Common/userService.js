const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Event = require("../../models/Event");
const Organizer = require("../../models/Organizer");

/**
 * Get a user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

/**
 * Update a user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @param {File} profileImage - Optional profile image file
 * @returns {Promise<Object>} - Updated user profile
 */
const updateUserProfile = async (userId, updateData, profileImage = null) => {
  const updatedData = {};

  // Include profileImage if uploaded
  if (profileImage) {
    updatedData.profileImage = profileImage.filename;
  }

  // Only add fields that are provided in the request
  const allowedFields = [
    "name",
    "email",
    "firstName",
    "lastName",
    "phone",
    "address",
    "city",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updatedData[field] = updateData[field];
    }
  });

  // Handle username created from firstName and lastName
  if (updateData.username) {
    updatedData.name = updateData.username;
  }

  // Only handle password if provided
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updatedData.password = await bcrypt.hash(updateData.password, salt);
  }

  // Only update if there are fields to update
  if (Object.keys(updatedData).length === 0) {
    throw new Error("No fields to update");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  }).select("-password");

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

/**
 * Delete a user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Success message
 */
const deleteUserProfile = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error("User not found");
  }
  return { message: "User deleted successfully" };
};

/**
 * Update a user's status
 * @param {string} userId - User ID
 * @param {string} status - New status ('active' or 'banned')
 * @returns {Promise<Object>} - Updated user and success message
 */
const updateUserStatus = async (userId, status) => {
  // Ensure the status is either "active" or "banned"
  if (!["active", "banned"].includes(status)) {
    throw new Error("Invalid status value");
  }

  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });

  if (!user) {
    throw new Error("User not found");
  }

  return { message: `User status updated to ${status}`, user };
};

/**
 * Get all regular users
 * @returns {Promise<Array>} - List of regular users
 */
const getRegularUsers = async () => {
  return await User.find({ role: "user" });
};

/**
 * Get all non-admin users
 * @returns {Promise<Array>} - List of non-admin users
 */
const getAllNonAdminUsers = async () => {
  return await User.find({ role: { $ne: "admin" } });
};

/**
 * Get all organizers with details
 * @returns {Promise<Array>} - List of organizers with additional information
 */
const getAllOrganizers = async () => {
  // Populate the user field to get user details
  const organizers = await Organizer.find()
    .populate("user", "username email status createdAt")
    .lean();

  // Transform the data to match what frontend expects
  const formattedOrganizers = await Promise.all(
    organizers.map(async (organizer) => {
      // Count events for this organizer
      const eventCount = await Event.countDocuments({
        organizer_id: organizer.user._id,
      });

      return {
        _id: organizer._id,
        user: {
          _id: organizer.user._id,
          username: organizer.user.username,
          email: organizer.user.email,
        },
        phone: organizer.phone,
        bio: organizer.bio,
        website: organizer.website,
        status: organizer.user.status || "active",
        createdAt: organizer.user.createdAt,
        totalEvents: eventCount,
      };
    })
  );

  return formattedOrganizers;
};

/**
 * Get an organizer profile by ID
 * @param {string} organizerId - Organizer ID
 * @returns {Promise<Object>} - Organizer profile with details
 */
const getOrganizerProfile = async (organizerId) => {
  const organizer = await Organizer.findById(organizerId)
    .populate("user", "username email status createdAt phone address city")
    .lean();

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Count events for this organizer
  const eventCount = await Event.countDocuments({
    organizer_id: organizer.user._id,
  });

  // Merge the user and organizer data for the frontend
  return {
    _id: organizer._id,
    username: organizer.user.username,
    email: organizer.user.email,
    status: organizer.user.status || "active",
    createdAt: organizer.user.createdAt,
    phone: organizer.user.phone || organizer.phone,
    address: organizer.user.address,
    bio: organizer.bio,
    website: organizer.website,
    instagram: organizer.instagram,
    facebook: organizer.facebook,
    linkedin: organizer.linkedin,
    totalEvents: eventCount,
  };
};

/**
 * Update an organizer's status
 * @param {string} organizerId - Organizer ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Success message
 */
const updateOrganizerStatus = async (organizerId, status) => {
  const organizer = await Organizer.findById(organizerId);

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Update the status in the User model
  await User.findByIdAndUpdate(organizer.user, { status });

  return { message: "Organizer status updated successfully" };
};

/**
 * Get events associated with an organizer
 * @param {string} organizerId - Organizer ID
 * @returns {Promise<Array>} - List of events
 */
const getOrganizerEvents = async (organizerId) => {
  // Find the organizer by the provided ID
  const organizer = await Organizer.findById(organizerId);

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Fetch events associated with the organizer
  return await Event.find({ organizer_id: organizer.user._id });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  updateUserStatus,
  getRegularUsers,
  getAllNonAdminUsers,
  getAllOrganizers,
  getOrganizerProfile,
  updateOrganizerStatus,
  getOrganizerEvents,
};
