import { createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "../../Api/User/userApi";

// Helper function to safely get user ID
export const getUserId = (state) => {
  const { user, profile } = state;

  // Check the actual paths where user data exists
  return (
    user?.user?._id || // state.user.user._id
    user?.user?.id || // state.user.user.id
    profile?.userInfo?._id || // state.profile.userInfo._id
    profile?.userInfo?.id || // state.profile.userInfo.id
    null
  );
};

// Thunk to fetch the current user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
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
  "user/updateProfile",
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
  "user/updatePhoto",
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

// Thunk for fetching user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const userData = await userApi.fetchUserById(userId);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for deleting user account
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
