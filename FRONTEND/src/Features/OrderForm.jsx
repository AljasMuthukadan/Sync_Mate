
import { useState } from "react";

export default function OrderForm({ items, setItems, addNewOrder }) {
  const [ledgerName, setLedgerName] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [search, setSearch] = useState("");

  const finishedGoods = items.filter((i) => i.category === "Finished Goods");

  const addOrderItem = (itemName) => {
    if (!itemName || orderItems.find((o) => o.name === itemName)) return;
    setOrderItems([...orderItems, { name: itemName, qty: 1, rate: 0 }]);
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
    <div className="bg-white shadow-md rounded-lg p-6 flex-1">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">🛒 New Order</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Ledger / Customer Name</label>
        <input
          type="text"
          value={ledgerName}
          onChange={(e) => setLedgerName(e.target.value)}
          placeholder="Enter customer name"
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Add Item</label>
        <input
          type="text"
          placeholder="Search finished goods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-2"
        />
        <select
          onChange={(e) => addOrderItem(e.target.value)}
          className="border px-3 py-2 rounded w-full"
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

      {orderItems.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-green-700">Order Items:</h3>
          {orderItems.map((o, idx) => (
            <div key={idx} className="flex gap-2 items-center mb-2">
              <span className="flex-1">{o.name}</span>
              <input
                type="number"
                value={o.qty}
                min="1"
                onChange={(e) => {
                  const newItems = [...orderItems];
                  newItems[idx].qty = Number(e.target.value);
                  setOrderItems(newItems);
                }}
                className="border px-2 py-1 rounded w-20"
              />
              <button
                onClick={() => removeOrderItem(idx)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={placeOrder}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 w-full"
      >
        Place Order
      </button>
    </div>
  );
}
