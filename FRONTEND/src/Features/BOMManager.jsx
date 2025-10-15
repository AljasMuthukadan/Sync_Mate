import { useState } from "react";
import EditBOM from "./EditBOM.jsx";
import { FaPlus, FaClipboardList } from "react-icons/fa";

export default function BOMManagement({ items, bom, setBOM, onClose }) {
  const finishedGoods = items.filter((i) => i.category === "Finished Goods");
  const [activeTab, setActiveTab] = useState("existing");
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductName, setNewProductName] = useState("");

  const handleCreateNewBOM = () => {
    if (!newProductName.trim()) {
      alert("Please enter a finished product name!");
      return;
    }
    setEditingProduct(newProductName.trim());
    setNewProductName("");
  };

  return (
    <div className="absolute top-10 right-10 w-full max-w-3xl bg-[#fafafa] border border-gray-300 rounded-xl shadow-xl p-5 z-50 font-[Inter]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
        <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
          <FaClipboardList className="text-blue-600" />
          Bill of Materials Management
        </h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-red-500 font-semibold text-lg"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-5">
        <button
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "existing"
              ? "border-b-2 border-blue-600 text-blue-700"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("existing")}
        >
          Finished Goods
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "new"
              ? "border-b-2 border-blue-600 text-blue-700"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("new")}
        >
          Create New BOM
        </button>
      </div>

      {/* Content Section */}
      <div className="max-h-[65vh] overflow-y-auto pr-1">
        {/* Existing BOMs */}
        {activeTab === "existing" && (
          <div className="space-y-3">
            {finishedGoods.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No finished goods found.
              </p>
            ) : (
              finishedGoods.map((fg) => (
                <div
                  key={fg.id}
                  className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div>
                    <h4 className="text-gray-800 font-semibold">{fg.name}</h4>
                    {bom[fg.name] && (
                      <p className="text-gray-500 text-xs">
                        {bom[fg.name].length} materials defined
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingProduct(fg.name)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition-all"
                  >
                    Edit BOM
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create New BOM */}
        {activeTab === "new" && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <label className="block text-gray-600 text-sm mb-2">
              Finished Product Name
            </label>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Enter product name..."
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition-all"
            />
            <button
              onClick={handleCreateNewBOM}
              className="mt-3 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-md transition-all"
            >
              <FaPlus /> Create BOM
            </button>
          </div>
        )}

        {/* Inline EditBOM */}
        {editingProduct && (
          <div className="mt-6 border-t border-gray-300 pt-4">
            <EditBOM
              product={editingProduct}
              bom={bom}
              setBOM={setBOM}
              items={items}
              onClose={() => setEditingProduct(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
