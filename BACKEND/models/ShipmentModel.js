import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    courier: { type: String, required: true },
    tracking: { type: String, required: true },
    ledger: { type: mongoose.Schema.Types.ObjectId, ref: "Ledger", required: true },
    status: { type: String, default: "Pending" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ShipmentModel = mongoose.model("Shipment", ShipmentSchema);

export default ShipmentModel;