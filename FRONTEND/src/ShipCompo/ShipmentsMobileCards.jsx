import { FaSyncAlt, FaEye, FaTrash } from "react-icons/fa";
import { useState } from "react";

export default function ShipmentsMobileCards({
  shipments,
  fetchStatus,
  loadingId,
  statusColor,
  deleteShipment,
}) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="grid gap-4 md:hidden">
      {shipments.length === 0 ? (
        <p className="text-center text-gray-500">No shipments added yet.</p>
      ) : (
        shipments.map((shipment) => (
          <div
            key={shipment.id}
            onMouseEnter={() => setHoveredCard(shipment.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative bg-white rounded-xl shadow-md border border-gray-200 p-4 transition hover:shadow-lg"
          >
            {/* Ledger Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-blue-700 text-lg truncate">
                {shipment.ledger}
              </h3>
              {/* Delete button appears on hover */}
              <button
                onClick={() => deleteShipment(shipment.id)}
                className={`absolute top-3 right-3 p-2 rounded-full bg-red-600 text-white shadow-md transition-transform duration-200 ${
                  hoveredCard === shipment.id
                    ? "translate-x-0 opacity-100"
                    : "translate-x-6 opacity-0"
                }`}
                title="Delete Shipment"
              >
                <FaTrash />
              </button>
            </div>

            {/* Fetched Data Section */}
            <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
              <div>
                <p className="font-medium">Courier</p>
                <p>{shipment.courier}</p>
              </div>
              <div>
                <p className="font-medium">Tracking</p>
                <p className="font-mono truncate">{shipment.tracking}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <p className={`${statusColor(shipment.deliveryStatus)} font-semibold`}>
                  {shipment.deliveryStatus}
                </p>
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p>{shipment.location}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Last Checked</p>
                <p className="text-gray-500">{shipment.lastChecked}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => fetchStatus(shipment, false)}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow-md transition-all duration-200"
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
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg shadow-md transition-all duration-200"
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
