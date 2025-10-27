import { useState } from "react";
import { FaPlusCircle, FaHistory, FaFileInvoice } from "react-icons/fa";
import OrderForm from "../Features/OrderForm.jsx";
import OrderHistory from "../Features/OrderHistory.jsx";
import OrderModal from "../Features/OrderModal.jsx";
import LedgerForm from "../Features/LedgerForm.jsx";
import LedgerList from "../Features/LedgerList.jsx";

export default function Orders({ items, setItems }) {
  const [orders, setOrders] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("form");
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);

  // --- Orders Functions ---
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

  // --- Ledger Functions ---
  const addLedger = (ledger) => setLedgers([ledger, ...ledgers]);
  const openLedgerModal = () => setLedgerModalOpen(true);

  return (
    <div className="min-h-[85vh] p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-xl flex flex-col">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-4 sm:mb-6 text-center">
        🛒 Orders & Ledger Management
      </h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[
          { key: "form", icon: <FaPlusCircle />, label: "New Order" },
          { key: "history", icon: <FaHistory />, label: "Order History" },
          { key: "ledger", icon: <FaFileInvoice />, label: "Ledgers" },
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
        {activeTab === "form" && (
          <OrderForm addNewOrder={addNewOrder} ledgers={ledgers} onClose={() => setActiveTab("history")} />
        )}

        {activeTab === "history" && (
          <OrderHistory
            orders={orders}
            setOrders={setOrders}
            setSelectedOrder={setSelectedOrder}
            restockOrder={restockOrder}
          />
        )}

        {activeTab === "ledger" && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={openLedgerModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
              >
                <FaPlusCircle /> Add Ledger
              </button>
            </div>
            <LedgerList ledgers={ledgers} />
          </div>
        )}
      </div>

      {/* Ledger Modal */}
      {ledgerModalOpen && (
        <LedgerForm addLedger={addLedger} onClose={() => setLedgerModalOpen(false)} />
      )}

      {/* Order Modal */}
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
