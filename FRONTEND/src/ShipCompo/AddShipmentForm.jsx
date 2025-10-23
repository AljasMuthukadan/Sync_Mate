import { FaTimes } from "react-icons/fa";

export default function AddShipmentForm({ newShipment, setNewShipment, addShipment, setShowForm, couriers }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white border rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-fadeIn">
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
          Add New Shipment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Courier
            </label>
            <select
              value={newShipment.courier}
              onChange={(e) =>
                setNewShipment({ ...newShipment, courier: e.target.value })
              }
              className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"
            >
              <option value="">Select Courier</option>
              {couriers.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              value={newShipment.tracking}
              onChange={(e) =>
                setNewShipment({ ...newShipment, tracking: e.target.value })
              }
              className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"
            />
          </div>
        </div>
        <button
          onClick={addShipment}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
        >
          Add
        </button>
      </div>
    </div>
  );
}
