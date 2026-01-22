const {
  createTour,
  getAllTours,
  updateTour,
  deleteTour,
  getTourBySlug,
} = require("../controllers/tourController");
const { rateLimiter } = require("../utils/rateLimiter");
const { protect, restrictedTo } = require("../middlewares/authMiddleware");
const express = require("express");
const router = express.Router();

router
  .route("/")
  .post(protect, restrictedTo("admin"), createTour)
  .get(
    rateLimiter({
      keyPrefix: "tours-read",
      maxRequests: 100,
      windowSeconds: 60,
    }),
    getAllTours
  );

router
  .route("/:id")
  .patch(protect, restrictedTo("admin"), updateTour)
  .delete(protect, restrictedTo("admin"), deleteTour);

router.route("/:slug").get(getTourBySlug);

module.exports = router;
