import { FaSyncAlt, FaEye } from "react-icons/fa";

export default function ShipmentsMobileCards({ shipments, fetchStatus, loadingId, statusColor }) {
  return (
    <div className="grid gap-4 md:hidden">
      {shipments.length === 0 ? (
        <p className="text-center text-gray-500">No shipments added yet.</p>
      ) : (
        shipments.map((shipment) => (
          <div
            key={shipment.id}
            className="bg-white rounded-xl shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-700">{shipment.ledger}</h3>
              <span
                className={`text-sm font-semibold ${statusColor(
                  shipment.deliveryStatus
                )}`}
              >
                {shipment.deliveryStatus}
              </span>
            </div>
            <p className="text-gray-700">
              <strong>Courier:</strong> {shipment.courier}
            </p>
            <p className="text-gray-700">
              <strong>Tracking:</strong> {shipment.tracking}
            </p>
            <p className="text-gray-700">
              <strong>Location:</strong> {shipment.location}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              <strong>Last Checked:</strong> {shipment.lastChecked}
            </p>

            <div className="flex gap-3 mt-3 justify-end">
              <button
                onClick={() => fetchStatus(shipment, false)}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow"
                disabled={loadingId === shipment.id}
              >
                {loadingId === shipment.id ? (
                  <FaSyncAlt className="animate-spin" />
                ) : (
                  <FaSyncAlt />
                )}
              </button>
              <button
                onClick={() => fetchStatus(shipment, true)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg shadow"
              >
                <FaEye />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
