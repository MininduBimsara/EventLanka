// const passwordResetService = require("../../Services/Common/passwordResetService");

// // Request password reset email
// const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const result = await passwordResetService.requestPasswordReset(email);
//     res.status(200).json(result);
//   } catch (error) {
//     res
//       .status(500)
//       .json({
//         message: error.message || "Something went wrong. Please try again.",
//       });
//   }
// };

// // Verify reset token
// const verifyResetToken = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const result = await passwordResetService.verifyToken(token);
//     res.status(200).json(result);
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         message:
//           error.message || "Password reset token is invalid or has expired",
//       });
//   }
// };

// // Reset password
// const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     if (!password) {
//       return res.status(400).json({ message: "Password is required" });
//     }

//     const result = await passwordResetService.resetUserPassword(
//       token,
//       password
//     );

//     // Set the cookie for auto-login
//     res.cookie("token", result.token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     });

//     res.status(200).json({
//       message: result.message,
//       token: result.token,
//       user: result.user,
//     });
//   } catch (error) {
//     res
//       .status(400)
//       .json({
//         message: error.message || "Something went wrong. Please try again.",
//       });
//   }
// };

// module.exports = {
//   forgotPassword,
//   verifyResetToken,
//   resetPassword,
// };
