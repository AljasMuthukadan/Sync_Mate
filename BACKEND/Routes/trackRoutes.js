import express from "express";
import { handleTrackonStatus } from "../Controllers/trackonController.js";

const router = express.Router();

// POST /api/check-status
router.post("/check-status", handleTrackonStatus);

export default router;
