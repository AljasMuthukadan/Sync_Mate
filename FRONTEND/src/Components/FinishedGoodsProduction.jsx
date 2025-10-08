import { useState } from "react";
import { motion } from "framer-motion";
import { FaIndustry, FaBox, FaTools } from "react-icons/fa";
import ProductionForm from "../Features/ProductionForm.jsx";
import ProductionHistory from "../Features/ProductionHistory.jsx";

export default function FinishedGoodsProduction({ items, setItems }) {
  const [finishedProduct, setFinishedProduct] = useState("");
  const [productionQty, setProductionQty] = useState(0);
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
      const material = requiredMaterials.find((m) => m.name === i.name);
      if (material) {
        return { ...i, quantity: i.quantity - material.qty * productionQty };
      }
      return i;
    });

    const existingFinished = updatedItems.find(
      (i) => i.name === finishedProduct
    );
    const productImage =
      items.find((i) => i.name === finishedProduct)?.image || null;

    if (existingFinished) {
      existingFinished.quantity += Number(productionQty);
    } else {
      updatedItems.push({
        id: updatedItems.length + 1,
        name: finishedProduct,
        quantity: Number(productionQty),
        category: "Finished Goods",
        image: productImage,
      });
    }

    setItems(updatedItems);

    const usedMaterials = requiredMaterials.map((m) => ({
      name: m.name,
      qty: m.qty * productionQty,
    }));

    setProductionHistory([
      {
        product: finishedProduct,
        qty: productionQty,
        date: new Date().toLocaleString(),
        image: productImage,
        materials: usedMaterials,
      },
      ...productionHistory,
    ]);

    setProductionQty(0);
    setFinishedProduct("");
    alert(`Produced ${productionQty} ${finishedProduct}(s) successfully!`);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
          <FaIndustry className="text-blue-600 text-3xl" />
          Production Management
        </h2>
        <p className="text-gray-500">{new Date().toLocaleDateString()}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-700">
              Total Productions
            </h3>
            <FaIndustry className="text-blue-500 text-3xl" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {productionHistory.length}
          </p>
          <p className="text-gray-500 mt-1">Recorded Production Runs</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-indigo-700">
              Active Products
            </h3>
            <FaBox className="text-indigo-500 text-3xl" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {items.filter((i) => i.category === "Finished Goods").length}
          </p>
          <p className="text-gray-500 mt-1">Finished Goods Available</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-md rounded-2xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-700">
              Bill of Materials
            </h3>
            <FaTools className="text-green-500 text-3xl" />
          </div>
          <p className="text-3xl font-bold text-gray-800">{Object.keys(bom).length}</p>
          <p className="text-gray-500 mt-1">Configured Recipes</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        className="flex flex-col md:flex-row gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Form Section */}
        <div className="md:w-1/2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <ProductionForm
            items={items}
            bom={bom}
            setBOM={setBOM}
            onProduce={produce}
            finishedProduct={finishedProduct}
            setFinishedProduct={setFinishedProduct}
            productionQty={productionQty}
            setProductionQty={setProductionQty}
          />
        </div>

        {/* History Section */}
        <div className="md:w-1/2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <ProductionHistory
            history={productionHistory}
            selectedHistory={selectedHistory}
            setSelectedHistory={setSelectedHistory}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
