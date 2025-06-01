import axios from "axios";

const AUTH_API_URL = "http://localhost:5000/api/googleauth";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Google Auth API functions
export const googleAuthApiService = {
  // Google authentication
  authenticate: async (tokenCredential) => {
    const response = await axios.post(
      `${AUTH_API_URL}/google`,
      { token: tokenCredential },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Store the auth token in localStorage
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);

      // Set the token as default header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  },

  // Check Google auth status
  checkAuthStatus: async () => {
    // First try to get the token from localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      return null; // No token found
    }

    // Set token in headers
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      // Check user status from the backend
      const response = await axios.get(`${AUTH_API_URL}/user`);
      return response.data;
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
      throw error;
    }
  },

  // Google logout
  logout: async () => {
    try {
      // Make a request to the logout endpoint
      await axios.get(`${AUTH_API_URL}/logout`, { withCredentials: true });
    } catch (error) {
      // Continue with cleanup even if server logout fails
      console.warn("Server logout failed, but cleaning up locally");
    } finally {
      // Always remove the token from localStorage and headers
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }

    return null;
  },

  // Manual token cleanup (for use in reducers)
  clearLocalAuth: () => {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  },
};

export default googleAuthApiService;
