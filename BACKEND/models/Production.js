// models/Production.js
import mongoose from "mongoose";

const productionSchema = new mongoose.Schema({
  product: String,        // Finished good
  qty: Number,            // How many produced
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Production", productionSchema);
