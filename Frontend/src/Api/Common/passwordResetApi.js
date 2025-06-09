// import axios from "axios";

// const API_URL = `${import.meta.env.VITE_API_URL}/api/password-reset`;

// // Password Reset API functions
// export const passwordResetApiService = {
//   // Request password reset
//   forgotPassword: async (email) => {
//     const response = await axios.post(`${API_URL}/forgot-password`, { email });
//     return response.data;
//   },

//   // Verify reset token
//   verifyResetToken: async (token) => {
//     const response = await axios.get(`${API_URL}/reset-password/${token}`);
//     return response.data;
//   },

//   // Reset password
//   resetPassword: async (token, password) => {
//     const response = await axios.post(`${API_URL}/reset-password/${token}`, {
//       password,
//     });
//     return response.data;
//   },
// };

// export default passwordResetApiService;
