// firebase/authService.js - Simplified for email only
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
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    const { resetToken } = response.data;

    // Configure the action URL to use your backend token
    const actionCodeSettings = {
      url: `${window.location.origin}/reset-password/${resetToken}`,
      handleCodeInApp: false,
    };

    // Send Firebase email with custom URL
    await sendPasswordResetEmail(auth, email, actionCodeSettings);

    return { success: true, message: "Password reset email sent!" };
  } catch (error) {
    // If it's a Firebase error, use our error handler
    if (error.code) {
      throw new Error(getErrorMessage(error.code));
    }
    // If it's a backend error, pass it through
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Helper function for Firebase error messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/user-not-found": "No account found with this email address",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/too-many-requests": "Too many attempts. Please try again later",
  };

  return errorMessages[errorCode] || "An unexpected error occurred";
};

// Keep these for potential future use (Google login, etc.)
export const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

