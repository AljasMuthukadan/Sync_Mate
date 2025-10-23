import { FaTimes } from "react-icons/fa";

export default function CaptchaPopup({ captchaData, setCaptchaData, handleCaptchaSubmit }) {
  if (!captchaData) return null;

  const { imageUrl, courier, tracking } = captchaData;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex justify-between items-center bg-blue-600 text-white px-5 py-3">
          <h2 className="text-lg font-semibold">Captcha Required</h2>
          <button
            onClick={() => setCaptchaData(null)}
            className="text-white hover:text-gray-200"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Courier: <strong>{courier}</strong>
            <br />
            Tracking No: <strong>{tracking}</strong>
          </p>

          {imageUrl ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={imageUrl}
                alt="Captcha"
                className="border rounded-md shadow-sm"
              />
              <input
                type="text"
                placeholder="Enter Captcha"
                className="border border-gray-300 rounded-md px-3 py-2 w-full outline-none focus:border-blue-500"
                id="captchaInput"
              />
              <button
                onClick={() =>
                  handleCaptchaSubmit(document.getElementById("captchaInput").value)
                }
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">
              Loading captcha...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
