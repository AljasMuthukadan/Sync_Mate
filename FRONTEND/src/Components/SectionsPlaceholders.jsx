// SectionsPlaceholders.jsx
import { FaTruck, FaFileInvoice, FaUserTie, FaChartLine, FaBell, FaUser } from "react-icons/fa";
import {
  FaBox,
  FaShoppingCart,
  FaExclamationTriangle,
  FaWarehouse,
  FaTrashAlt,
} from "react-icons/fa";


export const SuppliersSection = () => {
  const suppliers = [
    { id: 1, name: "ABC Supplies", contact: "abc@supplies.com" },
    { id: 2, name: "XYZ Logistics", contact: "xyz@logistics.com" },
    { id: 3, name: "Global Traders", contact: "global@traders.com" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Suppliers</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">{s.name}</h3>
            <p className="text-gray-500 text-sm">{s.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

import {  FaFilePdf } from "react-icons/fa";

export const PurchaseOrdersSection = () => {
  const [orders, setOrders] = useState([
    {
      id: 101,
      supplier: "ABC Supplies",
      contact: "9876543210",
      email: "abc@supplies.com",
      date: "2025-10-20",
      expectedDate: "2025-10-27",
      status: "Pending",
      amount: 1200,
      tax: 18,
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    supplier: "",
    contact: "",
    email: "",
    date: "",
    expectedDate: "",
    amount: "",
    tax: 18,
    status: "Pending",
  });

  const statuses = ["Pending", "Approved", "Received", "Cancelled"];

  const handleAdd = () => {
    setEditingOrder(null);
    setFormData({
      supplier: "",
      contact: "",
      email: "",
      date: "",
      expectedDate: "",
      amount: "",
      tax: 18,
      status: "Pending",
    });
    setModalOpen(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ ...order });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this purchase order?")) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const handleSave = () => {
    const { supplier, amount, date } = formData;
    if (!supplier || !amount || !date) {
      alert("Please fill all required fields!");
      return;
    }

    if (editingOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id ? { ...formData, id: editingOrder.id } : o
        )
      );
    } else {
      const newOrder = { id: Date.now(), ...formData };
      setOrders((prev) => [...prev, newOrder]);
    }

    setModalOpen(false);
  };

  const calcTotal = (o) => {
    const amt = parseFloat(o.amount) || 0;
    const tax = parseFloat(o.tax) || 0;
    return amt + (amt * tax) / 100;
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Purchase Orders</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
        >
          <FaPlus /> Add PO
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-50 text-blue-700 font-medium">
            <tr>
              <th className="p-3 text-left">PO ID</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Expected</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr
                key={o.id}
                className="hover:bg-blue-50 transition-all duration-200"
              >
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.supplier}</td>
                <td className="p-3">{o.contact}</td>
                <td className="p-3">{o.date}</td>
                <td className="p-3">{o.expectedDate}</td>
                <td
                  className={`p-3 font-semibold ${
                    o.status === "Received"
                      ? "text-green-600"
                      : o.status === "Approved"
                      ? "text-blue-600"
                      : o.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {o.status}
                </td>
                <td className="p-3 font-medium">
                  ${calcTotal(o).toFixed(2)}
                </td>
                <td className="p-3 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(o)}
                    className="text-blue-600 hover:text-blue-500"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="text-red-600 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                  <button className="text-gray-700 hover:text-red-600">
                    <FaFilePdf />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-400">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              {editingOrder ? "Edit Purchase Order" : "Add Purchase Order"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Supplier Name *"
                className="border p-2 rounded-lg"
                value={formData.supplier}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Contact No."
                className="border p-2 rounded-lg"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded-lg"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2 rounded-lg"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
              <input
                type="date"
                className="border p-2 rounded-lg"
                value={formData.expectedDate}
                onChange={(e) =>
                  setFormData({ ...formData, expectedDate: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Amount *"
                className="border p-2 rounded-lg"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Tax (%)"
                className="border p-2 rounded-lg"
                value={formData.tax}
                onChange={(e) =>
                  setFormData({ ...formData, tax: e.target.value })
                }
              />
              <select
                className="border p-2 rounded-lg"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

export const StaffSection = ({ staff, setStaff }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    mobile: "",
    department: "",
  });
  const [search, setSearch] = useState("");

  const roles = ["Manager", "Warehouse Staff", "Production Staff", "Admin"];

  const handleAdd = () => {
    setEditingStaff(null);
    setFormData({ name: "", role: "", email: "", mobile: "", department: "" });
    setModalOpen(true);
  };

  const handleEdit = (s) => {
    setEditingStaff(s);
    setFormData({ ...s });
    setModalOpen(true);
  };

  const handleSave = () => {
    const { name, role, email, mobile } = formData;
    if (!name || !role || !email || !mobile) return alert("Fill all required fields!");

    if (editingStaff) {
      setStaff((prev) =>
        prev.map((s) => (s.id === editingStaff.id ? { ...formData, id: s.id } : s))
      );
    } else {
      const newStaff = { ...formData, id: Date.now() };
      setStaff((prev) => [...prev, newStaff]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header + Add button + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-2xl font-semibold text-blue-700">Staff / HR</h2>

        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff..."
              className="border p-2 pl-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus /> Add Staff
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition relative group"
          >
            <h3 className="font-semibold text-lg">{s.name}</h3>
            <p className="text-gray-500 text-sm">{s.role}</p>
            {s.department && <p className="text-gray-400 text-sm">Dept: {s.department}</p>}
            {s.email && <p className="text-gray-400 text-sm">Email: {s.email}</p>}
            {s.mobile && <p className="text-gray-400 text-sm">Mobile: {s.mobile}</p>}

            {/* Hover Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleEdit(s)}
                className="text-blue-600 hover:text-blue-500"
                title="Edit Staff"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-600 hover:text-red-500"
                title="Delete Staff"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">
              {editingStaff ? "Edit Staff" : "Add Staff"}
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name *"
                className="border p-2 rounded-lg w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <select
                className="border p-2 rounded-lg w-full"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="">Select Role *</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <input
                type="email"
                placeholder="Email *"
                className="border p-2 rounded-lg w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Mobile *"
                className="border p-2 rounded-lg w-full"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
              <input
                type="text"
                placeholder="Department"
                className="border p-2 rounded-lg w-full"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { FaClipboardList, FaShippingFast, FaCheckCircle } from "react-icons/fa";

export const AnalyticsSection = () => {
  const stats = [
    {
      title: "Total Orders",
      value: 320,
      icon: <FaClipboardList className="text-blue-600 text-3xl" />,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Pending Shipments",
      value: 45,
      icon: <FaShippingFast className="text-yellow-500 text-3xl" />,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Completed Productions",
      value: 128,
      icon: <FaCheckCircle className="text-green-500 text-3xl" />,
      color: "from-green-400 to-emerald-600",
    },
  ];

  return (
    <div className="w-full p-4">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
        📊 Analytics & Insights
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${s.color} text-white p-[2px] rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105`}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-white/70 rounded-full shadow-md">
                {s.icon}
              </div>
              <p className="text-gray-600 font-medium">{s.title}</p>
              <p className="text-4xl font-extrabold text-gray-800">{s.value}</p>
              <div className="mt-2 h-[4px] w-2/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export const NotificationsSection = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New shipment received",
      time: "5 mins ago",
      type: "shipment",
      read: false,
    },
    {
      id: 2,
      message: "Order #102 completed",
      time: "30 mins ago",
      type: "order",
      read: true,
    },
    {
      id: 3,
      message: "Low stock alert: Keyboard",
      time: "1 hr ago",
      type: "stock",
      read: false,
    },
    {
      id: 4,
      message: "System maintenance scheduled tonight",
      time: "3 hrs ago",
      type: "alert",
      read: false,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case "shipment":
        return <FaBox className="text-blue-500 text-lg" />;
      case "order":
        return <FaShoppingCart className="text-green-500 text-lg" />;
      case "stock":
        return <FaWarehouse className="text-yellow-500 text-lg" />;
      case "alert":
        return <FaExclamationTriangle className="text-red-500 text-lg" />;
      default:
        return <FaCheckCircle className="text-gray-400 text-lg" />;
    }
  };

  const markAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => {
    if (confirm("Clear all notifications?")) setNotifications([]);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-500 flex items-center gap-1"
          >
            <FaTrashAlt /> Clear All
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            No notifications available.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex justify-between items-center p-4 rounded-xl shadow-md border border-gray-100 transition-all duration-200 ${
                n.read ? "bg-white" : "bg-blue-50"
              } hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                {getIcon(n.type)}
                <div>
                  <p
                    className={`font-medium ${
                      n.read ? "text-gray-600" : "text-blue-700"
                    }`}
                  >
                    {n.message}
                  </p>
                  <p className="text-gray-400 text-sm">{n.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Mark read/unread */}
                <button
                  onClick={() => markAsRead(n.id)}
                  className={`text-sm px-3 py-1 rounded-full border ${
                    n.read
                      ? "border-blue-400 text-blue-600 hover:bg-blue-50"
                      : "border-green-400 text-green-600 hover:bg-green-50"
                  }`}
                >
                  {n.read ? "Unread" : "Read"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

import {  FaUserEdit } from "react-icons/fa";

export const CustomersSection = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210", address: "New York" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "9988776655", address: "California" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", phone: "9123456789", address: "Texas" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({ ...customer });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCustomer) {
      // Update existing customer
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...editingCustomer, ...formData } : c));
    } else {
      // Add new customer
      setCustomers([...customers, { id: Date.now(), ...formData }]);
    }

    setShowForm(false);
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Customers / Clients</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <FaPlus /> Add Ledger
        </button>
      </div>

      {/* Customer Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map(c => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition relative"
          >
            <h3 className="font-semibold text-lg text-blue-700">{c.name}</h3>
            <p className="text-gray-600 text-sm">{c.email}</p>
            <p className="text-gray-500 text-sm">📞 {c.phone}</p>
            <p className="text-gray-400 text-sm">📍 {c.address}</p>

            <div className="flex gap-3 mt-3">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => handleEdit(c)}
              >
                <FaUserEdit />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(c.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              {editingCustomer ? "Edit Ledger" : "Add New Ledger"}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
