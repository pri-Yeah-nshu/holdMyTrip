const mongoose = require("mongoose");
const logger = require("../utils/logger");

const DB_STRING = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB_STRING);
    logger.info("Database connected successfully");
  } catch (err) {
    logger.error(`${err.message}, Something wrong in DB connection.`);
    process.exit(1);
  }
};

module.exports = connectDB;
