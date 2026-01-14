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
      // unique: true,
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

refreshTokenSchema.index({ token: 1 }, { unique: true });
refreshTokenSchema.index({ user: 1 });
refreshTokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("refreshToken", refreshTokenSchema);
