import mongoose from "mongoose";

const LedgerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    gstin: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const LedgerModel = mongoose.model("Ledger", LedgerSchema);

export default LedgerModel;