import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Adjust the base URL if needed

// Thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password,
      });
      const { token, user } = response.data;
      // Store the JWT in sessionStorage
      sessionStorage.setItem("token", token);
      return { token, user };
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

      const { token, user } = response.data;
      // Store the JWT in sessionStorage
      sessionStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Add a logout thunk
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      // Get the token from the Redux state
      const token = thunkAPI.getState().user.token;

      // Make the API call to logout
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true };
    } catch (error) {
      console.error("Logout API call failed", error);
      // Still return success - we'll logout locally regardless
      // of whether the API call succeeds
      return { success: true };
    }
  }
);

// Thunk to verify authentication status using your verify endpoint.
export const verifyAuth = createAsyncThunk(
  "user/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/verify`, {
        withCredentials: true,
      });
      // Expecting response.data.user to be valid if authenticated
      if (response.data.user) {
        return response.data.user;
      } else {
        return rejectWithValue("No user authenticated");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  user: null,
  token: sessionStorage.getItem("token") || null,
  isAuthenticated: !!sessionStorage.getItem("token"), // Add isAuthenticated
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // For logout functionality
    logout(state) {
      sessionStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"]; // Clear global header
      state.user = null;
      state.token = null;
      state.isAuthenticated = false; // Update isAuthenticated
    },
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // Update isAuthenticated
        // Set global Authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.payload.token}`;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // Update isAuthenticated
        // Set global Authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${action.payload.token}`;
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
        sessionStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        state.user = null;
        state.token = null;
        state.isAuthenticated = false; // Update isAuthenticated
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear auth data even if API call fails
        sessionStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        state.user = null;
        state.token = null;
        state.isAuthenticated = false; // Update isAuthenticated
        state.loading = false;
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
        state.error = action.payload || "Authentication verification failed";
      });
  },
});

export const { logout, clearErrors } = userSlice.actions;
export default userSlice.reducer;
