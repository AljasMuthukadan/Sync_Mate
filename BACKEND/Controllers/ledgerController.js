import LedgerModel from "../models/Ledger.js";

// Add a new ledger
export const addLedger = async (req, res) => {
  try {
    const { name, gstin, address, pincode, phone, category } = req.body;
    console.log(req.body);

    if (!name || !gstin || !pincode || !phone || !category || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newLedger = new LedgerModel({ name, gstin, pincode, phone, category, address });
    await newLedger.save();

    res.status(201).json({ message: "Ledger added successfully", ledger: newLedger });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get all ledgers
export const getLedgers = async (req, res) => {
  try {
    const ledgers = await LedgerModel.find().sort({ createdAt: -1 });
    res.json(ledgers);
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get a single ledger by ID
export const getLedgerById = async (req, res) => {
  try {
    const { id } = req.params;
    const ledger = await LedgerModel.findById(id);

    if (!ledger) {
      return res.status(404).json({ error: "Ledger not found" });
    }

    res.json(ledger);
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update a ledger by ID
export const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gstin, pincode, phone, category } = req.body;

    const updatedLedger = await LedgerModel.findByIdAndUpdate(
      id,
      { name, gstin, pincode, phone, category },
      { new: true }
    );

    if (!updatedLedger) {
      return res.status(404).json({ error: "Ledger not found" });
    }

    res.json({ message: "Ledger updated successfully", ledger: updatedLedger });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete a ledger by ID
export const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLedger = await LedgerModel.findByIdAndDelete(id);

    if (!deletedLedger) {
      return res.status(404).json({ error: "Ledger not found" });
    }

    res.json({ message: "Ledger deleted successfully" });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}