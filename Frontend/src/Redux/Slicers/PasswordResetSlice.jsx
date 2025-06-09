import { createSlice } from "@reduxjs/toolkit";
import {
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../Thunks/passwordResetThunks";

const initialState = {
  loading: false,
  message: null,
  error: null,
  tokenValid: false,
  resetSuccess: false,
  userEmail: null, // Added to store the email associated with the reset token
};

const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    clearPasswordResetState: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
      state.tokenValid = false;
      state.resetSuccess = false;
      state.userEmail = null;
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
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = null;
      })

      // Handle verifyResetToken states
      .addCase(verifyResetToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tokenValid = false;
      })
      .addCase(verifyResetToken.fulfilled, (state, action) => {
        state.loading = false;
        state.tokenValid = action.payload.valid;
        state.userEmail = action.payload.email;
        state.error = null;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.tokenValid = false;
        state.userEmail = null;
      })

      // Handle resetPassword states
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetSuccess = false;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.resetSuccess = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.resetSuccess = false;
        state.message = null;
      });
  },
});

export const { clearPasswordResetState } = passwordResetSlice.actions;

export default passwordResetSlice.reducer;
