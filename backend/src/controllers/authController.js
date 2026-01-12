const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const { signAccessToken, signRefreshToken } = require("../utils/token");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP CONTROLLER
exports.signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  // Check if all fields are provided
  if (!name || !email || !password) {
    return new (AppError("Please provide name, email and password", 400))();
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new AppError("User already exists with this email", 409);
  }
  if (password.length < 8) {
    return new AppError("Password must be at least 8 characters", 400);
  }
  // Hash the password
  const hashedPasswod = await bcrypt.hash(password, 12);
  // Create new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPasswod,
  });
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

// Login controller logic
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }
    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    // Generate JWT token
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
      status: "success",
      data: {
        refreshToken,
        accessToken,
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new AppError("Refresh token required", 401));
  }

  //  Verify token cryptographically
  const decoded = jwt.verify(refreshToken, process.env.JWT_RT_SECRET);

  //  Check DB (revoked or not)
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    revoked: false,
  });

  if (!storedToken) {
    return next(new AppError("Invalid refresh token", 403));
  }

  //  Issue new access token
  const newAccessToken = signAccessToken(decoded.id);

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { revoked: true }
    );
  }

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
