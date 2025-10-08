import { useState } from "react";
import { FaPlusCircle, FaHistory } from "react-icons/fa";
import OrderForm from "../Features/OrderForm.jsx";
import OrderHistory from "../Features/OrderHistory.jsx";
import OrderModal from "../Features/OrderModal.jsx";

export default function Orders({ items, setItems }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("form");

  const addNewOrder = (order) => setOrders([order, ...orders]);

  const restockOrder = (order) => {
    const updatedItems = [...items];
    order.items.forEach((oi) => {
      const item = updatedItems.find((i) => i.name === oi.name);
      if (item) item.quantity += Number(oi.qty);
    });
    setItems(updatedItems);
  };

  const deleteOrder = (order) => {
    restockOrder(order);
    setOrders(orders.filter((o) => o !== order));
    if (selectedOrder === order) setSelectedOrder(null);
  };

  return (
    <div className="min-h-[85vh] p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
        🛒 Orders Management
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "form"
              ? "bg-white/70 backdrop-blur-md shadow-lg text-blue-700"
              : "bg-white/50 backdrop-blur-sm border border-blue-200 text-blue-600 hover:bg-white/60"
          }`}
        >
          <FaPlusCircle /> New Order
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "history"
              ? "bg-white/70 backdrop-blur-md shadow-lg text-blue-700"
              : "bg-white/50 backdrop-blur-sm border border-blue-200 text-blue-600 hover:bg-white/60"
          }`}
        >
          <FaHistory /> Order History
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 transition-all duration-300">
        {activeTab === "form" ? (
          <OrderForm
            items={items}
            setItems={setItems}
            addNewOrder={addNewOrder}
          />
        ) : (
          <OrderHistory
            orders={orders}
            setOrders={setOrders}
            setSelectedOrder={setSelectedOrder}
            restockOrder={restockOrder}
          />
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          closeModal={() => setSelectedOrder(null)}
          deleteOrder={deleteOrder}
          restockOrder={restockOrder}
        />
      )}
    </div>
  );
}
