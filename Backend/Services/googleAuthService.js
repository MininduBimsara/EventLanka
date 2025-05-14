// Backend: googleAuthService.js
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify a Google token ID
const verifyGoogleToken = async (token) => {
  try {
    // Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Extract user details from payload
    const { sub: googleId, name, email, picture } = payload;

    // Find or create the user
    let user = await User.findOne({ googleId });

    if (!user) {
      // Create new user if not found
      user = new User({
        name,
        email,
        username: email.split("@")[0],
        googleId,
        emailVerified: true,
        profileImage: picture || null,
      });
      await user.save();
    } else {
      // Update existing user info if needed
      user.name = name;
      user.email = email;
      user.profileImage = picture || user.profileImage;
      await user.save();
    }

    // Generate JWT token
    const authToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return user data and token
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage,
      },
      token: authToken,
    };
  } catch (error) {
    // console.error("Google auth verification error:", error);
    throw new Error("Failed to verify Google token");
  }
};

module.exports = {
  verifyGoogleToken,
};
