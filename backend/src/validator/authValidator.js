const { body } = require("express-validator");

exports.validateSignup = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

exports.loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];
