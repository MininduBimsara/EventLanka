import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendPasswordReset,
  verifyResetCode,
  resetPassword as firebaseResetPassword,
} from "../../firebase/authService";

// Send password reset email (Pure Firebase)
export const forgotPassword = createAsyncThunk(
  "passwordReset/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      const result = await sendPasswordReset(email);
      return result;
    } catch (error) {
      console.error("Forgot password thunk error:", error);
      return rejectWithValue(error.message || "Failed to send reset email");
    }
  }
);

// Verify reset code from email URL
export const verifyResetToken = createAsyncThunk(
  "passwordReset/verifyResetToken",
  async (oobCode, { rejectWithValue }) => {
    try {
      if (!oobCode) {
        throw new Error("Reset code is required");
      }

      const result = await verifyResetCode(oobCode);
      return {
        valid: true,
        email: result.email,
        message: "Reset code is valid",
      };
    } catch (error) {
      console.error("Verify token thunk error:", error);
      return rejectWithValue(error.message || "Invalid or expired reset code");
    }
  }
);

// Reset password with Firebase
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async ({ oobCode, password }, { rejectWithValue }) => {
    try {
      if (!oobCode) {
        throw new Error("Reset code is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const result = await firebaseResetPassword(oobCode, password);
      return result;
    } catch (error) {
      console.error("Reset password thunk error:", error);
      return rejectWithValue(error.message || "Failed to reset password");
    }
  }
);
