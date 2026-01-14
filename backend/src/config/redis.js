const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  if (err.code !== "ECONNREFUSED") {
    console.error("Redis error:", err);
  }
});

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.log("⚠️ Redis connection failed, continuing without cache");
  }
})();

module.exports = redisClient;
