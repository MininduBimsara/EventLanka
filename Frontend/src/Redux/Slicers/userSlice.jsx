import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api"; // Base API URL

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      // Get the user ID from Redux state
      const { user } = getState();
      const userId = user.user?.id; // Access the MongoDB ID sent from backend
      
      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      const response = await axios.put(`${API_URL}/user/${userId}`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);


// Async thunk for updating profile photo
export const updateProfilePhoto = createAsyncThunk(
  "user/updateProfilePhoto",
  async (photoData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("profilePhoto", photoData);

      const response = await axios.put(
        `${API_URL}/user/profile/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile photo
      .addCase(updateProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = { ...state.userInfo, profilePhoto: action.payload };
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;
