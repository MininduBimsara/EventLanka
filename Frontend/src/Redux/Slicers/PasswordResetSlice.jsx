import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { passwordResetApiService } from "./api/passwordResetApi";

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

const initialState = {
  loading: false,
  message: null,
  error: null,
  tokenValid: false,
  resetSuccess: false,
};

const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    clearPasswordResetState: (state) => {
      state.message = null;
      state.error = null;
      state.tokenValid = false;
      state.resetSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle forgotPassword states
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle verifyResetToken states
      .addCase(verifyResetToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tokenValid = false;
      })
      .addCase(verifyResetToken.fulfilled, (state) => {
        state.loading = false;
        state.tokenValid = true;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tokenValid = false;
      })

      // Handle resetPassword states
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.resetSuccess = false;
      });
  },
});

export const { clearPasswordResetState } = passwordResetSlice.actions;

export default passwordResetSlice.reducer;
