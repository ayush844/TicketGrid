import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createEventSchema } from "../validation/event.validation.js";
import { createEvent } from "../controllers/event.controller.js";

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), validate(createEventSchema), createEvent);


export default router;