import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";



const router = Router();

router.get("/less-protected", requireAuth, (req, res)=>{
    res.json({ message: "You are authenticated a user" });
})

router.get("/protected", requireAuth, requireRole("ADMIN"), (req, res)=>{
    res.json({ message: "You are authenticated as an admin" });
})

export default router;