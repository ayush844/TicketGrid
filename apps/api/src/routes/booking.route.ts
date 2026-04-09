import { Router } from "express";
import { reserveTickets } from "../controllers/booking.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { bookingLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/events/:id/reserve", bookingLimiter, requireAuth, reserveTickets);

export default router;