const express = require("express");
const cors = require("cors");
const app = express();
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const authRoute = require("./routes/authRoute");
const tourRoute = require("./routes/tourRoutes");
const bookingRoute = require("./routes/bookingRoutes");
const globalErrorHandler = require("./middlewares/errorMiddleware");
const { protect } = require("./middlewares/authMiddleware");
app.use(express.json());
app.use(helmet());
// app.use(
//   mongoSanitize({
//     replaceWith: "_",
//   })
// );
// app.use(xss());
const rateLimit = rateLimiter({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many request from this IP, pleases try again later.",
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/api", rateLimit);
app.use("/api/auth", authRoute);
app.use("/api/tours", tourRoute);
app.use("/api/bookings", bookingRoute);
app.use(cors());
app.use(globalErrorHandler);
app.get("/api/protected", protect, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "You have accessed a protected route",
    data: { user: req.user },
  });
});

app.get("/", (req, res) => {
  res.send("API is Running...");
});

module.exports = app;
