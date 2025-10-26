export default function ReportsSection({ items, orders, productions }) {
  // Derived counts
  const totalItems = items.length;
  const totalOrders = orders.length;
  const totalProductions = productions.length;

  // Calculate total stock
  const totalStock = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Reports & Analytics</h2>
      <p className="text-gray-600 mb-6">
        Real-time overview of your inventory, orders, and production activity.
      </p>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-semibold text-blue-800">Total Items</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{totalItems}</p>
          <p className="text-gray-600 text-sm mt-1">Total item types</p>
        </div>

        <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-semibold text-green-800">Total Stock</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalStock}</p>
          <p className="text-gray-600 text-sm mt-1">Combined quantity of all items</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-center shadow-sm">
          <h3 className="text-lg font-semibold text-yellow-800">Orders Placed</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{totalOrders}</p>
          <p className="text-gray-600 text-sm mt-1">Active & completed orders</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-center shadow-sm sm:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-purple-800">Productions Completed</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{totalProductions}</p>
          <p className="text-gray-600 text-sm mt-1">Total finished goods batches</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Activity</h3>
        <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
          <li>{orders.length > 0 ? `${orders.length} orders processed.` : "No orders yet."}</li>
          <li>{items.length > 0 ? `${items.length} different items in stock.` : "No items found."}</li>
          <li>{productions.length > 0 ? `${productions.length} production batches completed.` : "No production yet."}</li>
        </ul>
      </div>
    </div>
  );
}
