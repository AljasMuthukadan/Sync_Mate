import express from "express";
import { addShipment } from "../Controllers/shipmentController.js";

const router = express.Router();

router.post("/add",addShipment)

export default router;