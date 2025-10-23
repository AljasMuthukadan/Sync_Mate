import { useState } from "react";
import EditBOM from "./EditBOM.jsx";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.35 }}
        className="fixed top-10 right-6 z-50 w-[95%] sm:w-[90%] md:max-w-3xl bg-white/70 backdrop-blur-2xl border border-gray-300/30 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-6 font-[Inter]"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-5">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FaClipboardList className="text-blue-600 text-xl" />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Bill of Materials
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-lg font-bold transition-all rounded-full hover:bg-red-100 p-1"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-300/50 mb-6">
          {[
            { key: "existing", label: "Finished Goods" },
            { key: "new", label: "Create New BOM" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 text-sm sm:text-base font-medium rounded-t-md transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar space-y-4">
          {/* Existing BOMs */}
          {activeTab === "existing" && (
            <div className="space-y-3">
              {finishedGoods.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6 italic">
                  No finished goods found.
                </p>
              ) : (
                finishedGoods.map((fg, index) => (
                  <motion.div
                    key={fg.id || index}
                    whileHover={{ scale: 1.01 }}
                    className="flex justify-between items-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl px-5 py-3 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div>
                      <h4 className="text-gray-900 font-semibold text-base">
                        {fg.name}
                      </h4>
                      {bom[fg.name] && (
                        <p className="text-gray-500 text-xs mt-1">
                          {bom[fg.name].length} materials defined
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingProduct(fg.name)}
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
                    >
                      Edit BOM
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Create New BOM */}
          {activeTab === "new" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <label className="block text-gray-700 text-sm mb-2 font-medium">
                Finished Product Name
              </label>
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Enter product name..."
                className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all bg-white/70"
              />
              <button
                onClick={handleCreateNewBOM}
                className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-md transition-all"
              >
                <FaPlus /> Create BOM
              </button>
            </motion.div>
          )}

          {/* Edit Section */}
          {editingProduct && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 border-t border-gray-200 pt-4"
            >
              <EditBOM
                product={editingProduct}
                bom={bom}
                setBOM={setBOM}
                items={items}
                onClose={() => setEditingProduct(null)}
              />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
