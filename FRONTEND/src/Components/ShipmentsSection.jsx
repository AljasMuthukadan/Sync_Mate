import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function ShipmentsSection() {
  const [shipments, setShipments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newShipment, setNewShipment] = useState({
    ledger: "",
    courier: "",
    tracking: "",
    date: "",
  });

  const couriers = [
    "Trackon",
    "DTDC",
    "Professional Couriers",
    "VRL Logistics",
    "Login Logistics",
    "Easy Trans",
  ];

  const addShipment = () => {
    if (!newShipment.ledger || !newShipment.courier) return;
    setShipments([...shipments, { id: shipments.length + 1, ...newShipment }]);
    setShowForm(false);
    setNewShipment({ ledger: "", courier: "", tracking: "", date: "" });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🚚 Shipments
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition"
        >
          <FaPlus /> Add Shipment
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-blue-700 text-sm uppercase">
              <th className="p-3 text-left font-semibold">ID</th>
              <th className="p-3 text-left font-semibold">Ledger Name</th>
              <th className="p-3 text-left font-semibold">Courier</th>
              <th className="p-3 text-left font-semibold">Tracking</th>
              <th className="p-3 text-left font-semibold">Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length > 0 ? (
              shipments.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-blue-50 text-sm transition"
                >
                  <td className="p-3 text-gray-700">{s.id}</td>
                  <td className="p-3 font-medium text-gray-800">{s.ledger}</td>
                  <td className="p-3 text-gray-700">{s.courier}</td>
                  <td className="p-3 text-gray-700">{s.tracking}</td>
                  <td className="p-3 text-gray-700">{s.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-6 text-gray-500 italic bg-gray-50"
                >
                  No shipments added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inline Popup Form */}
      {showForm && (
        <div className="absolute inset-0 flex justify-center items-start mt-10 z-50">
          <div className="bg-white border border-gray-300 rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fadeIn relative">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={18} />
            </button>

            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
              Add New Shipment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ledger Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ledger Name
                </label>
                <input
                  type="text"
                  value={newShipment.ledger}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, ledger: e.target.value })
                  }
                  className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 px-3 py-2 rounded-lg w-full text-sm outline-none"
                  placeholder="Enter ledger name"
                />
              </div>

              {/* Courier (Preset Dropdown) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Courier
                </label>
                <select
                  value={newShipment.courier}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, courier: e.target.value })
                  }
                  className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 px-3 py-2 rounded-lg w-full text-sm outline-none"
                >
                  <option value="">Select Courier</option>
                  {couriers.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tracking Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking Code
                </label>
                <input
                  type="text"
                  value={newShipment.tracking}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, tracking: e.target.value })
                  }
                  className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 px-3 py-2 rounded-lg w-full text-sm outline-none"
                  placeholder="Tracking number"
                />
              </div>

              {/* Expected Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={newShipment.date}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, date: e.target.value })
                  }
                  className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 px-3 py-2 rounded-lg w-full text-sm outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={addShipment}
                className="px-5 py-2 rounded-lg text-sm bg-blue-600 text-white font-medium hover:bg-blue-500 transition"
              >
                Save Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Animation style */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;
document.head.appendChild(style);

