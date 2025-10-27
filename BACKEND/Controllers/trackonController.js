import { checkTrackon } from "../Services/trackonScraper.js";

export const handleTrackonStatus = async (req, res) => {
  try {
    const { courier, tracking , ledger } = req.body;

    if (!courier || !tracking) {
      return res.status(400).json({ error: "Missing data" });
    }

    if (courier.toLowerCase() !== "trackon") {
      return res.status(400).json({ error: `Courier ${courier} not supported` });
    }

    const status = await checkTrackon(tracking);
    
    res.json({ status });
  } catch (err) {
    console.error("❌ Controller error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
