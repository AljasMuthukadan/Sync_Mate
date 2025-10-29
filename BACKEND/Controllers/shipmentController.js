import shipmentModel from "../models/ShipmentModel.js";

export const addShipment = async (req, res) => {
  try {
    console.log(req.body);
    const { ledger, courier, tracking } = req.body;

    if (!ledger || !courier || !tracking) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newShipment = new shipmentModel({ ledger, courier, tracking });
    await newShipment.save();

    res.status(201).json({ message: "Shipment added successfully", shipment: newShipment });
   

  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}