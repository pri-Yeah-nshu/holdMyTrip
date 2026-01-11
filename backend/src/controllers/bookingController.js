const mongoose = require("mongoose");
const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");

// Create a new booking {only for authenticated users}
exports.createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const { tourId } = req.body;
    const tour = await Tour.findOne({ _id: tourId }).session(session);
    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }
    const bookedCount = await Booking.countDocuments({
      tour: tourId,
      status: "booked",
    }).session(session);
    if (bookedCount >= tour.maxGroupSize) {
      return res.status(400).json({
        status: "fail",
        message: "Tour is fully booked",
      });
    }
    const newBooking = await Booking.findOne({
      user: req.user._id,
      tour: tourId,
    }).session(session);

    if (newBooking) {
      return res.status(400).json({
        status: "fail",
        message: "You have already booked this tour",
      });
    }
    const booking = await Booking.create(
      [
        {
          user: req.user._id,
          tour: tourId,
          price: tour.price,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: "success",
      data: { booking },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }
    booking.status = "cancelled";
    await booking.save();
    res.status(200).json({
      status: "success",
      data: { booking },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not Found",
      });
    }
    if (booking.status !== "booked") {
      return res.status(400).json({
        status: "fail",
        message: "Only booked Booking can be completed",
      });
    }
    booking.status = "completed";
    await booking.save();
    res.status(200).json({
      status: "success",
      data: { booking },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
