const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Setup CORS properly
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://accounts.google.com",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests properly

// Setup session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
}));


app.use(cookieParser());
app.use(express.json());


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
const adminRoutes = require("./routes/adminRoutes");
const organizerRoutes = require("./routes/organizerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/googleauth", googleAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/organizer", organizerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
