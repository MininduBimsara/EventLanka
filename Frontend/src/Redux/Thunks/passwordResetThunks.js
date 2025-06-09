// Redux/Thunks/passwordResetThunks.js - Hybrid approach
import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendPasswordReset } from "../../firebase/authService";
import { passwordResetApiService } from "../../Api/Common/passwordResetApi";

// Use Firebase for sending email
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

// Use backend for verifying token
export const verifyResetToken = createAsyncThunk(
  "passwordReset/verifyResetToken",
  async (token, { rejectWithValue }) => {
    try {
      const result = await passwordResetApiService.verifyResetToken(token);
      return { valid: true, message: result.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Use backend for resetting password
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const result = await passwordResetApiService.resetPassword(
        token,
        password
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
