import rateLimit from "express-rate-limit";
 

// Global limiter
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // max 100 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests, please try again later"
    }
});
 
 

// Strict limiter (for sensitive routes)
export const strictLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max: 10, // only 10 requests
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many attempts, slow down"
    }
});
 

// Booking limiter (prevent spam bookings)
export const bookingLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 min
    max: 5, // max 5 bookings
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many booking attempts. Please wait."
    }
});