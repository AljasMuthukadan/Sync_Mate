import { useState } from "react";

export default function Orders({ items, setItems }) {
  const [ledgerName, setLedgerName] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const finishedGoods = items.filter((i) => i.category === "Finished Goods");

  // Add new item to current order
  const addOrderItem = (itemName) => {
    if (!itemName) return;
    if (orderItems.find((o) => o.name === itemName)) return; // prevent duplicates
    setOrderItems([...orderItems, { name: itemName, qty: 1 }]);
  };

  // Place order
  const placeOrder = () => {
    if (!ledgerName || orderItems.length === 0) {
      alert("Please add ledger name and at least one item");
      return;
    }

    // Check stock
    const insufficient = orderItems.filter((o) => {
      const stockItem = items.find((i) => i.name === o.name);
      return !stockItem || stockItem.quantity < o.qty;
    });

    if (insufficient.length > 0) {
      alert(
        "Not enough stock for: " + insufficient.map((i) => i.name).join(", ")
      );
      return;
    }

    // Deduct stock
    const updatedItems = items.map((i) => {
      const orderItem = orderItems.find((o) => o.name === i.name);
      if (orderItem) {
        return { ...i, quantity: i.quantity - orderItem.qty };
      }
      return i;
    });
    setItems(updatedItems);

    // Save order
    const newOrder = {
      ledger: ledgerName,
      items: orderItems,
      date: new Date().toLocaleString(),
    };
    setOrders([newOrder, ...orders]);

    // Reset form
    setLedgerName("");
    setOrderItems([]);
    setSearch("");

    alert("Order placed successfully!");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Order Form */}
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

        {/* Item Search + Add */}
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

        {/* Current Order Items */}
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
                  onClick={() =>
                    setOrderItems(orderItems.filter((_, i) => i !== idx))
                  }
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

      {/* Orders List */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">📜 Orders</h2>
        {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
        <ul className="divide-y divide-gray-200">
          {orders.map((o, idx) => (
            <li key={idx} className="py-3">
              <div className="font-semibold text-lg">{o.ledger}</div>
              <div className="text-sm text-gray-600">{o.date}</div>
              <ul className="list-disc list-inside text-gray-700 mt-1">
                {o.items.map((i, index) => (
                  <li key={index}>
                    {i.name} - Qty: {i.qty}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
