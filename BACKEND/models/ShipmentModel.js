import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    courier: { type: String, required: true },
    tracking: { type: String, required: true },
    ledger: { type: String,required: true },
    status: { type: String, default: "Pending" },
    location: { type: String, default: "" },
    lastUpdated: { type: Date, default: Date.now },
    podImageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const ShipmentModel = mongoose.model("Shipment", ShipmentSchema);

export default ShipmentModel;