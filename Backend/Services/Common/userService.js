const bcrypt = require("bcryptjs");
const UserRepository = require("../../Repository/UserRepository");
const EventRepository = require("../../Repository/EventRepository");
const OrganizerRepository = require("../../Repository/OrganizerRepository");

/**
 * Get a user profile by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile
 */
const getUserProfile = async (userId) => {
  const user = await UserRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Remove password from response
  const { password, ...userProfile } = user.toObject();
  return userProfile;
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

  const updatedUser = await UserRepository.updateById(userId, updatedData);

  if (!updatedUser) {
    throw new Error("User not found");
  }

  // Remove password from response
  const { password, ...userProfile } = updatedUser.toObject();
  return userProfile;
};

/**
 * Delete a user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Success message
 */
const deleteUserProfile = async (userId) => {
  const deletedUser = await UserRepository.deleteById(userId);
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

  const user = await UserRepository.updateById(userId, { status });

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
  return await UserRepository.findByRole("user");
};

/**
 * Get all non-admin users
 * @returns {Promise<Array>} - List of non-admin users
 */
const getAllNonAdminUsers = async () => {
  return await UserRepository.findAll({ role: { $ne: "admin" } });
};

/**
 * Get all organizers with details
 * @returns {Promise<Array>} - List of organizers with additional information
 */
const getAllOrganizers = async () => {
  const organizers = await OrganizerRepository.findAll(
    {},
    {
      populate: "user",
    }
  );

  // Transform the data to match what frontend expects
  const formattedOrganizers = await Promise.all(
    organizers.map(async (organizer) => {
      // Count events for this organizer
      const eventCount = await EventRepository.count({
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
  const organizer = await OrganizerRepository.findById(organizerId, {
    user: "username email status createdAt phone address city",
  });

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Count events for this organizer
  const eventCount = await EventRepository.count({
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
  const organizer = await OrganizerRepository.findById(organizerId);

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Update the status in the User model
  await UserRepository.updateById(organizer.user, { status });

  return { message: "Organizer status updated successfully" };
};

/**
 * Get events associated with an organizer
 * @param {string} organizerId - Organizer ID
 * @returns {Promise<Array>} - List of events
 */
const getOrganizerEvents = async (organizerId) => {
  // Find the organizer by the provided ID
  const organizer = await OrganizerRepository.findById(organizerId);

  if (!organizer) {
    throw new Error("Organizer not found");
  }

  // Fetch events associated with the organizer
  return await EventRepository.findByOrganizerId(organizer.user._id);
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
