import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for Google auth API endpoints
const AUTH_API_URL = `${import.meta.env.REACT_APP_API_URL}/api/auth`;

// Async thunk for Google authentication
export const googleAuth = createAsyncThunk(
  "googleAuth/authenticate",
  async (tokenCredential, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${AUTH_API_URL}/google`, {
        token: tokenCredential,
      });

      // Store the auth token in localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google authentication failed"
      );
    }
  }
);

// Async thunk for checking Google auth status
export const checkGoogleAuthStatus = createAsyncThunk(
  "googleAuth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${AUTH_API_URL}/user`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check authentication status"
      );
    }
  }
);

// Async thunk for Google logout
export const googleLogout = createAsyncThunk(
  "googleAuth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Make a request to the logout endpoint
      await axios.get(`${AUTH_API_URL}/logout`);

      // Remove the token from localStorage
      localStorage.removeItem("authToken");

      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to logout"
      );
    }
  }
);

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
      localStorage.removeItem("authToken");
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
