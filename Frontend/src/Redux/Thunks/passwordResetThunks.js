import { createAsyncThunk } from "@reduxjs/toolkit";
import { passwordResetApiService } from "../api/passwordResetApi";

// Async thunk for requesting password reset
export const forgotPassword = createAsyncThunk(
  "passwordReset/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      return await passwordResetApiService.forgotPassword(email);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  }
);

// Async thunk for verifying reset token
export const verifyResetToken = createAsyncThunk(
  "passwordReset/verifyResetToken",
  async (token, { rejectWithValue }) => {
    try {
      return await passwordResetApiService.verifyResetToken(token);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid or expired reset token."
      );
    }
  }
);

// Async thunk for resetting password
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      return await passwordResetApiService.resetPassword(token, password);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    }
  }
);
