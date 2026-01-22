const redisClient = require("../config/redis");

exports.rateLimiter = (keyPrefix, maxRequest, windowSecond) => {
  return async () => {
    try {
      const identifier = req.user.id || req.ip;
      const key = `${keyPrefix}:${identifier}`;
      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.expire(key, windowSecond);
      } else if (current > maxRequest) {
        return res.status(429).json({
          status: "fail",
          message: "too many requests, please try again later.",
        });
      }
    } catch (err) {
      next(); // redis is optional therefore it wont break the app
    }
  };
};
