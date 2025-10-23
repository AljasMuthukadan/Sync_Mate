import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaIndustry,
  FaShoppingCart,
  FaTruck,
  FaCog,
  FaChartLine,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Helper to format date as DD-MM-YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function Dashboard({
  items = [],
  orders = [],
  productions = [],
  shipments = [],
  setPage,
}) {
  const [filterDate, setFilterDate] = useState("");

  const totalItems = items.length;
  const lowStock = items.filter((i) => i.quantity < 5).length;
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  const totalOrders = orders.length;
  const totalProductions = productions.length;
  const totalShipments = shipments.length;

  const summaryCards = [
    {
      title: "Inventory",
      subtitle: `Total: ${totalQuantity} items`,
      gradient: "from-blue-500 to-blue-400",
      icon: <FaBox className="text-white text-3xl" />,
      value: totalItems,
      onClick: () => setPage && setPage("Items"),
    },
    {
      title: "Orders",
      subtitle: "Total Orders Placed",
      gradient: "from-green-500 to-green-400",
      icon: <FaShoppingCart className="text-white text-3xl" />,
      value: totalOrders,
      onClick: () => setPage && setPage("Orders"),
    },
    {
      title: "Production",
      subtitle: "Total Productions Recorded",
      gradient: "from-indigo-500 to-indigo-400",
      icon: <FaIndustry className="text-white text-3xl" />,
      value: totalProductions,
      onClick: () => setPage && setPage("Production"),
    },
    {
      title: "Shipments",
      subtitle: "Active Shipments",
      gradient: "from-orange-500 to-orange-400",
      icon: <FaTruck className="text-white text-3xl" />,
      value: totalShipments,
      onClick: () => setPage && setPage("Shipments"),
    },
    {
      title: "Settings",
      subtitle: "Manage Preferences",
      gradient: "from-gray-500 to-gray-400",
      icon: <FaCog className="text-white text-3xl" />,
      value: "⚙️",
      onClick: () => setPage && setPage("Settings"),
    },
  ];

  // --- Chart Data ---
  const activityDates = Array.from(
    new Set([
      ...productions.map((p) => p.date),
      ...orders.map((o) => o.date),
      ...shipments.map((s) => s.date),
    ])
  ).sort();

  const chartData = activityDates.map((date) => ({
    date: formatDate(date),
    inventory: items.reduce((acc, i) => acc + i.quantity, 0),
    orders: orders.filter((o) => o.date === date).length,
    productions: productions
      .filter((p) => p.date === date)
      .reduce((acc, p) => acc + p.quantity, 0),
    shipments: shipments.filter((s) => s.date === date).length,
  }));

  const filterActivity = (activity) =>
    !filterDate || activity.date === filterDate;

  // --- Mini Donut Charts ---
  const lowStockData = [
    { name: "Low Stock", value: lowStock },
    { name: "Sufficient Stock", value: totalItems - lowStock },
  ];
  const ordersData = [
    { name: "Orders", value: totalOrders },
    { name: "No Orders", value: totalItems - totalOrders },
  ];
  const shipmentsData = [
    { name: "Shipments", value: totalShipments },
    { name: "No Shipments", value: totalItems - totalShipments },
  ];

  const COLORS = ["#EF4444", "#E5E7EB"]; // red + gray
  const GREENCOLORS = ["#10B981", "#E5E7EB"];
  const ORANGECOLORS = ["#F97316", "#E5E7EB"];

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-600" /> Dashboard
        </h2>
        <span className="text-gray-500 font-medium">
          {formatDate(new Date())}
        </span>
      </div>

      {/* Summary Cards */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
      >
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            onClick={card.onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className={`cursor-pointer bg-gradient-to-r ${card.gradient} shadow-lg rounded-xl p-6 text-white flex flex-col justify-between`}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xl font-semibold">{card.title}</p>
                <p className="text-sm opacity-80">{card.subtitle}</p>
              </div>
              {card.icon}
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Mini Donut Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-center">
          <p className="font-semibold mb-2 text-gray-700">Low Stock Items</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={lowStockData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {lowStockData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val} items`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-center">
          <p className="font-semibold mb-2 text-gray-700">Total Orders</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={ordersData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {ordersData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={GREENCOLORS[index % GREENCOLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val} orders`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-center">
          <p className="font-semibold mb-2 text-gray-700">Active Shipments</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={shipmentsData}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {shipmentsData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={ORANGECOLORS[index % ORANGECOLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `${val} shipments`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Trends Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-200"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Activity Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="inventory"
              stroke="#3B82F6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10B981"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="productions"
              stroke="#6366F1"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="shipments"
              stroke="#F97316"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <label className="font-medium text-gray-700">Filter Activity:</label>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setFilterDate("")}
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          Clear
        </button>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-200"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <ul className="space-y-3 text-gray-700">
          {productions
            ?.filter(filterActivity)
            .slice(0, 5)
            .map((p, i) => (
              <li
                key={i}
                className="border-b border-gray-100 pb-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => setPage && setPage("Production")}
              >
                <FaIndustry className="text-indigo-500" />
                Produced <strong>{p.quantity}</strong> of <strong>{p.product}</strong> on {formatDate(p.date)}
              </li>
            ))}
          {orders
            ?.filter(filterActivity)
            .slice(0, 5)
            .map((o, i) => (
              <li
                key={i}
                className="border-b border-gray-100 pb-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => setPage && setPage("Orders")}
              >
                <FaShoppingCart className="text-green-500" />
                Order for <strong>{o.ledger}</strong> — {o.items?.length || 0} items on {formatDate(o.date)}
              </li>
            ))}
          {shipments
            ?.filter(filterActivity)
            .slice(0, 5)
            .map((s, i) => (
              <li
                key={i}
                className="border-b border-gray-100 pb-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => setPage && setPage("Shipments")}
              >
                <FaTruck className="text-orange-500" />
                Shipment for <strong>{s.ledger || "N/A"}</strong> on {formatDate(s.date)}
              </li>
            ))}
          {productions?.length === 0 &&
            orders?.length === 0 &&
            shipments?.length === 0 && (
              <li className="text-gray-500 italic">No recent activity yet.</li>
            )}
        </ul>
      </motion.div>
    </div>
  );
}
