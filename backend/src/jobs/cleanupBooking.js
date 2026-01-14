const Booking = require("../models/bookingModel");

exports.cleanupBooking = async () => {
  try {
    const result = await Booking.updateMany(
      {
        status: "pending",
        createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) },
      },
      { status: "pending" }
    );
    console.log(`🧹 Booking cleanup: ${result.modifiedCount} cancelled`);
  } catch (err) {
    console.log("Error in cleaning up Booking...", err.message);
  }
};
