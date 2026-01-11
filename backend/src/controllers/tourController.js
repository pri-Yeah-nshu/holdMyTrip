const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
// Create a new tour {only for admin}
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// get all tours {all users}
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    const tours = await Tour.find().populate("createdBy", "name email role");
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
