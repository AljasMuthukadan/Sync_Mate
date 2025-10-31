import { FaSyncAlt, FaEye, FaTrash } from "react-icons/fa";
import { useState } from "react";

export default function ShipmentsTable({
  shipments,
  fetchStatus,
  loadingId,
  statusColor,
  deleteShipment,
}) {
  console.log(shipments);
  const [hoveredRow, setHoveredRow] = useState(null);
  return (
    <div className="hidden md:block overflow-x-auto">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-800 tracking-tight">
            📦 Shipments Overview
          </h2>
          <p className="text-sm text-gray-500">
            Total Shipments:{" "}
            <span className="font-medium text-blue-600">{shipments.length}</span>
          </p>
        </div>

        <table className="min-w-full bg-white text-sm text-gray-800 rounded-b-2xl overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-sm uppercase tracking-wide">
            <tr>
              <th className="py-3 px-4 text-left font-medium">#</th>
              <th className="py-3 px-4 text-left font-medium">Ledger</th>
              <th className="py-3 px-4 text-left font-medium">Courier</th>
              <th className="py-3 px-4 text-left font-medium">Tracking No</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-left font-medium">Location</th>
              <th className="py-3 px-4 text-left font-medium">Last Checked</th>
              <th className="py-3 px-4 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {shipments.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-400 italic"
                >
                  No shipments added yet.
                </td>
              </tr>
            ) : (
              shipments.map((shipment) => (
                <tr
                  key={shipment.tracking}
                  onMouseEnter={() => setHoveredRow(shipment.tracking)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="group hover:bg-blue-50/40 transition-all duration-300 ease-in-out"
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {shipment.id}
                  </td>
                  <td className="px-4 py-3">{shipment.ledger}</td>
                  <td className="px-4 py-3">{shipment.courier}</td>
                  <td className="px-4 py-3 font-mono text-gray-600 truncate max-w-[180px]">
                    {shipment.tracking}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${statusColor(
                      shipment.status
                    )}`}
                  >
                    {shipment.status}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{shipment.location}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {shipment.lastUpdated}
                  </td>

                  {/* ✅ Actions column with hover delete button */}
                  <td className="px-4 py-3 text-center relative">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => fetchStatus(shipment, false)}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow-sm transition-all duration-200"
                        disabled={loadingId === shipment.tracking}
                      >
                        {loadingId === shipment.tracking ? (
                          <FaSyncAlt className="animate-spin" />
                        ) : (
                          <FaSyncAlt />
                        )}
                      </button>
                      <button
                        onClick={() => fetchStatus(shipment, true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg shadow-sm transition-all duration-200"
                      >
                        <FaEye />
                      </button>

                      {/* Delete button only visible on hover */}
                      <button
                        onClick={() => deleteShipment(shipment.tracking)}
                        className={`bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg shadow-sm transition-all duration-200 ${
                          hoveredRow === shipment.tracking ? "opacity-100" : "opacity-0"
                        }`}
                        title="Delete Shipment"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}