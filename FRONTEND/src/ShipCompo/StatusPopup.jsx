import { FaTimes } from "react-icons/fa";

export default function StatusPopup({ popupData, onClose }) {
  if (!popupData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start pt-20 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative overflow-y-auto max-h-[85vh] border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          <FaTimes size={22} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl px-6 py-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            🚚 Shipment Tracking Details
          </h3>
          <p className="text-sm text-blue-100">Comprehensive tracking summary and proof of delivery</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {popupData.trackingNo && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-gray-500">Tracking No</p>
                <p className="font-semibold text-gray-800">{popupData.trackingNo}</p>
              </div>
            )}
            {popupData.date && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-gray-500">Last Updated</p>
                <p className="font-semibold text-gray-800">{popupData.date}</p>
              </div>
            )}
            {popupData.location && (
              <div className="bg-gray-50 rounded-lg p-3 border">
                <p className="text-gray-500">Current Location</p>
                <p className="font-semibold text-gray-800">{popupData.location}</p>
              </div>
            )}
            {(popupData.event || popupData.status) && (
              <div className="bg-gray-50 rounded-lg p-3 border col-span-1 sm:col-span-2 md:col-span-3">
                <p className="text-gray-500">Status</p>
                <p
                  className={`font-semibold text-lg ${
                    /delivered/i.test(popupData.event || popupData.status)
                      ? "text-green-600"
                      : /in transit|out for delivery|shipped/i.test(popupData.event || popupData.status)
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {popupData.event || popupData.status}
                </p>
              </div>
            )}
          </div>

          {/* Shipment Info */}
          {popupData.info && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-blue-700 mb-2">📦 Shipment Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(popupData.info).map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium text-gray-600">{key}:</span>{" "}
                    <span className="text-gray-800">{value}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* POD Section */}
          {popupData.podImage && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                📄 Proof of Delivery (POD)
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <img
                  src={popupData.podImage}
                  alt="POD"
                  className="rounded-lg border shadow-md max-h-64 w-full sm:w-1/2 object-cover"
                />
                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  <a
                    href={popupData.podImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition text-center"
                  >
                    View POD
                  </a>
                  <a
                    href={popupData.podImage}
                    download={`POD_${popupData.trackingNo || "Trackon"}.jpg`}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition text-center"
                  >
                    Download POD
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Timeline / History */}
          {popupData.timeline && popupData.timeline.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-blue-700 mb-3">🕒 Tracking History</h4>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-blue-200"></div>
                <ul className="space-y-4">
                  {popupData.timeline.map((event, idx) => (
                    <li key={idx} className="relative">
                      <div className="absolute -left-[7px] top-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                      <div className="ml-2">
                        <p className="font-semibold text-gray-800">{event.activity || event.event}</p>
                        {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
                        <p className="text-xs text-gray-500">{event.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
