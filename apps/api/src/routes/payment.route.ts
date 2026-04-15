import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createCheckoutSession, processPayment } from "../controllers/payment.controller.js";



const router = Router();

router.post("/internal/process-payment", processPayment);

router.post("/bookings/:id/checkout", requireAuth, createCheckoutSession);



export default router;