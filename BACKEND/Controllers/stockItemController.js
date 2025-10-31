import StockItemModel from "../models/StockItem.js";   

// Add a new stock item
export const addStockItem = async (req, res) => {
  try {
    console.log(req.body);
     } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get all stock items
export const getStockItems = async (req, res) => {
  try {
    const stockItems = await StockItemModel.find().sort({ createdAt: -1 });
    res.json(stockItems);
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update a stock item by ID
export const updateStockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, quantity, description, supplier, reorderLevel, unit, category, imageUrl } = req.body;

    const updatedStockItem = await StockItemModel.findByIdAndUpdate(
      id,
      { name, sku, quantity, description, supplier, reorderLevel, unit, category, imageUrl },
      { new: true }
    );

    if (!updatedStockItem) {
      return res.status(404).json({ error: "Stock item not found" });
    }

    res.json({ message: "Stock item updated successfully", stockItem: updatedStockItem });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a stock item by ID
export const deleteStockItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStockItem = await StockItemModel.findByIdAndDelete(id);

    if (!deletedStockItem) {
      return res.status(404).json({ error: "Stock item not found" });
    }

    res.json({ message: "Stock item deleted successfully" });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}       
