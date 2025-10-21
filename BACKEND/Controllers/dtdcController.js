import { createCaptchaSession, checkDTDCTracking } from "../Services/dtdcService.js";

export const getCaptcha = async (req, res) => {
  try {
    const result = await createCaptchaSession();
    res.json(result);
  } catch (err) {
    console.error("❌ DTDC CAPTCHA error:", err);
    res.status(500).json({ error: "Failed to get captcha" });
  }
};

export const checkTracking = async (req, res) => {
  try {
    const { tracking, captcha, sessionId } = req.body;
    if (!tracking || !captcha || !sessionId)
      return res.status(400).json({ error: "Missing tracking, captcha or sessionId" });

    const result = await checkDTDCTracking(tracking, captcha, sessionId);
    res.json({ status: result });
  } catch (err) {
    console.error("❌ DTDC Tracking error:", err);
    res.status(500).json({ error: "Error checking DTDC tracking" });
  }
};
