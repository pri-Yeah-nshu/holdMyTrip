const jwt = require("jsonwebtoken");

exports.signAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_AT_SECRET,
    {
      expiresIn: process.env.JWT_AT_EXPIRES_IN,
    }
  );
};

exports.signRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_RT_SECRET, {
    expiresIn: process.env.JWT_RT_EXPIRES_IN,
  });
};

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_RT_SECRET);
