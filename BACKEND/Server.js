import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import Item from "./models/Item.js";
import Order from "./models/Order.js";
import Production from "./models/Production.js";
import BOM from "./models/BOM.js";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Add Item
app.post("/items", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Items
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// ✅ Place Order (reduce stock)
app.post("/orders", async (req, res) => {
  const { ledger, items } = req.body;

  for (let orderItem of items) {
    const stockItem = await Item.findOne({ name: orderItem.name });
    if (!stockItem || stockItem.quantity < orderItem.qty) {
      return res.status(400).json({ error: `Not enough stock for ${orderItem.name}` });
    }
  }

  for (let orderItem of items) {
    await Item.updateOne(
      { name: orderItem.name },
      { $inc: { quantity: -orderItem.qty } }
    );
  }

  const order = new Order({ ledger, items });
  await order.save();

  res.json(order);
});

// ✅ Produce Finished Goods
app.post("/produce", async (req, res) => {
  const { product, qty } = req.body;
  const bom = await BOM.findOne({ finishedProduct: product });

  if (!bom) return res.status(400).json({ error: "BOM not defined" });

  // Check raw materials
  for (let mat of bom.materials) {
    const stockItem = await Item.findOne({ name: mat.name });
    if (!stockItem || stockItem.quantity < mat.qty * qty) {
      return res.status(400).json({ error: `Not enough ${mat.name}` });
    }
  }

  // Deduct raw materials
  for (let mat of bom.materials) {
    await Item.updateOne(
      { name: mat.name },
      { $inc: { quantity: -(mat.qty * qty) } }
    );
  }

  // Add finished product
  await Item.updateOne(
    { name: product },
    { $inc: { quantity: qty }, $setOnInsert: { category: "Finished Goods" } },
    { upsert: true }
  );

  const production = new Production({ product, qty });
  await production.save();

  res.json({ message: "Production completed", production });
});

// ✅ Get BOMs
app.get("/bom", async (req, res) => {
  const boms = await BOM.find();
  res.json(boms);
});

// ✅ Update BOM
app.put("/bom/:id", async (req, res) => {
  const bom = await BOM.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bom);
});

mongoose.connect("mongodb://localhost:27017/inventory").then(() => {
  app.listen(5000, () => console.log("✅ Server running on port 5000"));
}).catch(err => console.log("❌ DB Connection Error:", err));
