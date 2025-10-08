import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export default function OrderForm({ items, setItems, addNewOrder }) {
  const [ledgerName, setLedgerName] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [search, setSearch] = useState("");

  const finishedGoods = items.filter((i) => i.category === "Finished Goods");

  const addOrderItem = (itemName) => {
    if (!itemName || orderItems.find((o) => o.name === itemName)) return;
    setOrderItems([...orderItems, { name: itemName, qty: 1 }]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const placeOrder = () => {
    if (!ledgerName || orderItems.length === 0) {
      alert("Enter ledger name and add items.");
      return;
    }

    const insufficient = orderItems.filter((o) => {
      const stockItem = items.find((i) => i.name === o.name);
      return !stockItem || stockItem.quantity < o.qty;
    });

    if (insufficient.length > 0) {
      alert("Not enough stock: " + insufficient.map((i) => i.name).join(", "));
      return;
    }

    const updatedItems = items.map((i) => {
      const ordered = orderItems.find((o) => o.name === i.name);
      if (ordered) return { ...i, quantity: i.quantity - ordered.qty };
      return i;
    });
    setItems(updatedItems);

    addNewOrder({
      ledger: ledgerName,
      items: orderItems,
      date: new Date().toLocaleString(),
    });

    setLedgerName("");
    setOrderItems([]);
    setSearch("");
  };

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6 flex-1 transition-all">
      <h2 className="text-2xl font-bold text-green-700 mb-5">🛒 New Order</h2>

      {/* Ledger Name */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Ledger / Customer Name</label>
        <input
          type="text"
          value={ledgerName}
          onChange={(e) => setLedgerName(e.target.value)}
          placeholder="Enter customer name"
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>

      {/* Search & Select Item */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Add Item</label>
        <input
          type="text"
          placeholder="Search finished goods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <select
          onChange={(e) => addOrderItem(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-300"
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
          <h3 className="font-semibold mb-2 text-green-700">Order Items</h3>
          <div className="space-y-2">
            {orderItems.map((o, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/50 backdrop-blur-sm"
              >
                <span className="flex-1 font-medium">{o.name}</span>
                <input
                  type="number"
                  min="1"
                  value={o.qty}
                  onChange={(e) => {
                    const updated = [...orderItems];
                    updated[idx].qty = Number(e.target.value);
                    setOrderItems(updated);
                  }}
                  className="w-20 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button
                  onClick={() => removeOrderItem(idx)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-400 transition"
                  title="Remove Item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={placeOrder}
        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded w-full font-semibold transition-all"
      >
        Place Order
      </button>
    </div>
  );
}
