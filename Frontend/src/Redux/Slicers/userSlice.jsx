import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Base API URL

// Set default axios config
axios.defaults.withCredentials = true;

// Helper function to safely get user ID
export const getUserId = (state) => {
  const { user } = state;

  // Check multiple possible locations for the user ID
  return (
    user?.userInfo?._id ||
    user?.userInfo?.id ||
    user?.user?._id ||
    user?.user?.id ||
    null // Return null if no ID is found
  );
};

// Function to get the current user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      // First try to get the user's details from the server
      // This assumes you have an endpoint that returns the current user's data
      const response = await axios.get(`${API_URL}/current`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);

// Async thunk for updating user profile

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());
      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      let response;
      // if there’s a new file, build FormData
      if (userData.profileImage instanceof File) {
        const formData = new FormData();
        Object.entries(userData).forEach(([key, val]) => {
          // append everything, including the file
          formData.append(key, val);
        });
        // **DON’T** set Content‑Type here—axios will do it for us
        response = await axios.put(`${API_URL}/${userId}`, formData, {
          withCredentials: true,
        });
      } else {
        // JSON payload for non‑file updates
        response = await axios.put(`${API_URL}/${userId}`, userData, {
          withCredentials: true,
        });
      }

      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
      return rejectWithValue(
        err.response?.data?.message ||
          `Update failed: ${err.message} (${err.response?.status})`
      );
    }
  }
);

export const updateProfilePhoto = createAsyncThunk(
  "user/updateProfilePhoto",
  async (photoData, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());

      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("profileImage", photoData);

      const response = await axios.put(`${API_URL}/${userId}/photo`, formData, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue("401 Unauthorized: Please log in again");
      }
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
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
