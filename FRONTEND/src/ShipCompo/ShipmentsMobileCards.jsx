import { FaSyncAlt } from "react-icons/fa";

export default function ShipmentsMobileCards({ shipments, fetchStatus, loadingId, statusColor }) {
  return (
    <div className="sm:hidden space-y-4">
      {shipments.length > 0 ? (
        shipments.map((s) => (
          <div
            key={s.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-700 font-semibold">#{s.id}</span>
              <button
                onClick={() => fetchStatus(s, false)}
                disabled={loadingId === s.id}
                className={`flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 ${
                  loadingId === s.id ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaSyncAlt className={loadingId === s.id ? "animate-spin" : ""} />
                {loadingId === s.id ? "..." : "Check"}
              </button>
            </div>

            <p><strong>Ledger:</strong> {s.ledger}</p>
            <p><strong>Courier:</strong> {s.courier}</p>
            <p><strong>Tracking:</strong> {s.tracking}</p>
            <p
              className={`mt-1 cursor-pointer ${statusColor(s.deliveryStatus)}`}
              onClick={() => fetchStatus(s, true)}
            >
              <strong>Status:</strong> {loadingId === s.id ? "Loading..." : s.deliveryStatus}
            </p>
            <p><strong>Location:</strong> {s.location}</p>
            <p className="text-xs text-gray-500">
              <strong>Last Checked:</strong> {s.lastChecked || "--"}
            </p>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 italic bg-gray-50 p-6 rounded-xl">
          No shipments added yet
        </div>
      )}
    </div>
  );
}
