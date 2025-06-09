// Redux/Thunks/passwordResetThunks.js - Fixed implementation
import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendPasswordReset } from "../../firebase/authService";
import { passwordResetApiService } from "../../Api/Common/passwordResetApi";

// Use Firebase for sending email (which calls backend to generate token)
export const forgotPassword = createAsyncThunk(
  "passwordReset/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      // Input validation
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

// Use backend for verifying token
export const verifyResetToken = createAsyncThunk(
  "passwordReset/verifyResetToken",
  async (token, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error("Reset token is required");
      }

      const result = await passwordResetApiService.verifyResetToken(token);
      return {
        valid: true,
        message: result.message,
        email: result.email,
      };
    } catch (error) {
      console.error("Verify token thunk error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid or expired reset token";
      return rejectWithValue(errorMessage);
    }
  }
);

// Use backend for resetting password
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error("Reset token is required");
      }

      if (!password) {
        throw new Error("Password is required");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      const result = await passwordResetApiService.resetPassword(
        token,
        password
      );
      return result;
    } catch (error) {
      console.error("Reset password thunk error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password";
      return rejectWithValue(errorMessage);
    }
  }
);
