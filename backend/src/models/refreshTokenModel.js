const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    token: {
      type: String,
      require: true,
      unique: true,
    },
    expiredAt: {
      type: Date,
      require: true,
    },
    revoke: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("refreshToken", refreshTokenSchema);
