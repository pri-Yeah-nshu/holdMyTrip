const {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  getTourBySlug,
} = require("../controllers/tourController");
const { protect, restrictedTo } = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(protect, restrictedTo("admin"), createTour)
  .get(getAllTours);

router
  .route("/:id")
  .patch(protect, restrictedTo("admin"), updateTour)
  .delete(protect, restrictedTo("admin"), deleteTour);

router.route("/:slug").get(getTourBySlug);

module.exports = router;
