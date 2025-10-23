import { FaSyncAlt } from "react-icons/fa";

export default function ShipmentsTable({ shipments, fetchStatus, loadingId, statusColor }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow hidden sm:block">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-blue-50 text-blue-700 text-sm uppercase">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Ledger</th>
            <th className="p-3 text-left">Courier</th>
            <th className="p-3 text-left">Tracking</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Last Checked</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {shipments.length > 0 ? (
            shipments.map((s) => (
              <tr key={s.id} className="border-b hover:bg-blue-50 text-sm">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.ledger}</td>
                <td className="p-3">{s.courier}</td>
                <td className="p-3">{s.tracking}</td>
                <td
                  className={`p-3 cursor-pointer ${statusColor(s.deliveryStatus)}`}
                  onClick={() => fetchStatus(s, true)}
                >
                  {loadingId === s.id ? "Loading..." : s.deliveryStatus}
                </td>
                <td className="p-3">{s.location}</td>
                <td className="p-3 text-xs">{s.lastChecked || "--"}</td>
                <td className="p-3">
                  <button
                    onClick={() => fetchStatus(s, false)}
                    disabled={loadingId === s.id}
                    className={`flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 ${
                      loadingId === s.id ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FaSyncAlt className={loadingId === s.id ? "animate-spin" : ""} />
                    {loadingId === s.id ? "Checking..." : "Check Status"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="text-center p-6 text-gray-500 italic bg-gray-50"
              >
                No shipments added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
