import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createEventSchema, updateEventSchema } from "../validation/event.validation.js";
import { createEvent, updateEvent, publishEvent, cancelEvent, softDeleteEvent, getPublicEvents, getPublicEventBySlug, getUpcomingEvents, getPastEvents, getPublicEventById } from "../controllers/event.controller.js";

const router = Router();

router.post("/", requireAuth, requireRole("ADMIN"), validate(createEventSchema), createEvent);

router.put("/:id", requireAuth, requireRole("ADMIN"), validate(updateEventSchema), updateEvent);

router.patch("/:id/publish", requireAuth, requireRole("ADMIN"), publishEvent);

router.patch("/:id/cancel", requireAuth, requireRole("ADMIN"), cancelEvent);

router.patch("/:id/delete", requireAuth, requireRole("ADMIN"), softDeleteEvent);

router.get("/", getPublicEvents);

router.get("/upcoming", getUpcomingEvents);

router.get("/past", getPastEvents);

router.get("/id/:id", getPublicEventById);

router.get("/:slug", getPublicEventBySlug);

export default router;