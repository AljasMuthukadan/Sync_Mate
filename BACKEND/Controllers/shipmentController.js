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

export const getShipment = async (req, res) => {
  try {
    const shipments = await shipmentModel.find().sort({createdAt : -1})

    res.status(201).json(shipments
      
    )

  } catch (err) {
   console.error(err)
  }
 }


 export const updateShipment = async (req, res) => {
  try {

      const data = req.body
      console.log(req.body)
      
      const {tracking, location, podImage, deliveryStatus,lastChecked} = data
      console.log(data)
      if(!tracking) return res.status(400).json({error : "Tracking Number Required"})
    
    const updatedShipment = await shipmentModel.findOneAndUpdate(
      { tracking },
      {
        $set: {
          status: deliveryStatus,  // ✅ mapped to correct field in MongoDB
          location,
          lastUpdated: lastChecked,
          podImage,
        },
      },
      { new: true } // returns updated document
    )
    if(!updatedShipment) return res.status(404).json({error : " Shipment not found"})

      res.status(200).json({message:"Shipment Added Successfully",
        shipment: updatedShipment
      })

  } catch (err) {
 console.error(err)
  }
 }
 
export const deleteShipment = async (req, res) => {
  try{
    const {tracking} = req.body
    if(!tracking) return res.status(400).json({error: "Shipment number required"})
    const deletedShipment = await shipmentModel.findOneAndDelete({tracking})
   if(!deletedShipment) return res.status(404).json({error : "Shipment not fund"})
    res.status(200).json({message:"Shipment deleted succesfully", deletedShipment})
    console.log(tracking)
  }catch (err) {
   console.error("❌ Error deleting shipment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
 }