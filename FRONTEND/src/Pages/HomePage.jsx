import { useState } from "react";
import Dashboard from "../Components/Dashboard.jsx";
import ItemsSection from "../Components/ItemsSection.jsx";
import ShipmentsSection from "../Components/ShipmentsSection.jsx";
import SettingsSection from "../Components/SettingsSection.jsx";
import FinishedGoodsProduction from "../Components/FinishedGoodsProduction.jsx";
import Orders from "../Components/Orders.jsx";

export default function HomePage() {
  const [page, setPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Lifted items state here
  const [items, setItems] = useState([
    { id: 1, name: "Laptop", quantity: 10, category: "Finished Goods", image: null },
    { id: 2, name: "Keyboard", quantity: 3, category: "Raw Materials", image: null },
    { id: 3, name: "Mouse", quantity: 40, category: "Finished Goods", image: null },
    { id: 4, name: "Ice Cream Mix", quantity: 500, category: "Raw Materials", image: null },
    { id: 5, name: "Stick", quantity: 100, category: "Raw Materials", image: null },
    { id: 6, name: "Bottle", quantity: 50, category: "Raw Materials", image: null },
  ]);

  const menuItems = ["Dashboard","Orders" ,"Items","Production" ,"Shipments", "Settings"];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 h-full w-64 bg-white text-blue-700 p-5 shadow-md transform md:translate-x-0 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:block`}
      >
        <h1 className="text-2xl font-bold mb-6">Inventory</h1>
        <nav className="space-y-4">
          {menuItems.map((menu) => (
            <button
              key={menu}
              onClick={() => {
                setPage(menu);
                setSidebarOpen(false);
              }}
              className={`block w-full text-left py-2 px-4 rounded font-medium transition ${
                page === menu
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100 hover:text-blue-800"
              }`}
            >
              {menu}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-blue-700 font-bold"
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>
          <h1 className="text-xl font-bold text-blue-700">{page}</h1>
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {page === "Dashboard" && <Dashboard items={items} />}
          {page === "Items" && <ItemsSection items={items} setItems={setItems} />}
            {page === "Production" && <FinishedGoodsProduction items={items} setItems={setItems} />}
          {page === "Shipments" && <ShipmentsSection />}
          {page === "Settings" && <SettingsSection />}
          {page === "Orders" && <Orders items={items} setItems={setItems} />}
        </main>
      </div>
    </div>
  );
}
