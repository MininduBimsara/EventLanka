// src/redux/userSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../Api/User/userApi"; // Import the API layer

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

// Thunk to fetch the current user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await userApi.fetchCurrentUserProfile();
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());
      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      const updatedUser = await userApi.updateProfile(userId, userData);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for updating profile photo
export const updateProfilePhoto = createAsyncThunk(
  "user/updateProfilePhoto",
  async (photoData, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());

      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      const result = await userApi.updateProfilePhoto(userId, photoData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Additional thunk for fetching user by ID (useful for admin features)
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const userData = await userApi.fetchUserById(userId);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Additional thunk for deleting user account
export const deleteUserAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState());
      if (!userId) {
        return rejectWithValue("User ID not found. Please log in again.");
      }

      const result = await userApi.deleteAccount(userId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
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
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.error = null;
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
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        // This could store in a different field if needed
        state.userInfo = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete user account
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.successMessage = "Account deleted successfully";
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearUserError,
  clearSuccessMessage,
  setUserInfo,
  clearUserInfo,
} = userSlice.actions;

export default userSlice.reducer;
