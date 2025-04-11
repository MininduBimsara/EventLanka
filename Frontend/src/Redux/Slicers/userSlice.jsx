import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Adjust the base URL if needed

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

const initialState = {
  user: null,
  token: sessionStorage.getItem("token") || null,
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
      state.user = null;
      state.token = null;
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearErrors } = userSlice.actions;
export default userSlice.reducer;
