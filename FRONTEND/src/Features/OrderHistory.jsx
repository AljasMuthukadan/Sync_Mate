import { FaTrash } from "react-icons/fa";

export default function OrderHistory({ orders, setOrders, setSelectedOrder, restockOrder }) {
  const deleteOrder = (order) => {
    if (!confirm("Delete this order?")) return;
    restockOrder(order);
    setOrders(orders.filter((o) => o !== order));
  };

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl p-6 flex-1 transition-all">
      <h2 className="text-2xl font-bold text-green-700 mb-5">📜 Orders / History</h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-center py-10">No orders yet.</p>
      )}

      <ul className="space-y-3">
        {orders.map((o, idx) => (
          <li
            key={idx}
            className="bg-white/50 backdrop-blur-sm rounded-lg p-4 hover:shadow-md cursor-pointer transition flex flex-col gap-2"
            onClick={() => setSelectedOrder(o)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg text-gray-800">{o.ledger}</div>
                <div className="text-sm text-gray-500">{o.date}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteOrder(o);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition flex items-center gap-1"
                title="Delete Order"
              >
                <FaTrash /> Delete
              </button>
            </div>

            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              {o.items.map((i, index) => (
                <li key={index} className="flex justify-between">
                  <span>{i.name}</span>
                  <span className="font-semibold">Qty: {i.qty}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
