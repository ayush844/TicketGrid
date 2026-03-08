import { Router } from "express";
import { reserveTickets } from "../controllers/booking.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/events/:id/reserve", requireAuth, reserveTickets);

export default router;