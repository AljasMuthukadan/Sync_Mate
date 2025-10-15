import { useState } from "react";
import EditBOM from "./EditBOM.jsx";

export default function ProductionForm({
  items,
  bom,
  setBOM,
  finishedProduct,
  setFinishedProduct,
  productionQty,
  setProductionQty,
  onProduce,
}) {
  const [search, setSearch] = useState("");
  const [editingBOMProduct, setEditingBOMProduct] = useState(null);

  const finishedGoodsOptions = items
    .filter((i) => i.category === "Finished Goods")
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full relative">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">
        Production Entry
      </h2>

      {/* Finished Product */}
      <div className="mb-6 relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Finished Product
        </label>
        <input
          type="text"
          placeholder="Search finished product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 px-3 py-2 rounded w-full text-sm outline-none"
        />

        {search && (
          <ul className="border border-gray-300 rounded mt-1 max-h-44 overflow-y-auto bg-white text-sm absolute w-full z-20 shadow-lg">
            {finishedGoodsOptions.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setFinishedProduct(item.name);
                  setSearch("");
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-blue-50 ${
                  finishedProduct === item.name ? "bg-blue-100 font-medium" : ""
                }`}
              >
                {item.name}
              </li>
            ))}
            {finishedGoodsOptions.length === 0 && (
              <li className="px-3 py-2 text-gray-500 italic">No results found</li>
            )}
          </ul>
        )}

        {finishedProduct && (
          <div className="mt-3 flex justify-between items-center border border-gray-200 bg-gray-50 rounded px-3 py-2">
            <span className="font-semibold text-gray-800">
              Selected: {finishedProduct}
            </span>
            <button
              onClick={() => setEditingBOMProduct(finishedProduct)}
              className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded hover:bg-blue-200"
            >
              Edit BOM
            </button>
          </div>
        )}
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Quantity to Produce
        </label>
        <input
          type="number"
          value={productionQty}
          onChange={(e) => setProductionQty(Number(e.target.value))}
          className="border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 px-3 py-2 rounded w-full text-sm outline-none"
        />
      </div>

      {/* Required Materials */}
      {finishedProduct && bom[finishedProduct] && (
        <div className="mb-6 border border-gray-200 bg-gray-50 rounded p-4">
          <h3 className="text-gray-800 font-semibold mb-3 text-sm">
            Required Materials
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-blue-50 text-gray-700">
                <th className="text-left py-2 px-2">Material</th>
                <th className="text-right py-2 px-2">Required Qty</th>
                <th className="text-right py-2 px-2">Available</th>
              </tr>
            </thead>
            <tbody>
              {bom[finishedProduct].map((m) => {
                const item = items.find((i) => i.name === m.name);
                const available = item ? item.quantity : 0;
                const insufficient = available < m.qty * productionQty;
                return (
                  <tr key={m.name} className="border-b last:border-none">
                    <td className="py-2 px-2">{m.name}</td>
                    <td
                      className={`py-2 px-2 text-right ${
                        insufficient ? "text-red-600 font-semibold" : ""
                      }`}
                    >
                      {m.qty * productionQty || 0}
                    </td>
                    <td
                      className={`py-2 px-2 text-right ${
                        insufficient
                          ? "text-red-600 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {available}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {bom[finishedProduct].some(
            (m) =>
              (items.find((i) => i.name === m.name)?.quantity || 0) <
              m.qty * productionQty
          ) && (
            <p className="text-red-600 text-xs mt-2 font-medium">
              ⚠️ Insufficient materials for production
            </p>
          )}
        </div>
      )}

      {/* Produce Button */}
      <div>
        <button
          onClick={onProduce}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded w-full transition shadow"
        >
          Produce
        </button>
      </div>

      {/* Edit BOM Popup */}
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
