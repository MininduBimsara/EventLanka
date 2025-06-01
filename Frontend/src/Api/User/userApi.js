// src/api/userApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Create axios instance with default config
const userApiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// User API functions
export const userApi = {
  // Fetch current user profile
  fetchCurrentUserProfile: async () => {
    try {
      const response = await userApiClient.get("/current", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    try {
      let response;

      // Check if there's a new file, build FormData
      if (userData.profileImage instanceof File) {
        const formData = new FormData();
        Object.entries(userData).forEach(([key, val]) => {
          // Append everything, including the file
          formData.append(key, val);
        });

        // Don't set Content-Type here—axios will do it for us
        response = await userApiClient.put(`/${userId}`, formData, {
          withCredentials: true,
        });
      } else {
        // JSON payload for non-file updates
        response = await userApiClient.put(`/${userId}`, userData, {
          withCredentials: true,
        });
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("401 Unauthorized: Please log in again");
      }
      throw new Error(
        error.response?.data?.message ||
          `Update failed: ${error.message} (${error.response?.status})`
      );
    }
  },

  // Update profile photo specifically
  updateProfilePhoto: async (userId, photoData) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", photoData);

      const response = await userApiClient.put(`/${userId}/photo`, formData, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("401 Unauthorized: Please log in again");
      }
      throw new Error(error.response?.data?.message || "Photo update failed");
    }
  },

  // Fetch user by ID (additional utility function)
  fetchUserById: async (userId) => {
    try {
      const response = await userApiClient.get(`/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user");
    }
  },

  // Delete user account (additional utility function)
  deleteAccount: async (userId) => {
    try {
      const response = await userApiClient.delete(`/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete account"
      );
    }
  },
};

export default userApi;
