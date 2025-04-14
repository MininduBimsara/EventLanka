const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Updated CORS configuration to allow credentials and specific origin
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // Ensure cookies can be sent cross-domain
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Changed to false for better security
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only true in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Updated for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/profile-images",
  express.static(path.join(__dirname, "uploads/profile-images"))
);
// app.use(
//   "/event-images",
//   express.static(path.join(__dirname, "uploads/event-images"))
// );
// app.use(
//   "/ticket-images",
//   express.static(path.join(__dirname, "uploads/ticket-images"))
// );
// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads/profile-images"))
// );

// Routes
const ticketRoutes = require("./routes/ticketRoutes");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthroutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/googleauth", googleAuthRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
