const jwt = require("jsonwebtoken");

exports.signAccessToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_AT_SECRET, {
    expiresIn: process.env.JWT_AT_EXPIRES_IN,
  });
};

exports.signRefreshToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_RT_SECRET, {
    expiresIn: process.env.JWT_RT_EXPIRES_IN,
  });
};

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_RT_SECRET);
