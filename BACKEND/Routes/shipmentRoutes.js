import express from "express";
import { addShipment, getShipment, updateShipment, deleteShipment } from "../Controllers/shipmentController.js";

const router = express.Router();

router.post("/add",addShipment)
router.get("/get", getShipment)
router.post("/update", updateShipment)
router.post("/delete", deleteShipment)

export default router;