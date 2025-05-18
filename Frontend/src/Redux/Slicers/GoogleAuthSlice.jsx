import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for Google auth API endpoints
const AUTH_API_URL = `http://localhost:5000/api/googleauth`;

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Async thunk for Google authentication
export const googleAuth = createAsyncThunk(
  "googleAuth/authenticate",
  async (tokenCredential, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${AUTH_API_URL}/google`,
        { token: tokenCredential },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
          },
        }
      );

      // Store the auth token in localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);

        // Set the token as default header for future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      console.error("Google auth error:", error);
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
      // First try to get the token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        return null; // No token found
      }

      // Set token in headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Check user status from the backend
      const response = await axios.get(`${AUTH_API_URL}/user`);

      return response.data;
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];

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
      await axios.get(`${AUTH_API_URL}/logout`, { withCredentials: true });

      // Remove the token from localStorage and headers
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];

      return null;
    } catch (error) {
      // Even if the server-side logout fails, clear local storage and headers
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      
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
      delete axios.defaults.headers.common["Authorization"];
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
