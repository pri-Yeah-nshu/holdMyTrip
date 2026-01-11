const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./src/app");
const connectDB = require("./src/config/db");
connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION 💥", err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed.");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed.");
      process.exit(0);
    });
  });
});
