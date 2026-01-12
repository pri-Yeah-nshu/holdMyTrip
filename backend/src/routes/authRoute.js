const express = require("express");
const authController = require("../controllers/authController");
const {
  loginLimiter,
  refreshLimiter,
  logoutLimiter,
} = require("../middlewares/rateLimiter");
const {
  validateSignup,
  loginValidator,
} = require("../validator/authValidator");
const validate = require("../middlewares/validateMiddleware");

const router = express.Router();

const { signup, login } = require("../controllers/authController");
router.post("/logout", logoutLimiter, authController.logout);
router.post(
  "/refresh-token",
  refreshLimiter,
  authController.refreshAccessToken
);
router.post("/signup", validateSignup, validate, signup);
router.post("/login", loginValidator, loginLimiter, validate, login);
module.exports = router;
