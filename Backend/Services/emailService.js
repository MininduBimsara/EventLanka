// emailService.js
const nodemailer = require("nodemailer");

/**
 * Creates and returns a configured nodemailer transporter using Mailtrap
 * @returns {nodemailer.Transporter} Configured nodemailer transporter
 */
const createTransporter = () => {
  // For development, use Mailtrap (free email testing service)
  if (process.env.NODE_ENV === "development") {
    // Log credentials to verify they're loaded (don't do this in production!)
    // console.log("Mailtrap credentials:", {
    //   user: process.env.MAILTRAP_USER ? "Set" : "Not set",
    //   pass: process.env.MAILTRAP_PASSWORD ? "Set" : "Not set",
    // });

    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  // For production, you can use your actual email service
  // console.log("Gmail credentials:", {
  //   user: process.env.EMAIL_USER ? "Set" : "Not set",
  //   pass: process.env.EMAIL_PASSWORD ? "Set" : "Not set",
  // });

  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Sends a password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetUrl - Password reset URL
 * @returns {Promise} Promise resolving to email info
 */
const sendPasswordResetEmail = async (to, resetUrl) => {
  try {
    const transporter = createTransporter();

    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Please click on the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking="off">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    // Log email details (remove in production)
    // console.log(`Attempting to send email to: ${to}`);

    const mailOptions = {
      from:
        process.env.NODE_ENV === "development"
          ? "test@example.com"
          : process.env.EMAIL_FROM,
      to,
      subject: "Password Reset Request",
      html: message,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    // console.error("Error sending email:", error);
    throw error; // Re-throw to handle in the controller
  }
};

module.exports = {
  sendPasswordResetEmail,
};
