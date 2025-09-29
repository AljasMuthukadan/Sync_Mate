// FinishedGoodsProduction.jsx
import { useState } from "react";

export default function FinishedGoodsProduction({ items, setItems }) {
  const [finishedProduct, setFinishedProduct] = useState("");
  const [productionQty, setProductionQty] = useState(0);

  // BOM state
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
  const [editingMaterials, setEditingMaterials] = useState([]);
  const [productionHistory, setProductionHistory] = useState([]);

  const [search, setSearch] = useState("");

  const startEditBOM = (productName) => {
    setEditingBOMProduct(productName);
    setEditingMaterials(bom[productName] ? [...bom[productName]] : []);
  };

  const saveBOM = () => {
    setBOM({ ...bom, [editingBOMProduct]: editingMaterials });
    setEditingBOMProduct(null);
    setEditingMaterials([]);
  };

  const cancelEditBOM = () => {
    setEditingBOMProduct(null);
    setEditingMaterials([]);
  };

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
    const productImage = items.find((i) => i.name === finishedProduct)?.image || null;

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

  // Filter finished goods for search
  const finishedGoodsOptions = items
    .filter((i) => i.category === "Finished Goods")
    .filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Production Form */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          🎛️ Produce Finished Goods
        </h2>

        {/* Searchable Finished Goods */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Finished Product</label>
          <input
            type="text"
            placeholder="Search finished product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-2"
          />
          <select
            value={finishedProduct}
            onChange={(e) => setFinishedProduct(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select Product</option>
            {finishedGoodsOptions.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
          {finishedProduct && (
            <button
              onClick={() => startEditBOM(finishedProduct)}
              className="mt-2 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-400 w-full"
            >
              ⚙️ Edit BOM
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Quantity to Produce</label>
          <input
            type="number"
            value={productionQty}
            onChange={(e) => setProductionQty(Number(e.target.value))}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {finishedProduct && bom[finishedProduct] && (
          <div className="mb-4">
            <h3 className="text-blue-700 font-semibold mb-2">Required Materials:</h3>
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

        {/* Edit BOM */}
        {editingBOMProduct && (
          <div className="bg-gray-50 shadow rounded-lg p-4 mt-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">
              Edit BOM - {editingBOMProduct}
            </h3>
            {editingMaterials.map((mat, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={mat.name}
                  onChange={(e) => {
                    const newMats = [...editingMaterials];
                    newMats[idx].name = e.target.value;
                    setEditingMaterials(newMats);
                  }}
                  className="border px-2 py-1 rounded w-1/2"
                />
                <input
                  type="number"
                  value={mat.qty}
                  onChange={(e) => {
                    const newMats = [...editingMaterials];
                    newMats[idx].qty = Number(e.target.value);
                    setEditingMaterials(newMats);
                  }}
                  className="border px-2 py-1 rounded w-1/4"
                />
                <button
                  onClick={() =>
                    setEditingMaterials(editingMaterials.filter((_, i) => i !== idx))
                  }
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setEditingMaterials([...editingMaterials, { name: "", qty: 1 }])
              }
              className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
            >
              + Add Material
            </button>

            <div className="flex gap-2">
              <button
                onClick={saveBOM}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save BOM
              </button>
              <button
                onClick={cancelEditBOM}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Production History */}
      <div className="bg-white shadow-md rounded-lg p-6 flex-1">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">📜 Production History</h2>
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
                <span className="font-semibold">{h.product}</span> - Qty: {h.qty}
                <div className="text-gray-500 text-sm">{h.date}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

