const { createTour, getAllTours } = require("../controllers/tourController");
const { protect, restrictedTo } = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(protect, restrictedTo("admin"), createTour)
  .get(getAllTours);

module.exports = router;
