export default function OrderHistory({ orders, setOrders, setSelectedOrder, restockOrder }) {
  const deleteOrder = (order) => {
    if (!confirm("Delete this order?")) return;
    restockOrder(order);
    setOrders(orders.filter((o) => o !== order));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex-1">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">📜 Orders / History</h2>
      {orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
      <ul className="divide-y divide-gray-200">
        {orders.map((o, idx) => (
          <li
            key={idx}
            className="py-3 cursor-pointer hover:bg-gray-50 rounded px-2"
            onClick={() => setSelectedOrder(o)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{o.ledger}</div>
                <div className="text-sm text-gray-600">{o.date}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteOrder(o);
                  }}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                >
                  ❌
                </button>
              </div>
            </div>
            <ul className="list-disc list-inside text-gray-700 mt-1">
              {o.items.map((i, index) => (
                <li key={index}>{i.name} - Qty: {i.qty}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
