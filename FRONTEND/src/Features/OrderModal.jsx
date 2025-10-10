import { useState } from "react";
import { FaTrash, FaPrint, FaSave, FaTimes, FaPlus } from "react-icons/fa";
import PrintInvoice from "./PrintInvoice.jsx"; // Tally-style print page

export default function OrderModal({ order, closeModal, deleteOrder, restockOrder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [itemsState, setItemsState] = useState(order.items || []);
  const [newItem, setNewItem] = useState({ name: "", qty: 1, rate: 0, unit: "Nos" });

  if (showPrint) {
    return <PrintInvoice order={order} onClose={() => setShowPrint(false)} />;
  }

  const handleQtyChange = (index, value) => {
    const updated = [...itemsState];
    updated[index].qty = Number(value);
    setItemsState(updated);
  };

  const handleRateChange = (index, value) => {
    const updated = [...itemsState];
    updated[index].rate = Number(value);
    setItemsState(updated);
  };

  const handleUnitChange = (index, value) => {
    const updated = [...itemsState];
    updated[index].unit = value;
    setItemsState(updated);
  };

  const addItem = () => {
    if (!newItem.name) return alert("Enter item name");
    setItemsState([...itemsState, { ...newItem, qty: Number(newItem.qty), rate: Number(newItem.rate) }]);
    setNewItem({ name: "", qty: 1, rate: 0, unit: "Nos" });
  };

  const removeItem = (index) => setItemsState(itemsState.filter((_, i) => i !== index));

  const saveChanges = () => {
    order.items = itemsState;
    setIsEditing(false);
    alert("✅ Order updated successfully!");
  };

  const subtotal = itemsState.reduce((acc, i) => acc + i.qty * i.rate, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold">📦 Order Details</h2>
            <p className="text-sm opacity-80">
              Ledger: <span className="font-medium">{order.ledger}</span> | Date: {order.date}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPrint(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded-lg shadow-md transition"
            >
              <FaPrint /> Print
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-lg shadow-md transition"
            >
              <FaSave /> {isEditing ? "Save & Close" : "Edit Order"}
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to delete this order?")) {
                  deleteOrder(order);
                  closeModal();
                }
              }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg shadow-md transition"
            >
              <FaTrash /> Delete
            </button>
            <button
              onClick={closeModal}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg shadow-md transition"
            >
              <FaTimes /> Close
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white">
          <table className="w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm text-sm">
            <thead className="bg-blue-100 text-blue-900">
              <tr>
                <th className="border px-3 py-2 text-left">#</th>
                <th className="border px-3 py-2 text-left">Item</th>
                <th className="border px-3 py-2 text-center">Qty</th>
                <th className="border px-3 py-2 text-center">Unit</th>
                <th className="border px-3 py-2 text-center">Rate</th>
                <th className="border px-3 py-2 text-center">Amount</th>
                {isEditing && <th className="border px-3 py-2 text-center">Action</th>}
              </tr>
            </thead>
            <tbody>
              {itemsState.map((i, idx) => (
                <tr key={idx} className="hover:bg-blue-50 transition">
                  <td className="border px-3 py-2 text-center">{idx + 1}</td>
                  <td className="border px-3 py-2">{i.name}</td>
                  <td className="border px-3 py-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        value={i.qty}
                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                        className="w-16 text-center border rounded px-2 py-1"
                      />
                    ) : (
                      i.qty
                    )}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {isEditing ? (
                      <select
                        value={i.unit}
                        onChange={(e) => handleUnitChange(idx, e.target.value)}
                        className="border rounded px-1 py-1"
                      >
                        <option value="Nos">Nos</option>
                        <option value="Kg">Kg</option>
                        <option value="Set">Set</option>
                        <option value="Roll">Roll</option>
                      </select>
                    ) : (
                      i.unit
                    )}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        value={i.rate}
                        onChange={(e) => handleRateChange(idx, e.target.value)}
                        className="w-20 text-center border rounded px-2 py-1"
                      />
                    ) : (
                      i.rate
                    )}
                  </td>
                  <td className="border px-3 py-2 text-center">{(i.qty * i.rate).toFixed(2)}</td>
                  {isEditing && (
                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => removeItem(idx)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                      >
                        ❌
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {isEditing && (
                <tr className="bg-gray-50">
                  <td className="border px-3 py-2 text-center">+</td>
                  <td className="border px-3 py-2">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="number"
                      min="1"
                      value={newItem.qty}
                      onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                      className="w-16 text-center border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Nos">Nos</option>
                      <option value="Kg">Kg</option>
                      <option value="Set">Set</option>
                      <option value="Roll">Roll</option>
                    </select>
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      value={newItem.rate}
                      onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                      className="w-20 text-center border rounded px-2 py-1"
                    />
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={addItem}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-400"
                    >
                      <FaPlus />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-end mt-4 text-gray-700">
            <p className="text-lg font-semibold">
              Subtotal: <span className="text-blue-700">₹{subtotal.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

