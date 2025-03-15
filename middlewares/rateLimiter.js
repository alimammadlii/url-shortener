import rateLimit from "express-rate-limit";


const urlShortenLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Allow 10 requests per IP per hour
    message: "Too many URL shorten requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

export default urlShortenLimiter;