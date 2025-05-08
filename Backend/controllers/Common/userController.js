const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const Event = require("../../models/Event");
const Organizer = require("../../models/Organizer");

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

    // Include profileImage if uploaded
    if (req.file) {
      updatedData.profileImage = req.file.filename;
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
   const { status } = req.body;

   // Ensure the status is either "active" or "banned"
   if (!["active", "banned"].includes(status)) {
     return res.status(400).json({ message: "Invalid status value" });
   }

   const user = await User.findByIdAndUpdate(
     req.params.id,
     { status },
     { new: true }
   );

   if (!user) {
     return res.status(404).json({ message: "User not found" });
   }

   res.status(200).json({ message: `User status updated to ${status}`, user });
 } catch (error) {
   res.status(500).json({ message: "Error updating user status" });
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

exports.getAllNonAdminUsers = async (req, res) => {
  try {
    // Fetch all users excluding admins
    const users = await User.find({ role: { $ne: "admin" } });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Organizer logic from User model
exports.getOrganizers = async (req, res) => {
  try {
    // Populate the user field to get user details
    const organizers = await Organizer.find()
      .populate("user", "username email status createdAt")
      .lean();

    // Transform the data to match what frontend expects
    const formattedOrganizers = await Promise.all(
      organizers.map(async (organizer) => {
        // You would count events here if you have an Event model
        // For example: const eventCount = await Event.countDocuments({ organizer: organizer._id });
        const eventCount = 0; // Replace with actual count if you have an Event model

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

    res.json(formattedOrganizers);
  } catch (err) {
    console.error("Error fetching organizers:", err);
    res.status(500).json({ error: "Error fetching organizers" });
  }
};

exports.getOrganizerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const organizer = await Organizer.findById(id)
      .populate("user", "username email status createdAt phone address city")
      .lean();

    if (!organizer) {
      return res.status(404).json({ error: "Organizer not found" });
    }

    // Merge the user and organizer data for the frontend
    const organizerProfile = {
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
      totalEvents: 0, // Replace with actual count if you have an Event model
    };

    res.json(organizerProfile);
  } catch (err) {
    console.error("Error fetching organizer profile:", err);
    res.status(500).json({ error: "Error fetching organizer profile" });
  }
};


exports.updateOrganizerStatus = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { status } = req.body;

    const organizer = await Organizer.findById(organizerId);

    if (!organizer) {
      return res.status(404).json({ error: "Organizer not found" });
    }

    // Update the status in the User model
    await User.findByIdAndUpdate(organizer.user, { status });

    res.json({ message: "Organizer status updated successfully" });
  } catch (err) {
    console.error("Error updating organizer status:", err);
    res.status(500).json({ error: "Error updating organizer status" });
  }
};

exports.getOrganizerEvents = async (req, res) => {
  try {
    // Find the organizer by the provided ID
    const organizer = await Organizer.findById(req.params.id);

    if (!organizer) {
      return res.status(404).json({ error: "Organizer not found" });
    }

    // Fetch events associated with the organizer
    const events = await Event.find({ organizer_id: organizer.user._id});

    res.json(events);
  } catch (err) {
    console.error("Error fetching organizer events:", err);
    res.status(500).json({ error: "Error fetching organizer events" });
  }
};

