import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserProfile,
  updateUserProfile,
  updateProfilePhoto,
  fetchUserById,
  deleteUserAccount,
} from "../thunks/userThunks";

const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
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
