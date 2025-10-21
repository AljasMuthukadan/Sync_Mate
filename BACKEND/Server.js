import express from "express";
import cors from "cors";
import trackRoutes from "./Routes/trackRoutes.js";
import dtdcRoutes from "./Routes/dtdcRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", trackRoutes);
app.use("/api/dtdc", dtdcRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
