import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaBox } from "react-icons/fa";

export default function ProductionHistory({ history }) {
  const [selectedHistory, setSelectedHistory] = useState(null);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 relative overflow-hidden">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 flex items-center gap-2">
        <FaBox className="text-blue-500" /> Production History
      </h2>

      {history.length === 0 && (
        <p className="text-gray-500 text-sm">No production yet.</p>
      )}

      <ul className="divide-y divide-gray-200 max-h-[50vh] overflow-y-auto">
        {history.map((h, idx) => (
          <li
            key={idx}
            className="py-3 px-3 flex justify-between items-center cursor-pointer hover:bg-blue-50 rounded transition text-sm"
            onClick={() => setSelectedHistory(h)}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{h.product}</span>
              <span className="text-gray-500 text-xs">{h.date}</span>
            </div>
            <span className="text-gray-700 font-medium">Qty: {h.qty}</span>
          </li>
        ))}
      </ul>

      {/* Slide-in Detail Panel like BOM Manager */}
      {selectedHistory && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 right-0 bg-white shadow-2xl rounded-2xl border border-gray-200 w-[90%] md:w-[70%] lg:w-[50%] h-full z-50 p-6 flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-blue-700 flex-1">
              📦 {selectedHistory.product} (x{selectedHistory.qty})
            </h3>
            <button
              onClick={() => setSelectedHistory(null)}
              className="text-gray-600 hover:text-red-500 transition ml-2"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Date */}
          <p className="text-gray-600 mb-4 text-sm">
            Date: {selectedHistory.date}
          </p>

          {/* Materials Used */}
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">
            Materials Used:
          </h4>
          <div className="flex-1 overflow-y-auto">
            <ul className="list-disc list-inside text-gray-700 text-sm">
              {selectedHistory.materialsUsed.map((m, i) => (
                <li key={i} className="mb-1">
                  {m.name}: {m.qty}
                </li>
              ))}
            </ul>
          </div>

          {/* Close Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setSelectedHistory(null)}
              className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-xl shadow text-sm transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}