import { useState } from "react";
import EditBOM from "./Features/EditBOM.jsx";

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

  const [editingBOMProduct, setEditingBOMProduct] = useState(null);
  const [productionHistory, setProductionHistory] = useState([]);
  const [search, setSearch] = useState("");

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

    // Deduct raw materials
    const updatedItems = items.map((i) => {
      const material = requiredMaterials.find((m) => m.name === i.name);
      if (material) {
        return { ...i, quantity: i.quantity - material.qty * productionQty };
      }
      return i;
    });

    // Add finished product
    const existingFinished = updatedItems.find((i) => i.name === finishedProduct);
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

    setProductionHistory([
      {
        product: finishedProduct,
        qty: productionQty,
        date: new Date().toLocaleString(),
        image: productImage,
      },
      ...productionHistory,
    ]);

    setProductionQty(0);
    setFinishedProduct("");
    setSearch("");
    alert(`Produced ${productionQty} ${finishedProduct}(s) successfully!`);
  };

  // Filter finished goods by search
  const finishedGoodsOptions = items
    .filter((i) => i.category === "Finished Goods")
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Production Form */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          🎛️ Produce Finished Goods
        </h2>

        {/* Finished Goods Search */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Finished Product</label>
          <input
            type="text"
            placeholder="Search finished product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-2"
          />

          {search && (
            <ul className="border rounded max-h-40 overflow-y-auto bg-white shadow">
              {finishedGoodsOptions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setFinishedProduct(item.name);
                    setSearch("");
                  }}
                  className={`px-2 py-1 cursor-pointer hover:bg-blue-100 ${
                    finishedProduct === item.name ? "bg-blue-200" : ""
                  }`}
                >
                  {item.name}
                </li>
              ))}
              {finishedGoodsOptions.length === 0 && (
                <li className="px-2 py-1 text-gray-500">No results</li>
              )}
            </ul>
          )}

          {finishedProduct && (
            <div className="mt-3 flex justify-between items-center">
              <span className="font-semibold text-blue-700">
                Selected: {finishedProduct}
              </span>
              <button
                onClick={() => setEditingBOMProduct(finishedProduct)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400"
              >
                ⚙️ Edit BOM
              </button>
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Quantity to Produce</label>
          <input
            type="number"
            value={productionQty}
            onChange={(e) => setProductionQty(Number(e.target.value))}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Required Materials */}
        {finishedProduct && bom[finishedProduct] && (
          <div className="mb-4">
            <h3 className="text-blue-700 font-semibold mb-2">
              Required Materials:
            </h3>
            <ul className="list-disc list-inside text-gray-700">
              {bom[finishedProduct].map((m) => (
                <li key={m.name}>
                  {m.name}: {m.qty * productionQty || 0}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={produce}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full"
        >
          Produce
        </button>
      </div>

      {/* Production History */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          📜 Production History
        </h2>
        {productionHistory.length === 0 && (
          <p className="text-gray-500">No production yet.</p>
        )}
        <ul className="divide-y divide-gray-200">
          {productionHistory.map((h, idx) => (
            <li key={idx} className="py-2 flex items-center gap-2">
              {h.image && (
                <img
                  src={h.image}
                  alt={h.product}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <span className="font-semibold">{h.product}</span> - Qty:{" "}
                {h.qty}
                <div className="text-gray-500 text-sm">{h.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit BOM Modal */}
      {editingBOMProduct && (
        <EditBOM
          product={editingBOMProduct}
          bom={bom}
          setBOM={setBOM}
          items={items}
          onClose={() => setEditingBOMProduct(null)}
        />
      )}
    </div>
  );
}
