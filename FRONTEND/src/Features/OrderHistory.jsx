import { useState, useEffect } from "react";
import { FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderHistory({
  orders,
  setOrders,
  setSelectedOrder,
  restockOrder,
  items = [],
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [undoData, setUndoData] = useState(null);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const formatDate = (d) => new Date(d).toISOString().split("T")[0];
  const changeDay = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    const todayStr = formatDate(selectedDate);
    setFilteredOrders(orders.filter((o) => o.date === todayStr));
  }, [selectedDate, orders]);

  const summary = filteredOrders.reduce(
    (acc, o) => {
      acc.count++;
      o.items.forEach((i) => {
        acc.totalQty += Number(i.qty);
        acc.totalItems++;
        acc.ledgerCount[o.ledger] = (acc.ledgerCount[o.ledger] || 0) + 1;
        acc.itemCount[i.name] = (acc.itemCount[i.name] || 0) + Number(i.qty);
      });
      return acc;
    },
    { count: 0, totalItems: 0, totalQty: 0, ledgerCount: {}, itemCount: {} }
  );

  const topLedger =
    Object.entries(summary.ledgerCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";
  const topItem =
    Object.entries(summary.itemCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  useEffect(() => {
    const alerts = items.filter((i) => Number(i.quantity) < 10);
    setLowStockAlerts(alerts);
  }, [items]);

  const deleteOrder = (order) => {
    if (!window.confirm("Delete this order?")) return;
    restockOrder(order);
    setUndoData({ order, timeout: setTimeout(() => setUndoData(null), 5000) });
    setOrders(orders.filter((o) => o !== order));
  };

  const undoDelete = () => {
    if (undoData) {
      clearTimeout(undoData.timeout);
      setOrders((prev) => [undoData.order, ...prev]);
      setUndoData(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white shadow-xl rounded-2xl p-6 flex-1 relative overflow-hidden border border-gray-100">
      {/* Header with date navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          📘 Daily Orders
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => changeDay(-1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <FaArrowLeft />
          </button>
          <span className="font-semibold text-gray-700 min-w-[130px] text-center">
            {selectedDate.toDateString()}
          </span>
          <button
            onClick={() => changeDay(1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 sticky top-0 z-10 shadow-sm">
        <div className="flex flex-wrap justify-between text-sm sm:text-base text-gray-800 font-medium">
          <div>🧾 Orders: <b>{summary.count}</b></div>
          <div>📦 Items: <b>{summary.totalItems}</b></div>
          <div>🔢 Quantity: <b>{summary.totalQty}</b></div>
        </div>
        <div className="mt-1 text-xs sm:text-sm text-gray-500 italic">
          Top Ledger: <b>{topLedger}</b> • Top Item: <b>{topItem}</b>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 mb-5 rounded-lg text-sm">
          ⚠️ <b>Low stock alert:</b>{" "}
          {lowStockAlerts.map((i) => (
            <span key={i.name} className="font-semibold mr-2">
              {i.name} ({i.quantity})
            </span>
          ))}
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-10 italic">
          No orders recorded for this date.
        </p>
      ) : (
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <AnimatePresence>
            {filteredOrders.map((o, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedOrder(o)}
                className="group bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition rounded-xl p-4 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-lg text-gray-800">
                      {o.ledger}
                    </div>
                    <div className="text-sm text-gray-500">{o.date}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOrder(o);
                    }}
                    className="opacity-80 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-400 transition flex items-center gap-1 text-sm"
                    title="Delete Order"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>

                <ul className="text-gray-700 mt-1 space-y-1 text-sm border-t border-gray-100 pt-2">
                  {o.items.map((i, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{i.name}</span>
                      <span className="font-medium">Qty: {i.qty}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Undo Snackbar */}
      {undoData && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-4"
        >
          <span>Order deleted</span>
          <button
            onClick={undoDelete}
            className="underline font-semibold hover:text-green-300"
          >
            Undo
          </button>
        </motion.div>
      )}
    </div>
  );
}
