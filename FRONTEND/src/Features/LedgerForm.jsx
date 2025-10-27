import { useState } from "react";

export default function LedgerForm({ addLedger, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    gstin: "",
    pincode: "",
    address: "",
    phone: "",
    category: "Sundry Debtors",
  });

  const handleSave = () => {
    const { name, gstin, pincode, address, phone, category } = formData;
    if (!name || !gstin || !pincode || !address || !phone || !category) {
      alert("Please fill all fields!");
      return;
    }
    addLedger(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-lg shadow-xl border border-gray-200">
        {/* Header */}
        <h3 className="text-2xl font-bold text-blue-700 mb-5 text-center">
          Add New Ledger
        </h3>

        {/* Grid Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ledger Name */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Ledger Name *</label>
            <input
              type="text"
              placeholder="Enter Ledger Name"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Category *</label>
            <select
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Sundry Debtors</option>
              <option>Other</option>
            </select>
          </div>

          {/* GSTIN */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">GSTIN *</label>
            <input
              type="text"
              placeholder="Enter GSTIN"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
            />
          </div>

          {/* Pincode */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium mb-1">Pincode *</label>
            <input
              type="text"
              placeholder="Enter Pincode"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-600 font-medium mb-1">Address *</label>
            <textarea
              placeholder="Enter Address"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-gray-600 font-medium mb-1">Phone *</label>
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
