const express = require("express");
const {
  validateSignup,
  loginValidator,
} = require("../validator/authValidator");
const validate = require("../middlewares/validateMiddleware");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

router.post("/signup", validateSignup, validate, signup);
router.post("/login", loginValidator, validate, login);
module.exports = router;
