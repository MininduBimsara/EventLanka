// firebase/authService.js - Fixed implementation
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/password-reset`;

// Send password reset email with custom action URL
export const sendPasswordReset = async (email) => {
  try {
    // First, generate a backend reset token
    const response = await axios.post(`${API_URL}/forgot-password`, {
      email,
    });

    if (!response.data || !response.data.resetToken) {
      throw new Error("Failed to generate reset token");
    }

    const { resetToken } = response.data;

    // Configure the action URL to use your backend token
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password/${resetToken}`,
      handleCodeInApp: false,
    };

    // Send Firebase email with custom URL
    await sendPasswordResetEmail(auth, email, actionCodeSettings);

    return {
      success: true,
      message: "Password reset email sent successfully!",
    };
  } catch (error) {
    console.error("Password reset error:", error);

    // Handle Firebase errors
    if (error.code) {
      throw new Error(getErrorMessage(error.code));
    }

    // Handle backend/network errors
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error(error.message || "Failed to send password reset email");
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
  };

  return errorMessages[errorCode] || "An unexpected error occurred";
};

// Keep these for potential future use
export const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};
