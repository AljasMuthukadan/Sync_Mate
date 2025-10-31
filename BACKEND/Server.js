import express from "express";
import cors from "cors";
import trackRoutes from "./Routes/trackRoutes.js";
import dtdcRoutes from "./Routes/dtdcRoutes.js";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import mongoose from "mongoose";
import ledgerRoutes from "./Routes/ledgerRoutes.js";
import shipmentRoutes from "./Routes/shipmentRoutes.js";
import stockRoutes from "./Routes/stockItemRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Routes
app.use("/api", trackRoutes);
app.use("/api/dtdc", dtdcRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/stock-items", stockRoutes)



// Connect to MongoDB
connectDB();


mongoose.connection.on("connected", () => {
  const dbName = mongoose.connection.name;
  if (dbName !== "Sync_Mate") {
    console.error(`⚠️ Connected to wrong DB: ${dbName}`);
    process.exit(1); // stop the server
  }
});

const PORT = 5000;
app.listen(PORT,"0.0.0.0", () => console.log(`🚀 Server running on http://localhost:${PORT}`))