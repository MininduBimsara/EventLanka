// src/api/authApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Create axios instance with default config
const authApiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API functions
export const authApi = {
  // User login
  login: async (credentials) => {
    try {
      const response = await authApiClient.post("/login", {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // User registration
  register: async (userData) => {
    try {
      let response;

      if (userData instanceof FormData) {
        // If FormData is provided (with file upload)
        response = await authApiClient.post("/register", userData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // For backward compatibility or when no file is uploaded
        response = await authApiClient.post("/register", {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role || "user", // Default to 'user' if not provided
        });
      }

      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // User logout
  logout: async () => {
    try {
      await authApiClient.post("/logout");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  },

  // Verify authentication status
  verifyAuth: async () => {
    try {
      const response = await authApiClient.get("/verify", {
        withCredentials: true,
      });

      if (response.data.user) {
        return response.data.user;
      } else {
        throw new Error("No user authenticated");
      }
    } catch (error) {
      console.error("Verification error:", error);
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};

export default authApi;
