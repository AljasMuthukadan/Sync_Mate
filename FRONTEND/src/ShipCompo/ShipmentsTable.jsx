import { FaSyncAlt, FaEye } from "react-icons/fa";

export default function ShipmentsTable({ shipments, fetchStatus, loadingId, statusColor }) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-sm bg-white">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Ledger</th>
            <th className="p-3 text-left">Courier</th>
            <th className="p-3 text-left">Tracking No</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Last Checked</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-6 text-gray-500">
                No shipments added yet.
              </td>
            </tr>
          ) : (
            shipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="border-t hover:bg-blue-50 transition-colors duration-150"
              >
                <td className="p-3">{shipment.id}</td>
                <td className="p-3">{shipment.ledger}</td>
                <td className="p-3">{shipment.courier}</td>
                <td className="p-3 font-mono">{shipment.tracking}</td>
                <td
                  className={`p-3 font-semibold ${statusColor(
                    shipment.deliveryStatus
                  )}`}
                >
                  {shipment.deliveryStatus}
                </td>
                <td className="p-3">{shipment.location}</td>
                <td className="p-3">{shipment.lastChecked}</td>
                <td className="p-3 text-center flex justify-center gap-3">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
