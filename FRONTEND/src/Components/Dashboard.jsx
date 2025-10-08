import { motion } from "framer-motion";
import {
  FaBox,
  FaIndustry,
  FaShoppingCart,
  FaTruck,
  FaCog,
  FaChartLine,
} from "react-icons/fa";

export default function Dashboard({ items, orders, productions, setPage }) {
  const totalItems = items.length;
  const lowStock = items.filter((i) => i.quantity < 5).length;
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  const totalOrders = orders.length;
  const totalProductions = productions.length;

  const summaryCards = [
    {
      title: "Inventory",
      subtitle: `Total: ${totalQuantity} items`,
      color: "blue",
      icon: <FaBox className="text-blue-500 text-4xl" />,
      value: totalItems,
      onClick: () => setPage("Items"),
    },
    {
      title: "Orders",
      subtitle: "Total Orders Placed",
      color: "green",
      icon: <FaShoppingCart className="text-green-500 text-4xl" />,
      value: totalOrders,
      onClick: () => setPage("Orders"),
    },
    {
      title: "Production",
      subtitle: "Total Productions Recorded",
      color: "indigo",
      icon: <FaIndustry className="text-indigo-500 text-4xl" />,
      value: totalProductions,
      onClick: () => setPage("Production"),
    },
    {
      title: "Shipments",
      subtitle: "Active Shipments",
      color: "orange",
      icon: <FaTruck className="text-orange-500 text-4xl" />,
      value: 8,
      onClick: () => setPage("Shipments"),
    },
    {
      title: "Settings",
      subtitle: "Manage Preferences",
      color: "gray",
      icon: <FaCog className="text-gray-500 text-4xl" />,
      value: "⚙️",
      onClick: () => setPage("Settings"),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <FaChartLine className="text-blue-600" />
          Dashboard Overview
        </h2>
        <span className="text-gray-500 font-medium">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Summary Cards */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            onClick={card.onClick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-3">
              <h3
                className={`text-lg font-semibold text-${card.color}-700 capitalize`}
              >
                {card.title}
              </h3>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            <p className="text-gray-600 mt-1">{card.subtitle}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Inventory Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Inventory Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-700">{totalItems}</p>
            <p className="text-gray-600">Total Items</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-700">{totalQuantity}</p>
            <p className="text-gray-600">Total Quantity</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-700">{lowStock}</p>
            <p className="text-gray-600">Low Stock Items</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
      >
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Recent Activity
        </h3>
        <ul className="space-y-3 text-gray-700">
          {productions.slice(0, 3).map((p, i) => (
            <li
              key={i}
              className="border-b border-gray-100 pb-2 flex items-center gap-2"
            >
              <FaIndustry className="text-indigo-500" />
              Produced{" "}
              <strong className="text-gray-800">{p.quantity}</strong> of{" "}
              <strong className="text-gray-800">{p.product}</strong> on{" "}
              {p.date}
            </li>
          ))}
          {orders.slice(0, 3).map((o, i) => (
            <li
              key={i}
              className="border-b border-gray-100 pb-2 flex items-center gap-2"
            >
              <FaShoppingCart className="text-green-500" />
              Order for{" "}
              <strong className="text-gray-800">{o.ledger}</strong> —{" "}
              {o.items.length} items on {o.date}
            </li>
          ))}
          {orders.length === 0 && productions.length === 0 && (
            <li className="text-gray-500 italic">No recent activity yet.</li>
          )}
        </ul>
      </motion.div>
    </div>
  );
}
