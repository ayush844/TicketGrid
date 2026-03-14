import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getBookingById, getUserBooking } from "../controllers/userBooking.controller.js";


const router = Router();

router.get("/user/bookings", requireAuth, getUserBooking);
router.get("/bookings/:id", requireAuth, getBookingById);

export default router;