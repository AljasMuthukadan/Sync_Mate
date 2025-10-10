import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function OrderForm({ items, setItems, addNewOrder }) {
  const [ledgerName, setLedgerName] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [search, setSearch] = useState("");

  const finishedGoods = items.filter((i) => i.category === "Finished Goods");

  const addOrderItem = (itemName) => {
    if (!itemName || orderItems.find((o) => o.name === itemName)) return;
    setOrderItems([
      ...orderItems,
      { name: itemName, qty: 1, rate: 0, total: 0 },
    ]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItemField = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = Number(value);
    updated[index].total = updated[index].qty * updated[index].rate;
    setOrderItems(updated);
  };

  const placeOrder = () => {
    if (!ledgerName || orderItems.length === 0) {
      alert("Please enter ledger name and add at least one item.");
      return;
    }

    const insufficient = orderItems.filter((o) => {
      const stockItem = items.find((i) => i.name === o.name);
      return !stockItem || stockItem.quantity < o.qty;
    });

    if (insufficient.length > 0) {
      alert("Not enough stock for: " + insufficient.map((i) => i.name).join(", "));
      return;
    }

    const updatedItems = items.map((i) => {
      const ordered = orderItems.find((o) => o.name === i.name);
      if (ordered) return { ...i, quantity: i.quantity - ordered.qty };
      return i;
    });
    setItems(updatedItems);

    const totalAmount = orderItems.reduce((sum, i) => sum + i.total, 0);

    addNewOrder({
      ledger: ledgerName,
      items: orderItems,
      total: totalAmount,
      date: new Date().toLocaleString(),
    });

    setLedgerName("");
    setOrderItems([]);
    setSearch("");
  };

  const totalAmount = orderItems.reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-6 flex-1 border border-gray-100 transition-all hover:shadow-green-300/40">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-400 text-transparent bg-clip-text mb-5">
        🧾 Create New Order
      </h2>

      {/* Ledger Input */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">
          Ledger / Customer Name
        </label>
        <input
          type="text"
          value={ledgerName}
          onChange={(e) => setLedgerName(e.target.value)}
          placeholder="Enter customer name"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>

      {/* Item Search */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Add Item</label>
        <input
          type="text"
          placeholder="Search finished goods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          onChange={(e) => addOrderItem(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select Item</option>
          {finishedGoods
            .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <option key={item.id} value={item.name}>
                {item.name} (Stock: {item.quantity})
              </option>
            ))}
        </select>
      </div>

      {/* Order Items */}
      {orderItems.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-green-700 mb-2">Order Items</h3>
          <div className="space-y-3">
            {orderItems.map((o, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-2 items-center bg-white/60 p-2 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <span className="font-medium col-span-2">{o.name}</span>

                <input
                  type="number"
                  min="1"
                  value={o.qty}
                  onChange={(e) => updateItemField(idx, "qty", e.target.value)}
                  className="px-2 py-1 border rounded text-center focus:ring-2 focus:ring-green-400"
                />

                <input
                  type="number"
                  min="0"
                  value={o.rate}
                  placeholder="Rate"
                  onChange={(e) => updateItemField(idx, "rate", e.target.value)}
                  className="px-2 py-1 border rounded text-center focus:ring-2 focus:ring-green-400"
                />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">
                    ₹{o.total.toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeOrderItem(idx)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-400 transition"
                    title="Remove Item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="text-right mt-4 font-bold text-lg text-green-700">
            Total Amount: ₹{totalAmount.toFixed(2)}
          </div>
        </div>
      )}

      <button
        onClick={placeOrder}
        className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold px-4 py-2 rounded-lg w-full shadow-md transition-all"
      >
        ✅ Place Order
      </button>
    </div>
  );
}
