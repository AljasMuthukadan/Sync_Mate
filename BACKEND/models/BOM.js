// models/BOM.js
import mongoose from "mongoose";

const bomSchema = new mongoose.Schema({
  finishedProduct: { type: String, required: true },
  materials: [
    {
      name: String, // e.g. "Ice Cream Mix"
      qty: Number,  // e.g. 50
    }
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("BOM", bomSchema);
