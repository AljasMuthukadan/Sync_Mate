import express from "express";
import { addLedger,getLedgers,getLedgerById,deleteLedger } from "../Controllers/ledgerController.js";


const router = express.Router();

// POST /api/ledgers
router.post("/add", addLedger);

// GET /api/ledgers
router.get("/get", getLedgers);

// GET /api/ledgers/:id
router.get("/:id", getLedgerById);

// DELETE /api/ledgers/:id
router.delete("/:id", deleteLedger);

export default router;