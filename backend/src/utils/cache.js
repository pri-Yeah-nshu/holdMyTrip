const redisClient = require("../config/redis");

exports.clearTourCache = async () => {
  try {
    const keys = await redisClient.keys("tours:*");

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.log("⚠️ Cache invalidation failed");
  }
};
