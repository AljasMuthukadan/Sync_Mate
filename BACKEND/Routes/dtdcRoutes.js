import express from "express";
import { getCaptcha, checkTracking } from "../Controllers/dtdcController.js";

const router = express.Router();

// 🟠 Captcha & Tracking routes
router.get("/captcha", getCaptcha);
router.post("/check", checkTracking);

export default router;
