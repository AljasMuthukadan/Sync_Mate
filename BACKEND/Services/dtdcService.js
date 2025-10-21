import { chromium } from "playwright";
import { v4 as uuidv4 } from "uuid";

const dtdcSessions = new Map();
const SESSION_TTL = 2 * 60 * 1000; // 2 minutes

// Cleanup expired sessions every 30 seconds
setInterval(() => {
  const now = Date.now();
  for (const [id, s] of dtdcSessions) {
    if (s.expiresAt < now) {
      try { s.context.close(); } catch {}
      try { s.browser.close(); } catch {}
      dtdcSessions.delete(id);
    }
  }
}, 30000);

/* ------------------- 🟠 CREATE CAPTCHA SESSION ------------------- */
export const createCaptchaSession = async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled"
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  await page.goto("https://www.dtdc.com/track-your-shipment/", { waitUntil: "networkidle" });
  await page.waitForSelector("#captcha-img", { timeout: 20000 });

  const captchaEl = await page.$("#captcha-img");
  if (!captchaEl) throw new Error("Captcha not found");

  const srcImg = await captchaEl.getAttribute("src");
  const sessionId = uuidv4();
  const expiresAt = Date.now() + SESSION_TTL;

  dtdcSessions.set(sessionId, { browser, context, page, expiresAt });
  return { sessionId, captcha: srcImg, expiresAt };
};

/* ------------------- 🟢 CHECK DTDC TRACKING ------------------- */
export const checkDTDCTracking = async (tracking, captcha, sessionId) => {
  const session = dtdcSessions.get(sessionId);
  if (!session) throw new Error("Session expired or not found");

  session.expiresAt = Date.now() + SESSION_TTL;
  const { page, browser, context } = session;

  try {
    await page.bringToFront();
    await page.fill("#trackInput", tracking, { force: true });
    await page.fill("#captchaValue", captcha, { force: true });
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(500);

    await page.$eval("button[type='submit']", (btn) =>
      btn.scrollIntoView({ behavior: "smooth", block: "center" })
    );
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const btn = document.querySelector("button[type='submit']");
      if (btn) btn.click();
    });

    await page.waitForSelector("#domestic-tracking-output", { timeout: 90000 });

    const result = await page.evaluate(() => {
      const output = document.querySelector("#domestic-tracking-output");
      if (!output) return { status: "No tracking info found" };

      const status = output.querySelector(".status-value")?.innerText.trim() || "Unknown";
      const details = {};
      output.querySelectorAll(".track-card").forEach((card) => {
        const label = card.querySelector(".track-label")?.innerText.trim();
        const value = card.querySelector(".track-value")?.innerText.trim();
        if (label && value) details[label] = value;
      });

      const history = [];
      output.querySelectorAll(".track-table tbody tr").forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 3)
          history.push({
            date: cols[0]?.innerText.trim(),
            location: cols[1]?.innerText.trim(),
            activity: cols[2]?.innerText.trim(),
          });
      });

      return { status, details, history };
    });

    await context.close();
    await browser.close();
    dtdcSessions.delete(sessionId);

    return result;
  } catch (err) {
    console.error("❌ DTDC Error:", err);
    try { context.close(); } catch {}
    try { browser.close(); } catch {}
    dtdcSessions.delete(sessionId);
    throw new Error("Error checking DTDC tracking");
  }
};
