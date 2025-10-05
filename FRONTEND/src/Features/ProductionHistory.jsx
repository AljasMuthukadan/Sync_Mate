import { useState } from "react";

export default function ProductionHistory({ history }) {
  const [selectedHistory, setSelectedHistory] = useState(null);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex-1">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        📜 Production History
      </h2>
      {history.length === 0 && (
        <p className="text-gray-500">No production yet.</p>
      )}
      <ul className="divide-y divide-gray-200">
        {history.map((h, idx) => (
          <li
            key={idx}
            className="py-2 flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2"
            onClick={() => setSelectedHistory(h)}
          >
            {h.image && (
              <img
                src={h.image}
                alt={h.product}
                className="w-12 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <span className="font-semibold">{h.product}</span> - Qty: {h.qty}
              <div className="text-gray-500 text-sm">{h.date}</div>
            </div>
          </li>
        ))}
      </ul>

      {/* Production Details Modal */}
      {selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-3">
              📦 {selectedHistory.product} (x{selectedHistory.qty})
            </h3>
            <p className="text-gray-600 mb-2">Date: {selectedHistory.date}</p>
            <h4 className="font-semibold text-blue-700 mb-2">Materials Used:</h4>
            <ul className="list-disc list-inside text-gray-700">
              {selectedHistory.materials.map((m, i) => (
                <li key={i}>
                  {m.name}: {m.qty}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedHistory(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
