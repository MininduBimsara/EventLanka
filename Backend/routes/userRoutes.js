const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getCurrentUser,
  deleteUserProfile,
} = require("../controllers/Common/userController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set up multer for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile-images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, "profile-" + uniqueSuffix + fileExt);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

const upload = multer({ storage, fileFilter });

// Middleware to authenticate users
router.use(protect);

// Add endpoint to get the current user
router.get("/current", getCurrentUser);

// Add multer middleware for updating user profile with an image
router.put("/:id", upload.single("profileImage"), updateUserProfile);

router.get("/:id", getUserProfile);
router.delete("/:id", deleteUserProfile);

module.exports = router;
