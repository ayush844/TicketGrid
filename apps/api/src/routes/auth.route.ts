import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import { strictLimiter } from "../middlewares/rateLimit.middleware.js";



const router = Router();

router.post("/signup", strictLimiter, signup);

router.post("/login", strictLimiter, signin);

export default router;