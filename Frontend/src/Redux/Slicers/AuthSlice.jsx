import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Adjust the base URL if needed

// Set axios to always send credentials
axios.defaults.withCredentials = true;

// Thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password,
      });

      // The cookie is now set by the backend, we just need the user data
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// Updated thunk for user registration to handle FormData with file upload
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, thunkAPI) => {
    try {
      // Check if userData is FormData (for file uploads) or regular object
      let response;

      if (userData instanceof FormData) {
        // If FormData is provided (with file upload)
        response = await axios.post(`${API_URL}/register`, userData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // For backward compatibility or when no file is uploaded
        response = await axios.post(`${API_URL}/register`, {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role || "user", // Default to 'user' if not provided
        });
      }

      // The cookie is now set by the backend, we just need the user data
      return response.data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call the logout API endpoint to clear the cookie
      await axios.post(`${API_URL}/logout`);

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return rejectWithValue("Logout failed");
    }
  }
);

// Thunk to verify authentication status using your verify endpoint.
export const verifyAuth = createAsyncThunk(
  "user/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Log to verify credentials are being sent
      console.log(
        "Verifying auth with credentials:",
        axios.defaults.withCredentials
      );

      const response = await axios.get(`${API_URL}/verify`, {
        withCredentials: true, // Explicitly include credentials for this request
      });

      // Log successful verification
      console.log("Auth verified:", response.data);

      // Expecting response.data.user to be valid if authenticated
      if (response.data.user) {
        return response.data.user;
      } else {
        return rejectWithValue("No user authenticated");
      }
    } catch (error) {
      console.error("Verification error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Clear errors
    clearErrors(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for logout thunk
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Clear auth data
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Set a specific error for logout failures
        state.loading = false;
        state.error = "Logout failed. Please try again.";
      })
      // Verify Authentication
      .addCase(verifyAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(verifyAuth.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; // Don't show error on verification fail
      });
  },
});

export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
