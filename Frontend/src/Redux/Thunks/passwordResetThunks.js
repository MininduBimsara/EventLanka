import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendPasswordReset,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  verifyResetCode,
} from "../../firebase/authService";

// Async thunk for requesting password reset using Firebase
export const forgotPassword = createAsyncThunk(
  "passwordReset/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const result = await sendPasswordReset(email);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for verifying reset token (oobCode) using Firebase
export const verifyResetToken = createAsyncThunk(
  "passwordReset/verifyResetToken",
  async (oobCode, { rejectWithValue }) => {
    try {
      const email = await verifyResetCode(oobCode);
      return { email, valid: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for resetting password using Firebase
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const result = await firebaseConfirmPasswordReset(token, password);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
