const cron = require("node-cron");
const { cleanupBooking } = require("./cleanupBooking");
const { cleanupRefreshToken } = require("./cleanupRefreshToken");

const startJob = () => {
  cron.schedule("0 * * * *", async () => {
    console.log("⏰ Running refresh token cleanup job");
    await cleanupRefreshToken();
  });
  cron.schedule("*/10 * * * *", async () => {
    console.log("⏰ Running booking cleanup job");
    await cleanupBooking();
  });
};

module.exports = startJob;
