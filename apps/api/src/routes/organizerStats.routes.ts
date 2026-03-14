import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { getEventStats, getOrganizerDashboard, getOrganizerEvents } from "../controllers/organizerStats.controller.js";

const router = Router();

router.get("/organizer/events", requireAuth, requireRole("ADMIN"), getOrganizerEvents);

router.get("/organizer/dashboard", requireAuth, requireRole("ADMIN"), getOrganizerDashboard);

router.get("/organizer/events/:id/stats", requireAuth, requireRole("ADMIN"), getEventStats);

export default router;
