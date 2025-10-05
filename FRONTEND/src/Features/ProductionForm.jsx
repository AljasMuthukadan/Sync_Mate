import { useState } from "react";
import EditBOM from "./EditBOM.jsx";

export default function ProductionForm({
  items,
  bom,
  setBOM,
  onProduce,
  finishedProduct,
  setFinishedProduct,
  productionQty,
  setProductionQty,
}) {
  const [search, setSearch] = useState("");
  const [editingBOMProduct, setEditingBOMProduct] = useState(null);

  // Filter finished goods by search
  const finishedGoodsOptions = items
    .filter((i) => i.category === "Finished Goods")
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
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
        onClick={onProduce}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full"
      >
        Produce
      </button>

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
