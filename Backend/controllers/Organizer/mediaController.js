const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const Event = require("../../models/Event");
const Media = require("../../models/Media"); // You'll need to create this model

// Upload media files
exports.upload = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Only organizers and admins can upload files
  if (req.user.role !== "organizer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized to upload media" });
  }

  const { eventId } = req.body;

  // If eventId is provided, verify that the user is authorized for this event
  if (eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.organizer_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to upload media for this event" });
    }
  }

  // Process uploaded files
  const uploadedFiles = [];

  for (const file of req.files) {
    const media = new Media({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      user_id: req.user.id,
      event_id: eventId || null,
      type: file.mimetype.startsWith("image/") ? "image" : "document",
    });

    await media.save();
    uploadedFiles.push({
      id: media._id,
      filename: media.filename,
      originalname: media.originalname,
      url: `/media/${media.filename}`,
      type: media.type,
    });
  }

  res.status(201).json({
    message: "Files uploaded successfully",
    files: uploadedFiles,
  });
});

// Get all media files for a user/organizer
exports.getAll = asyncHandler(async (req, res) => {
  const { eventId } = req.query;

  // Build query
  const query = { user_id: req.user.id };

  // If eventId is provided, filter by event
  if (eventId) {
    query.event_id = eventId;

    // Verify that the user is authorized for this event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.organizer_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to access media for this event" });
    }
  }

  // Admins can view all media if no specific filters are provided
  if (req.user.role === "admin" && !eventId) {
    delete query.user_id;
  }

  const media = await Media.find(query).sort({ createdAt: -1 });

  const formattedMedia = media.map((file) => ({
    id: file._id,
    filename: file.filename,
    originalname: file.originalname,
    url: `/media/${file.filename}`,
    type: file.type,
    size: file.size,
    uploadedAt: file.createdAt,
    eventId: file.event_id,
  }));

  res.status(200).json(formattedMedia);
});

// Delete a media file
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const media = await Media.findById(id);
  if (!media) {
    return res.status(404).json({ message: "File not found" });
  }

  // Check if user is authorized to delete this file
  if (media.user_id.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Unauthorized to delete this file" });
  }

  // Delete file from filesystem
  try {
    fs.unlinkSync(media.path);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Continue even if file deletion fails
  }

  // Remove from database
  await media.deleteOne();

  res.status(200).json({ message: "File deleted successfully" });
});

module.exports = exports;
