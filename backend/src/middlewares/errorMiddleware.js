const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, {
    stack: err.stack,
  });

  // DEVELOPMENT: show full error
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }

  // PRODUCTION: hide internals
  else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // programming or unknown error
      console.error("ERROR 💥", err);

      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
};
