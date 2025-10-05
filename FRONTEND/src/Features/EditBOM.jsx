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
    <div className="bg-gray-50 shadow rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-3 text-blue-700">
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
            {/* Raw material search with autocomplete */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={mat.name}
                placeholder="Search material..."
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
                className="border px-2 py-1 rounded w-full"
              />

              {/* Suggestion Dropdown */}
              {searchIndex === idx && mat.name && suggestions.length > 0 && (
                <ul className="absolute bg-white border rounded w-full max-h-32 overflow-y-auto z-10">
                  {suggestions.map((suggestion, sIdx) => (
                    <li
                      key={suggestion.id}
                      onClick={() => {
                        const newMats = [...editingMaterials];
                        newMats[idx].name = suggestion.name;
                        setEditingMaterials(newMats);
                        setSearchIndex(null);
                      }}
                      className={`px-2 py-1 cursor-pointer ${
                        highlightedIndex === sIdx
                          ? "bg-blue-200"
                          : "hover:bg-blue-100"
                      }`}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity */}
            <input
              type="number"
              value={mat.qty}
              onChange={(e) => {
                const newMats = [...editingMaterials];
                newMats[idx].qty = Number(e.target.value);
                setEditingMaterials(newMats);
              }}
              className="border px-2 py-1 rounded w-24"
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
        );
      })}

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
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
