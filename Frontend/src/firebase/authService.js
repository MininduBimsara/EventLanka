import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// Send password reset email (Pure Firebase)
export const sendPasswordReset = async (email) => {
  try {
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);

    return {
      success: true,
      message: "Password reset email sent successfully! Check your inbox.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Verify the reset code from the email URL
export const verifyResetCode = async (oobCode) => {
  try {
    const email = await verifyPasswordResetCode(auth, oobCode);
    return { email, valid: true };
  } catch (error) {
    console.error("Verify reset code error:", error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Reset password with the code from email
export const resetPassword = async (oobCode, newPassword) => {
  try {
    // Get email before resetting (for backend sync)
    const email = await verifyPasswordResetCode(auth, oobCode);

    // Reset password in Firebase
    await confirmPasswordReset(auth, oobCode, newPassword);

    // Sync with backend - call your backend API to update password there too
    await syncPasswordWithBackend(email, newPassword);

    return {
      success: true,
      message: "Password has been reset successfully!",
      email: email,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    throw new Error(getErrorMessage(error.code));
  }
};

// Sync password with backend after Firebase reset
const syncPasswordWithBackend = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/sync-firebase-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
        newPassword: newPassword,
      }),
    });

    if (!response.ok) {
      throw new Error("Backend sync failed");
    }
  } catch (error) {
    console.error("Backend sync failed:", error);
    // Don't throw error here - Firebase reset was successful
    // Log this for monitoring but don't break user experience
  }
};

// Helper function for Firebase error messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/user-not-found": "No account found with this email address",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    "auth/network-request-failed":
      "Network error. Please check your connection",
    "auth/expired-action-code":
      "Password reset link has expired. Please request a new one.",
    "auth/invalid-action-code":
      "Invalid password reset link. Please request a new one.",
    "auth/weak-password": "Password should be at least 6 characters long",
    "auth/user-disabled": "This account has been disabled",
  };

  return errorMessages[errorCode] || "An unexpected error occurred";
};

// Keep these for potential future use (your existing auth doesn't use these)
export const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};
