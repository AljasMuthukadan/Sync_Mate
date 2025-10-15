import { useState } from "react";
import { motion } from "framer-motion";
import { FaIndustry, FaBox, FaTools, FaTimes } from "react-icons/fa";

import ProductionForm from "../Features/ProductionForm.jsx";
import BOMManagement from "../Features/BOMManager.jsx";

export default function FinishedGoodsProduction() {
  const [items, setItems] = useState([
    { id: 1, name: "Ice Cream", quantity: 0, category: "Finished Goods" },
    { id: 2, name: "Ice Cream Mix", quantity: 500, category: "Raw Materials" },
    { id: 3, name: "Stick", quantity: 200, category: "Raw Materials" },
    { id: 4, name: "Bottle", quantity: 100, category: "Raw Materials" },
    { id: 5, name: "Chocolate Bar", quantity: 0, category: "Finished Goods" },
    { id: 6, name: "Cocoa Powder", quantity: 200, category: "Raw Materials" },
    { id: 7, name: "Sugar", quantity: 300, category: "Raw Materials" },
    { id: 8, name: "Wrapper", quantity: 100, category: "Raw Materials" },
  ]);

  const [bom, setBOM] = useState({
    "Ice Cream": [
      { name: "Ice Cream Mix", qty: 50 },
      { name: "Stick", qty: 1 },
      { name: "Bottle", qty: 1 },
    ],
    "Chocolate Bar": [
      { name: "Cocoa Powder", qty: 20 },
      { name: "Sugar", qty: 10 },
      { name: "Wrapper", qty: 1 },
    ],
  });

  const [productionHistory, setProductionHistory] = useState([]);
  const [finishedProduct, setFinishedProduct] = useState("");
  const [productionQty, setProductionQty] = useState(0);
  const [showBOMManagement, setShowBOMManagement] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const produce = () => {
    if (!finishedProduct || productionQty <= 0) {
      alert("Select a finished product and quantity!");
      return;
    }

    const requiredMaterials = bom[finishedProduct];
    if (!requiredMaterials) {
      alert("BOM not defined for this product!");
      return;
    }

    const insufficient = requiredMaterials.filter((material) => {
      const item = items.find((i) => i.name === material.name);
      return !item || item.quantity < material.qty * productionQty;
    });

    if (insufficient.length > 0) {
      alert(
        "Not enough raw materials: " +
          insufficient.map((i) => i.name).join(", ")
      );
      return;
    }

    const updatedItems = items.map((i) => {
      const mat = requiredMaterials.find((m) => m.name === i.name);
      if (mat) return { ...i, quantity: i.quantity - mat.qty * productionQty };
      return i;
    });

    const existingFinished = updatedItems.find(
      (i) => i.name === finishedProduct
    );
    if (existingFinished) {
      existingFinished.quantity += productionQty;
    } else {
      updatedItems.push({
        id: updatedItems.length + 1,
        name: finishedProduct,
        quantity: productionQty,
        category: "Finished Goods",
      });
    }

    setItems(updatedItems);
    setProductionHistory([
      {
        product: finishedProduct,
        qty: productionQty,
        date: new Date().toLocaleString(),
        materialsUsed: requiredMaterials.map((m) => ({
          name: m.name,
          qty: m.qty * productionQty,
        })),
      },
      ...productionHistory,
    ]);

    setFinishedProduct("");
    setProductionQty(0);
  };

  return (
    <motion.div
      className="relative space-y-10 p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen font-[Inter]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
          <FaIndustry className="text-blue-600" /> Finished Goods Production
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBOMManagement(!showBOMManagement)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition-all"
          >
            <FaTools /> Manage BOM
          </button>
          <button
            onClick={() => setShowHistoryPanel(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition-all"
          >
            <FaBox /> View History
          </button>
        </div>
      </div>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Total Productions",
            count: productionHistory.length,
            color: "blue",
          },
          {
            title: "Active Products",
            count: items.filter((i) => i.category === "Finished Goods").length,
            color: "indigo",
          },
          {
            title: "Bill of Materials",
            count: Object.keys(bom).length,
            color: "green",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-semibold text-${card.color}-700`}>
                {card.title}
              </h3>
            </div>
            <p className="text-3xl font-bold text-gray-800">{card.count}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {/* Production Form */}
        <motion.div
          className="md:w-1/2 bg-white rounded-xl shadow-md border border-gray-200 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ProductionForm
            items={items}
            bom={bom}
            setBOM={setBOM}
            finishedProduct={finishedProduct}
            setFinishedProduct={setFinishedProduct}
            productionQty={productionQty}
            setProductionQty={setProductionQty}
            onProduce={produce}
          />
        </motion.div>
      </div>

      {/* Side Panel: BOM Management */}
      {showBOMManagement && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-24 right-6 z-40 w-[90%] md:w-[70%] lg:w-[50%]"
        >
          <BOMManagement
            items={items}
            bom={bom}
            setBOM={setBOM}
            onClose={() => setShowBOMManagement(false)}
          />
        </motion.div>
      )}

      {/* Side Panel: Production History */}
      {showHistoryPanel && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 right-0 z-50 w-[90%] md:w-[70%] lg:w-[50%] h-full bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-blue-700 flex-1">
              📜 Production History
            </h2>
            <button
              onClick={() => setShowHistoryPanel(false)}
              className="text-gray-600 hover:text-red-500 transition ml-2"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {productionHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No production yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200 overflow-y-auto flex-1">
              {productionHistory.map((h, idx) => (
                <li
                  key={idx}
                  className="py-2 px-2 cursor-pointer hover:bg-blue-50 rounded transition"
                  onClick={() => setSelectedHistory(h)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">{h.product}</span>
                    <span className="text-gray-700 font-medium">Qty: {h.qty}</span>
                  </div>
                  <span className="text-gray-500 text-xs">{h.date}</span>

                  {/* Inline details when selected */}
                  {selectedHistory === h && (
                    <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                      <h4 className="font-semibold mb-1">Materials Used:</h4>
                      <ul className="list-disc list-inside">
                        {h.materialsUsed.map((m, i) => (
                          <li key={i}>
                            {m.name}: {m.qty}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
