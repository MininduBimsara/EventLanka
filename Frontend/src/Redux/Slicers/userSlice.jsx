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

      // Filter out empty fields to only send the updated ones
      const filteredUserData = {};
      Object.keys(userData).forEach((key) => {
        // Only include fields that have values
        if (
          userData[key] !== undefined &&
          userData[key] !== null &&
          userData[key] !== ""
        ) {
          filteredUserData[key] = userData[key];
        }
      });

      // Check if profileImage is a File object (new upload)
      if (filteredUserData.profileImage instanceof File) {
        // Create FormData for file upload
        const formData = new FormData();

        // Add text fields to FormData
        Object.keys(filteredUserData).forEach((key) => {
          if (key !== "profileImage") {
            formData.append(key, filteredUserData[key]);
          }
        });

        // Add the file
        formData.append("profileImage", filteredUserData.profileImage);

        const response = await axios.put(
          `${API_URL}/user/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // This is the key setting for sending cookies
          }
        );
        return response.data;
      } else {
        // If no new file, just send regular JSON data
        const response = await axios.put(
          `${API_URL}/user/${userId}`,
          filteredUserData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // This is the key setting for sending cookies
          }
        );
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  }
);

export const updateProfilePhoto = createAsyncThunk(
  "user/updateProfilePhoto",
  async (photoData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState();
      const userId = user.user?.id;

      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("profileImage", photoData);

      const response = await axios.put(
        `${API_URL}/user/${userId}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // This is the key setting for sending cookies
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Photo update failed"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile photo
      .addCase(updateProfilePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProfilePhoto.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userInfo) {
          state.userInfo = {
            ...state.userInfo,
            profileImage: action.payload.profileImage,
          };
        }
        state.successMessage = "Profile photo updated successfully";
      })
      .addCase(updateProfilePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, clearSuccessMessage } = userSlice.actions;

export default userSlice.reducer;
