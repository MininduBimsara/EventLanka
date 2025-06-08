const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, "uploads");
const profileImagesDir = path.join(uploadsDir, "profile-images");
const eventImagesDir = path.join(uploadsDir, "event-images");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir, { recursive: true });
  console.log("Created profile-images directory");
}

if (!fs.existsSync(eventImagesDir)) {
  fs.mkdirSync(eventImagesDir, { recursive: true });
  console.log("Created event-images directory");
}

// Setup CORS properly
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://accounts.google.com",
    "https://eventlanka.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
    "Cache-Control",
    "Pragma",
    "Expires",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers",
  ],
  exposedHeaders: [
    "set-cookie",
    "Content-Disposition",
    "Content-Type",
    "Content-Length",
  ],
};

app.get("/", (req, res) => {
  res.send("EventLanka Backend is running 🚀");
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests properly

// Additional CORS middleware for file downloads
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "Content-Disposition, Content-Type, Content-Length"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  })
);

app.use(cookieParser());
app.use(express.json());

// Serve static files - FIXED PATHS
// This serves files at /uploads/profile-images/* from the uploads/profile-images directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Legacy routes for backward compatibility (if any existing code uses these)
app.use(
  "/profile-images",
  express.static(path.join(__dirname, "uploads/profile-images"))
);
app.use(
  "/event-images",
  express.static(path.join(__dirname, "uploads/event-images"))
);

// Routes
const ticketRoutes = require("./routes/ticketRoutes");
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthroutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/googleauth", googleAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/password-reset", passwordResetRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size too large" });
    }
  }
  console.error("Server error:", error);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(`Static files served from: ${path.join(__dirname, "uploads")}`);
});
