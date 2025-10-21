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

  const updateOrder = (updatedOrder) => {
    setOrders(orders.map((o) => (o === selectedOrder ? updatedOrder : o)));
  };

  return (
    <div className="min-h-[85vh] p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl flex flex-col">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-4 sm:mb-6 text-center">
        🛒 Orders Management
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { key: "form", icon: <FaPlusCircle />, label: "New Order" },
          { key: "history", icon: <FaHistory />, label: "Order History" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-xl font-semibold w-full sm:w-auto text-sm sm:text-base transition-all duration-300 ${
              activeTab === tab.key
                ? "bg-white/80 backdrop-blur-md shadow-lg text-blue-700"
                : "bg-white/50 backdrop-blur-sm border border-blue-200 text-blue-600 hover:bg-white/60"
            }`}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 flex-1 transition-all duration-300 overflow-x-auto">
        {activeTab === "form" ? (
          <OrderForm
            addNewOrder={addNewOrder}
            onClose={() => setActiveTab("history")}
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

      {/* Modal for viewing or editing existing orders */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          updateOrder={updateOrder}
          deleteOrder={deleteOrder}
        />
      )}
    </div>
  );
}
