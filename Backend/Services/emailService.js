// Services/Common/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your app password (not normal password)
  },
});

const sendPasswordResetEmail = async (to, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Request",
    html: `
      <h3>Password Reset Request</h3>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>This link will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Password reset email sent to ${to}`);
};

module.exports = {
  sendPasswordResetEmail,
};
