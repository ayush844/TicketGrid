import { Router } from "express";
import { getPresignUploadUrl } from "../controllers/upload.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/presigned-url", requireAuth, getPresignUploadUrl);

export default router;