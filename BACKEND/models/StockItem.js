import mongoose from "mongoose";

const StockItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    quantity: { type: Number, default: 0 },
    description: { type: String, default: "" },
    supplier: { type: String, default: "" },
    reorderLevel: { type: Number, default: 0 },
    unit : { type: String, default: "" }, 
    category: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const StockItemModel = mongoose.model("StockItem", StockItemSchema);

export default StockItemModel;