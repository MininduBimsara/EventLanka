import { createSlice } from "@reduxjs/toolkit";
import { googleAuthApiService } from "../api/googleAuthApi";
import {
  googleAuth,
  checkGoogleAuthStatus,
  googleLogout,
} from "../Thunks/googleAuththunks";

// Initial state for the Google Auth slice
const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
  isAuthenticated: false,
  message: "",
};

// Create the Google Auth slice
const googleAuthSlice = createSlice({
  name: "googleAuth",
  initialState,
  reducers: {
    // Reset the success and error states
    resetGoogleAuthStatus: (state) => {
      state.success = false;
      state.error = null;
      state.message = "";
    },
    // Clear the user data from state (for manual logout)
    clearGoogleUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      googleAuthApiService.clearLocalAuth();
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Auth
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.success = true;
        state.message = "Google authentication successful";
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Check Google Auth Status
      .addCase(checkGoogleAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkGoogleAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = action.payload ? true : false;
      })
      .addCase(checkGoogleAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Google Logout
      .addCase(googleLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.success = true;
        state.message = "Logged out successfully";
      })
      .addCase(googleLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Still clear user data even if the server logout fails
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const { resetGoogleAuthStatus, clearGoogleUser } =
  googleAuthSlice.actions;

// Export reducer
export default googleAuthSlice.reducer;
