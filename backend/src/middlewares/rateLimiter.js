const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 requests per IP
  message: {
    status: "fail",
    message: "Too many login attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.refreshLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 10,
  message: {
    status: "fail",
    message: "Too many refresh attempts. Try again later.",
  },
});

exports.logoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
});
