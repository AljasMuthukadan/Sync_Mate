import express from "express";
import cors from "cors";
import { chromium } from "playwright";

const app = express();
app.use(cors());
app.use(express.json());

const checkTrackon = async (tracking) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true }); // keep headless for production
    const page = await browser.newPage();
    console.log("🟢 Navigating to Trackon website...");
    await page.goto("https://www.trackon.in/courier-tracking", { timeout: 60000 });

    // Wait for and fill tracking input
    await page.waitForSelector("#awbSingleTrackingId", { timeout: 15000 });
    await page.fill("#awbSingleTrackingId", tracking);
    await page.click("button[type='submit']");
    console.log("🟢 Submitted tracking ID:", tracking);

    // Wait for tracking status table
    await page.waitForSelector("#divtrackStatus table.table-hightlight tbody tr", { timeout: 30000 });

    // Extract tracking details
    const result = await page.evaluate(() => {
      const row = document.querySelector("#divtrackStatus table.table-hightlight tbody tr");
      if (!row) return { date: "--", trackingNo: "--", location: "--", event: "No status found" };
      const tds = row.querySelectorAll("td");
      return {
        date: tds[0]?.innerText.trim() || "--",
        trackingNo: tds[1]?.innerText.trim() || "--",
        location: tds[2]?.innerText.trim() || "--",
        event: tds[4]?.innerText.trim() || "--",
      };
    });

    // Try to get POD image URL if available
    let podImage = null;
    try {
      const podElement = await page.$("#pod");
      if (podElement) {
        const onclickAttr = await podElement.getAttribute("onclick");
        const match = onclickAttr?.match(/SetPODUrl\('(.*?)'\)/);
        if (match && match[1]) {
          podImage = match[1];
        }
      }
    } catch (e) {
      console.warn("⚠️ No POD image found:", e.message);
    }

    console.log("✅ Extracted:", result, podImage ? `POD: ${podImage}` : "No POD found");
    return { ...result, podImage };
  } catch (err) {
    console.error("❌ Scraper error:", err);
    return { date: "--", trackingNo: tracking, location: "--", event: "Error fetching data", podImage: null };
  } finally {
    if (browser) await browser.close();
  }
};

app.post("/api/check-status", async (req, res) => {
  try {
    const { courier, tracking } = req.body;
    if (!courier || !tracking) return res.status(400).json({ error: "Missing data" });
    if (courier.toLowerCase() !== "trackon")
      return res.status(400).json({ error: `Courier ${courier} not supported` });

    const status = await checkTrackon(tracking);
    res.json({ status });
  } catch (err) {
    console.error("❌ Route error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
