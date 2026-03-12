import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";



const router = Router();


router.post("/bookings/:id/checkout", requireAuth, createCheckoutSession);



export default router;