// models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Raw Materials", "Finished Goods"], required: true },
  quantity: { type: Number, default: 0 },
  image: { type: String, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // link to user
});

export default mongoose.model("Item", itemSchema);
