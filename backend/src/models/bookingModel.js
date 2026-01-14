const mongoose = require("mongoose");
const { ref } = require("process");
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "booked", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ tour: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ user: 1, tour: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
