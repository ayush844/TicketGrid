import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createEventSchema, updateEventSchema } from "../validation/event.validation.js";
import { createEvent, updateEvent } from "../controllers/event.controller.js";

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), validate(createEventSchema), createEvent);

router.put("/:id", requireAuth, requireRole("ADMIN"), validate(updateEventSchema), updateEvent);

export default router;