import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaIndustry, FaBox, FaTools, FaTimes, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";

import ProductionForm from "../Features/ProductionForm.jsx";
import BOMManagement from "../Features/BOMManager.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUnitPopup, setShowAddUnitPopup] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitQty, setNewUnitQty] = useState("");

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  const produce = () => {
    if (!finishedProduct || productionQty <= 0) {
      toast.error("Select a finished product and quantity!");
      return;
    }

    const requiredMaterials = bom[finishedProduct];
    if (!requiredMaterials) {
      toast.error("BOM not defined for this product!");
      return;
    }

    const insufficient = requiredMaterials.filter((material) => {
      const item = items.find((i) => i.name === material.name);
      return !item || item.quantity < material.qty * productionQty;
    });

    if (insufficient.length > 0) {
      toast.error(
        "Not enough raw materials: " +
          insufficient.map((i) => i.name).join(", ")
      );
      return;
    }

    setUndoStack([...undoStack, { items: [...items], productionHistory: [...productionHistory] }]);
    setRedoStack([]);

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

    const newEntry = {
      product: finishedProduct,
      qty: productionQty,
      date: formatDate(new Date()),
      materialsUsed: requiredMaterials.map((m) => ({
        name: m.name,
        qty: m.qty * productionQty,
      })),
    };

    setItems(updatedItems);
    setProductionHistory([newEntry, ...productionHistory]);
    setFinishedProduct("");
    setProductionQty(0);
    toast.success("Production completed!");
  };

  const undoProduction = () => {
    const last = undoStack.pop();
    if (last) {
      setRedoStack([...redoStack, { items, productionHistory }]);
      setItems(last.items);
      setProductionHistory(last.productionHistory);
      toast.info("Undo successful");
    }
  };

  const redoProduction = () => {
    const next = redoStack.pop();
    if (next) {
      setUndoStack([...undoStack, { items, productionHistory }]);
      setItems(next.items);
      setProductionHistory(next.productionHistory);
      toast.info("Redo successful");
    }
  };

  const addNewUnit = () => {
    if (!newUnitName || !newUnitQty) {
      toast.error("Enter valid unit name and quantity!");
      return;
    }
    const newItem = {
      id: items.length + 1,
      name: newUnitName,
      quantity: parseInt(newUnitQty),
      category: "Raw Materials",
    };
    setItems([...items, newItem]);
    setNewUnitName("");
    setNewUnitQty("");
    setShowAddUnitPopup(false);
    toast.success("New unit added!");
  };

  const exportCSV = () => {
    let csv = "Product,Quantity,Date,Materials Used\n";
    productionHistory.forEach((h) => {
      const materials = h.materialsUsed.map((m) => `${m.name}:${m.qty}`).join("|");
      csv += `${h.product},${h.qty},${h.date},${materials}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "production_history.csv";
    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Production History", 10, 10);
    productionHistory.forEach((h, i) => {
      doc.text(`${h.product} | Qty: ${h.qty} | Date: ${h.date}`, 10, 20 + i * 10);
    });
    doc.save("production_history.pdf");
  };

  const filteredHistory = productionHistory.filter((h) =>
    h.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topProducts = items
    .filter((i) => i.category === "Finished Goods")
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((i) => ({ name: i.name, quantity: i.quantity }));

  // Total Material Usage Insight
  const totalRaw = items.filter(i => i.category === "Raw Materials").reduce((a,b)=>a+b.quantity,0);
  const totalFinished = items.filter(i => i.category === "Finished Goods").reduce((a,b)=>a+b.quantity,0);

  return (
    <motion.div className="relative space-y-8 p-6 md:p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
          <FaIndustry className="text-blue-600" /> Finished Goods Production
        </h1>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowBOMManagement(!showBOMManagement)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-1"> <FaTools /> Manage BOM </button>
          <button onClick={() => setShowHistoryPanel(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center gap-1"> <FaBox /> View History </button>
          <button onClick={undoProduction} className="bg-gray-400 hover:bg-gray-300 text-white px-4 py-2 rounded-md">Undo</button>
          <button onClick={redoProduction} className="bg-gray-400 hover:bg-gray-300 text-white px-4 py-2 rounded-md">Redo</button>
          <button onClick={exportCSV} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md">Export CSV</button>
          <button onClick={exportPDF} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md">Export PDF</button>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Production Form */}
        <div className="bg-white rounded-xl shadow-md border p-4">
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
        </div>

        {/* New Right-Side Panel */}
        <div className="bg-white rounded-xl shadow-md border p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-blue-700">Raw Material Summary</h3>
            <button onClick={() => setShowAddUnitPopup(true)} className="text-green-600 hover:text-green-800 flex items-center gap-1">
              <FaPlus /> Add Unit
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {items.filter(i=>i.category==="Raw Materials").map((mat)=>(
              <div key={mat.id} className={`flex justify-between py-1 border-b ${mat.quantity < 50 ? "text-red-600" : "text-gray-700"}`}>
                <span>{mat.name}</span>
                <span className="font-medium">{mat.quantity}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900 border border-blue-200">
            <p><strong>Total Raw:</strong> {totalRaw}</p>
            <p><strong>Total Finished:</strong> {totalFinished}</p>
            <p><strong>Efficiency:</strong> {totalRaw === 0 ? "N/A" : ((totalFinished / totalRaw) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-md p-4 mt-4">
        <h3 className="font-semibold text-blue-700 mb-2">Top 5 Finished Products</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={topProducts}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add Unit Popup */}
      {showAddUnitPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative">
            <button className="absolute top-3 right-3 text-gray-600 hover:text-red-500" onClick={()=>setShowAddUnitPopup(false)}>
              <FaTimes />
            </button>
            <h3 className="text-lg font-semibold text-blue-700 mb-3">Add New Material</h3>
            <input
              type="text"
              placeholder="Material Name"
              className="border p-2 w-full rounded mb-2"
              value={newUnitName}
              onChange={(e) => setNewUnitName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Initial Quantity"
              className="border p-2 w-full rounded mb-3"
              value={newUnitQty}
              onChange={(e) => setNewUnitQty(e.target.value)}
            />
            <button onClick={addNewUnit} className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-500">
              Add Material
            </button>
          </div>
        </div>
      )}

      {/* BOM Management */}
      {showBOMManagement && (
        <BOMManagement items={items} bom={bom} setBOM={setBOM} onClose={() => setShowBOMManagement(false)} />
      )}

      {/* History Panel */}
      {showHistoryPanel && (
        <div className="absolute top-0 right-0 w-[90%] md:w-[70%] lg:w-[50%] h-full bg-white shadow-2xl rounded-2xl border p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-blue-700">📜 Production History</h2>
            <button onClick={() => setShowHistoryPanel(false)} className="text-gray-600 hover:text-red-500"><FaTimes size={20} /></button>
          </div>
          <input
            placeholder="Search by product..."
            className="border p-2 w-full mb-2 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredHistory.length === 0 ? (
            <p className="text-gray-500">No production yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredHistory.map((h, i) => (
                <li key={i} className="py-2 cursor-pointer hover:bg-blue-50 rounded p-1" onClick={() => setSelectedHistory(h)}>
                  <div className="flex justify-between">
                    <span className="font-medium">{h.product}</span>
                    <span className="text-gray-700 font-medium">Qty: {h.qty}</span>
                  </div>
                  <span className="text-gray-500 text-xs">{h.date}</span>
                  {selectedHistory === h && (
                    <div className="mt-2 bg-gray-50 p-2 rounded text-sm">
                      <h4 className="font-semibold mb-1">Materials Used:</h4>
                      <ul className="list-disc list-inside">
                        {h.materialsUsed.map((m, j) => (
                          <li key={j}>
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
        </div>
      )}
    </motion.div>
  );
}
