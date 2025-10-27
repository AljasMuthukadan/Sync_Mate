import express from "express";
import cors from "cors";
import trackRoutes from "./Routes/trackRoutes.js";
import dtdcRoutes from "./Routes/dtdcRoutes.js";
import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";


const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Routes
app.use("/api", trackRoutes);
app.use("/api/dtdc", dtdcRoutes);


// Connect to MongoDB
connectDB();

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
