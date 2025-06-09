// Services/Common/firebaseBackendBridge.js - New service to bridge Firebase and Backend
const passwordResetService = require("./passwordResetService");

/**
 * Generate a backend reset token when Firebase email is sent
 * This creates a token in your database that corresponds to the Firebase email
 */
const generateBackendTokenForFirebaseEmail = async (email) => {
  try {
    // Generate a backend reset token (but don't send email)
    const result = await passwordResetService.requestPasswordReset(email);

    // Return the reset token that should be used in the Firebase email
    return result.resetToken;
  } catch (error) {
    console.error("Failed to generate backend token:", error);
    throw error;
  }
};

module.exports = {
  generateBackendTokenForFirebaseEmail,
};
