const setRateLimit = require("express-rate-limit");

const rateLimit = (maxLimit) => {
  const rateLimitMiddleware = setRateLimit({
    windowMs: 60 * 1000,
    max: maxLimit,
    message: `You have exceeded your ${maxLimit} requests per minute limit.`,
    headers: true,
  });
  return rateLimitMiddleware
}

module.exports = rateLimit;