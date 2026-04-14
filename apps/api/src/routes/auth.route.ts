import { Router } from "express";
import { forgotPassword, resetPassword, signin, signup } from "../controllers/auth.controller.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";



const router = Router();

router.post("/signup", strictLimiter, signup);

router.post("/login", strictLimiter, signin);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;