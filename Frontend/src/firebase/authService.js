import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config";

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent!" };
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Confirm password reset
export const confirmPasswordReset = async (code, newPassword) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    return { success: true, message: "Password reset successfully!" };
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Verify reset code
export const verifyResetCode = async (code) => {
  try {
    const email = await verifyPasswordResetCode(auth, code);
    return email;
  } catch (error) {
    throw new Error(getErrorMessage(error.code));
  }
};

// Helper function for error messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    "auth/user-not-found": "No account found with this email address",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/too-many-requests": "Too many attempts. Please try again later",
    "auth/expired-action-code":
      "This link has expired. Please request a new one",
    "auth/invalid-action-code": "Invalid link. Please check the URL",
    "auth/weak-password": "Password must be at least 6 characters long",
  };

  return errorMessages[errorCode] || "An unexpected error occurred";
};

// Optional: Other auth functions you might need
export const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};
