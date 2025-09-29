// Dashboard.jsx
import { useState } from "react";
import { FaBox, FaExclamationTriangle, FaLayerGroup } from "react-icons/fa";

export default function Dashboard() {
  const [items] = useState([
    { id: 1, name: "Laptop", quantity: 10 },
    { id: 2, name: "Keyboard", quantity: 3 },
    { id: 3, name: "Mouse", quantity: 40 },
  ]);

  const totalItems = items.length;
  const lowStock = items.filter((i) => i.quantity < 5).length;
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

  const lowStockPercent = Math.min((lowStock / totalItems) * 100, 100);
  const totalQuantityPercent = Math.min((totalQuantity / 100) * 100, 100); // assuming 100 as max for demo

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">📊 Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Items */}
        <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-700">Total Items</h3>
            <FaBox className="text-blue-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
          <div className="h-2 bg-blue-100 rounded-full mt-3">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: "100%" }}
            ></div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-red-700">Low Stock</h3>
            <FaExclamationTriangle className="text-red-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{lowStock}</p>
          <div className="h-2 bg-red-100 rounded-full mt-3">
            <div
              className="h-2 bg-red-500 rounded-full"
              style={{ width: `${lowStockPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Total Quantity */}
        <div className="bg-white shadow-md rounded-lg p-5 hover:shadow-xl transition relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-700">Total Quantity</h3>
            <FaLayerGroup className="text-green-500 text-2xl" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalQuantity}</p>
          <div className="h-2 bg-green-100 rounded-full mt-3">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${totalQuantityPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
