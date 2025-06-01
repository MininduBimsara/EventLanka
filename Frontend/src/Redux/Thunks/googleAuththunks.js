import { createAsyncThunk } from "@reduxjs/toolkit";
import { googleAuthApiService } from "../api/googleAuthApi";

// Async thunk for Google authentication
export const googleAuth = createAsyncThunk(
  "googleAuth/authenticate",
  async (tokenCredential, { rejectWithValue }) => {
    try {
      return await googleAuthApiService.authenticate(tokenCredential);
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
      return await googleAuthApiService.checkAuthStatus();
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
      return await googleAuthApiService.logout();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to logout"
      );
    }
  }
);
