const redisClient = require("../config/redis");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const { clearTourCache } = require("../utils/cache");
// Create a new tour {only for admin}
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create({
      ...req.body,
      createdBy: req.user._id,
    });

    await clearTourCache();

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
  const cacheKey = `tours:${JSON.stringify(req.query)}`;
  try {
    // READ FROM REDIS
    try {
      const cacheData = await redisClient.get(cacheKey);
      if (cacheData) {
        const tour = JSON.parse(cacheData);
        return res.status(200).json({
          status: "success",
          source: "cache",
          result: tour.length,
          data: {
            tour,
          },
        });
      }
    } catch (err) {
      console.log("Reading from redis fail, falling back DB");
    }
    // FALLING TO DB
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    const tours = await Tour.find().populate("createdBy", "name email role");
    // SAVING IN REDIS
    try {
      await redisClient.setEx(cacheKey, 5 * 60, JSON.stringify(tours));
    } catch (err) {
      console.log("Writing fail...");
    }

    // RESPONSE
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

exports.deleteTour = async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndDelete(id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }

  await clearTourCache(); // Redis invalidation

  res.status(204).json({
    status: "success",
    data: null,
  });
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;

  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }

  await clearTourCache(); // Redis invalidation

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

exports.getTourBySlug = async (req, res) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug });

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};
