import { useState } from "react";

export default function EditBOM({ product, bom, setBOM, items, onClose }) {
  const [editingMaterials, setEditingMaterials] = useState(
    bom[product] ? [...bom[product]] : []
  );
  const [searchIndex, setSearchIndex] = useState(null); // which row is being searched
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // for arrow navigation

  const saveBOM = () => {
    setBOM({ ...bom, [product]: editingMaterials });
    onClose();
  };

  return (
    <div className="bg-gray-50 border border-gray-300 rounded-md p-5 w-full max-w-lg mx-auto mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        Edit BOM - {product}
      </h3>

      {editingMaterials.map((mat, idx) => {
        const suggestions = items
          .filter((i) => i.category === "Raw Materials")
          .filter((i) =>
            i.name.toLowerCase().includes(mat.name.toLowerCase())
          );

        return (
          <div key={idx} className="flex gap-2 mb-2 items-center relative">
            {/* Material Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={mat.name}
                placeholder="Material name"
                onFocus={() => {
                  setSearchIndex(idx);
                  setHighlightedIndex(-1);
                }}
                onChange={(e) => {
                  const newMats = [...editingMaterials];
                  newMats[idx].name = e.target.value;
                  setEditingMaterials(newMats);
                  setSearchIndex(idx);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={(e) => {
                  if (searchIndex !== idx) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                      prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightedIndex((prev) =>
                      prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                  } else if (e.key === "Enter" && highlightedIndex >= 0) {
                    e.preventDefault();
                    const newMats = [...editingMaterials];
                    newMats[idx].name = suggestions[highlightedIndex].name;
                    setEditingMaterials(newMats);
                    setSearchIndex(null);
                  } else if (e.key === "Escape") {
                    setSearchIndex(null);
                  }
                }}
                className="border border-gray-300 rounded px-2 py-1 w-full text-sm outline-none focus:ring-1 focus:ring-blue-300"
              />

              {/* Suggestions Dropdown */}
              {searchIndex === idx && mat.name && suggestions.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-32 overflow-y-auto z-10 text-sm">
                  {suggestions.map((s, sIdx) => (
                    <li
                      key={s.id}
                      onClick={() => {
                        const newMats = [...editingMaterials];
                        newMats[idx].name = s.name;
                        setEditingMaterials(newMats);
                        setSearchIndex(null);
                      }}
                      className={`px-2 py-1 cursor-pointer ${
                        highlightedIndex === sIdx
                          ? "bg-gray-200 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity Input */}
            <input
              type="number"
              value={mat.qty}
              onChange={(e) => {
                const newMats = [...editingMaterials];
                newMats[idx].qty = Number(e.target.value);
                setEditingMaterials(newMats);
              }}
              className="border border-gray-300 rounded px-2 py-1 w-20 text-sm outline-none focus:ring-1 focus:ring-blue-300"
            />

            {/* Delete Button */}
            <button
              onClick={() =>
                setEditingMaterials(editingMaterials.filter((_, i) => i !== idx))
              }
              className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400 text-sm"
            >
              Delete
            </button>
          </div>
        );
      })}

      {/* Add Material */}
      <button
        onClick={() => setEditingMaterials([...editingMaterials, { name: "", qty: 1 }])}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500 mb-3"
      >
        + Add Material
      </button>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={saveBOM}
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-500"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded text-sm hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
