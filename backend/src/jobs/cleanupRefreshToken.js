const RefreshToken = require("../models/refreshTokenModel");

exports.cleanupRefreshToken = async () => {
  try {
    const result = await RefreshToken.deleteMany({
      revoke: true,
    });
  } catch (err) {
    console.log("Error in refresh token cleanup....", err.message);
  }
};
