import { chromium } from "playwright";

export const checkTrackon = async (tracking) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    console.log("🟢 Navigating to Trackon website...");
    await page.goto("https://www.trackon.in/courier-tracking", { timeout: 60000 });

    await page.waitForSelector("#awbSingleTrackingId", { timeout: 15000 });
    await page.fill("#awbSingleTrackingId", tracking);
    await page.click("button[type='submit']");
    console.log("🟢 Submitted tracking ID:", tracking);

    await page.waitForSelector("#divtrackStatus table.table-hightlight tbody tr", { timeout: 30000 });

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
