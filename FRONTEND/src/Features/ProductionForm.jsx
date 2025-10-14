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
    <div className="bg-gray-50 border border-gray-300 rounded-md p-6 flex-1">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Production Entry
      </h2>

      {/* Finished Product Section */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Finished Product
        </label>
        <input
          type="text"
          placeholder="Search finished product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 px-3 py-2 rounded w-full text-sm outline-none"
        />

        {search && (
          <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-y-auto bg-white text-sm">
            {finishedGoodsOptions.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setFinishedProduct(item.name);
                  setSearch("");
                }}
                className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                  finishedProduct === item.name ? "bg-gray-200 font-medium" : ""
                }`}
              >
                {item.name}
              </li>
            ))}
            {finishedGoodsOptions.length === 0 && (
              <li className="px-3 py-1 text-gray-500 italic">No results found</li>
            )}
          </ul>
        )}

        {finishedProduct && (
          <div className="mt-3 flex justify-between items-center border border-gray-200 bg-white rounded px-3 py-2">
            <span className="font-medium text-gray-800">
              Selected: {finishedProduct}
            </span>
            <button
              onClick={() => setEditingBOMProduct(finishedProduct)}
              className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-300"
            >
              Edit BOM
            </button>
          </div>
        )}
      </div>

      {/* Quantity Section */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity to Produce
        </label>
        <input
          type="number"
          value={productionQty}
          onChange={(e) => setProductionQty(Number(e.target.value))}
          className="border border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 px-3 py-2 rounded w-full text-sm outline-none"
        />
      </div>

      {/* Required Materials Section */}
      {finishedProduct && bom[finishedProduct] && (
        <div className="mb-5 border border-gray-200 bg-white rounded p-3">
          <h3 className="text-gray-800 font-medium mb-2 text-sm">
            Required Materials
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="text-left py-1 px-2">Material</th>
                <th className="text-right py-1 px-2">Required Qty</th>
              </tr>
            </thead>
            <tbody>
              {bom[finishedProduct].map((m) => (
                <tr key={m.name} className="border-b last:border-none">
                  <td className="py-1 px-2">{m.name}</td>
                  <td className="py-1 px-2 text-right">
                    {m.qty * productionQty || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Produce Button */}
      <div className="pt-2 border-t">
        <button
          onClick={onProduce}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded w-full transition"
        >
          Produce
        </button>
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
