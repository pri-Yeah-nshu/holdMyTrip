const { body, param } = require("express-validator");
exports.createBookingValidator = [
  body("tourId")
    .notEmpty()
    .withMessage("Tour ID is required")
    .isMongoId()
    .withMessage("provide valid tour ID."),
];

exports.cancelBookingValidator = [
  param("id").isMongoId().withMessage("Invalid booking id"),
];

exports.completeBookingValidator = [
  param("id").isMongoId().withMessage("Invalid booking id"),
];
