const express = require("express");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  completeBooking,
} = require("../controllers/bookingController");
const { protect, restrictedTo } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const {
  createBookingValidator,
  cancelBookingValidator,
  completeBookingValidator,
} = require("../validator/bookingValidator");

const router = express.Router();
router.patch(
  "/:id/complete",
  protect,
  restrictedTo("admin"),
  completeBookingValidator,
  validate,
  completeBooking
);
router.patch(
  "/:id/cancel",
  protect,
  cancelBookingValidator,
  validate,
  cancelBooking
);
router.post("/", protect, createBookingValidator, validate, createBooking);
router.get("/my", protect, getMyBookings);
module.exports = router;
