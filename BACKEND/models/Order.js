// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  ledger: String, // customer name
  items: [
    {
      name: String,
      qty: Number,
    }
  ],
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Order", orderSchema);
