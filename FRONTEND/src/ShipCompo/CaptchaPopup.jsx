import { FaTimes, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

export default function CaptchaPopup({
  captchaPopup,
  setCaptchaPopup,
  handleCaptchaSubmit,
}) {
  if (!captchaPopup) return null;

  const refreshCaptcha = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dtdc/captcha");
      if (res.data?.captcha) {
        let imageData = res.data.captcha;
        if (!imageData.startsWith("data:image"))
          imageData = `data:image/png;base64,${imageData}`;
        setCaptchaPopup({
          ...captchaPopup,
          image: imageData,
          enteredCaptcha: "",
          sessionId: res.data.sessionId,
        });
      }
    } catch (err) {
      alert("Failed to refresh CAPTCHA");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] px-3">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-fadeIn">
        <button
          onClick={() => setCaptchaPopup(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-blue-700 flex items-center justify-center gap-2">
            <FaSyncAlt /> DTDC CAPTCHA
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Enter the code shown below to track your shipment
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 mb-4">
          {captchaPopup.image ? (
            <img
              src={captchaPopup.image}
              alt="CAPTCHA"
              className="w-56 h-20 object-contain border border-gray-300 rounded-lg shadow-sm"
            />
          ) : (
            <p className="text-gray-500">Loading CAPTCHA...</p>
          )}

          <button
            onClick={refreshCaptcha}
            className="text-sm text-blue-600 hover:text-blue-800 underline transition"
          >
            Refresh CAPTCHA
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter CAPTCHA"
          value={captchaPopup.enteredCaptcha || ""}
          onChange={(e) =>
            setCaptchaPopup({ ...captchaPopup, enteredCaptcha: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <button
          onClick={handleCaptchaSubmit}
          className="mt-4 w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
