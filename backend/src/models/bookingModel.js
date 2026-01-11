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
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ tour: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ tour: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
