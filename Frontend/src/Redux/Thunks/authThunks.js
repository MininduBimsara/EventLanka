import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../Api/Common/authApi";

// Thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await authApi.login(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await authApi.register(userData);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk for user logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApi.logout();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to verify authentication status
export const verifyAuth = createAsyncThunk(
  "auth/verifyAuth",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.verifyAuth();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
