import { useState } from "react";
import {
  FaTachometerAlt,
  FaBoxes,
  FaCogs,
  FaTruck,
  FaClipboardList,
  FaIndustry,
  FaBars,
  FaBell,
  FaSearch,
  FaChartBar,
  FaUsers,
  FaUserTie,
  FaFileInvoice,
} from "react-icons/fa";

import Dashboard from "../Components/Dashboard.jsx";
import ItemsSection from "../Components/ItemsSection.jsx";
import ShipmentsSection from "../Components/ShipmentsSection.jsx";
import SettingsSection from "../Components/SettingsSection.jsx";
import FinishedGoodsProduction from "../Components/FinishedGoodsProduction.jsx";
import Orders from "../Components/Orders.jsx";
import ReportsSection from "../Components/ReportsSection.jsx";
import TaskSection from "../Components/TaskSection.jsx";

import {
  SuppliersSection,
  PurchaseOrdersSection,
  StaffSection,
  AnalyticsSection,
  NotificationsSection,
  CustomersSection,
} from "../Components/SectionsPlaceholders.jsx";

export default function HomePage() {
  const [page, setPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [items, setItems] = useState([
    { id: 1, name: "Laptop", quantity: 10, category: "Finished Goods" },
    { id: 2, name: "Keyboard", quantity: 3, category: "Raw Materials" },
    { id: 3, name: "Mouse", quantity: 40, category: "Finished Goods" },
    { id: 4, name: "Durofill GL-250 400 gm", quantity: 899, category: "Finished Goods" },
    { id: 5, name: "Durofill GL-250 1500 gm", quantity: 350, category: "Finished Goods" },
  ]);

  const [orders, setOrders] = useState([]);
  const [productions, setProductions] = useState([]);
  const staffList = [
    { id: 1, name: "Alice Johnson", role: "Manager" },
    { id: 2, name: "Bob Smith", role: "Warehouse Staff" },
    { id: 3, name: "Charlie Brown", role: "Production Staff" },
  ];

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Orders", icon: <FaClipboardList /> },
    { name: "Items", icon: <FaBoxes /> },
    { name: "Production", icon: <FaIndustry /> },
    { name: "Shipments", icon: <FaTruck /> },
    { name: "Tasks", icon: <FaClipboardList /> },
    { name: "Reports", icon: <FaChartBar /> },
    { name: "Suppliers", icon: <FaTruck /> },
    { name: "Purchase Orders", icon: <FaFileInvoice /> },
    { name: "Staff", icon: <FaUserTie /> },
    { name: "Analytics", icon: <FaChartBar /> },
    { name: "Notifications", icon: <FaBell /> },
    { name: "Customers", icon: <FaUsers /> },
    { name: "Settings", icon: <FaCogs /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 h-full w-64 bg-white text-gray-800 p-5 shadow-lg transform md:translate-x-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:block`}
      >
        <h1 className="text-3xl font-bold mb-8 text-blue-700 tracking-tight font-mono">
          SYNC MATE
        </h1>
        <nav className="space-y-2">
          {menuItems.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => {
                setPage(name);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg transition-colors duration-200 ${
                page === name
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-100 hover:text-blue-700"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="font-medium">{name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-blue-700 md:hidden text-xl"
            >
              <FaBars />
            </button>
            <h1 className="text-xl font-bold text-blue-700 hidden md:block">{page}</h1>
          </div>

          <div className="flex-1 mx-4 relative hidden md:flex">
            <input
              type="text"
              placeholder="Search shipments, orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative text-gray-600 hover:text-gray-800 transition">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg transition">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                A
              </div>
              <span className="font-medium hidden md:block">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {page === "Dashboard" && (
            <Dashboard
              items={items}
              orders={orders}
              productions={productions}
              setPage={setPage}
            />
          )}
          {page === "Items" && <ItemsSection items={items} setItems={setItems} />}
          {page === "Production" && (
            <FinishedGoodsProduction
              items={items}
              setItems={setItems}
              productions={productions}
              setProductions={setProductions}
            />
          )}
          {page === "Shipments" && <ShipmentsSection />}
          {page === "Tasks" && <TaskSection items={items} setItems={setItems}  staff={staffList} />}
          {page === "Reports" && <ReportsSection items={items} orders={orders} productions={productions} />}
          {page === "Suppliers" && <SuppliersSection />}
          {page === "Purchase Orders" && <PurchaseOrdersSection />}
          {page === "Staff" && <StaffSection staff={staffList} />}
          {page === "Analytics" && <AnalyticsSection />}
          {page === "Notifications" && <NotificationsSection />}
          {page === "Customers" && <CustomersSection />}
          {page === "Settings" && <SettingsSection />}
          {page === "Orders" && (
            <Orders
              items={items}
              setItems={setItems}
              orders={orders}
              setOrders={setOrders}
            />
          )}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
        ></div>
      )}
    </div>
  );
}
