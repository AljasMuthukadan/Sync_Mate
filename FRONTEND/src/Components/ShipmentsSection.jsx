import { useState } from "react";

export default function ShipmentsSection() {
  const [shipments, setShipments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newShipment, setNewShipment] = useState({ item: "", courier: "", tracking: "", date: "" });

  const addShipment = () => {
    setShipments([...shipments, { id: shipments.length + 1, ...newShipment }]);
    setShowForm(false);
    setNewShipment({ item: "", courier: "", tracking: "", date: "" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h2 className="text-2xl font-semibold text-blue-700">🚚 Shipments</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500"
        >
          + Add Shipment
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-4 mb-4 max-w-md">
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Item</label>
            <input
              type="text"
              value={newShipment.item}
              onChange={(e) => setNewShipment({ ...newShipment, item: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Courier</label>
            <input
              type="text"
              value={newShipment.courier}
              onChange={(e) => setNewShipment({ ...newShipment, courier: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Tracking Code</label>
            <input
              type="text"
              value={newShipment.tracking}
              onChange={(e) => setNewShipment({ ...newShipment, tracking: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 mb-1">Expected Delivery Date</label>
            <input
              type="date"
              value={newShipment.date}
              onChange={(e) => setNewShipment({ ...newShipment, date: e.target.value })}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <button onClick={addShipment} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
            Save Shipment
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              <th className="p-3">ID</th>
              <th className="p-3">Item</th>
              <th className="p-3">Courier</th>
              <th className="p-3">Tracking</th>
              <th className="p-3">Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s.id} className="border-b hover:bg-blue-50">
                <td className="p-3">{s.id}</td>
                <td className="p-3">{s.item}</td>
                <td className="p-3">{s.courier}</td>
                <td className="p-3">{s.tracking}</td>
                <td className="p-3">{s.date}</td>
              </tr>
            ))}
            {shipments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No shipments added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
