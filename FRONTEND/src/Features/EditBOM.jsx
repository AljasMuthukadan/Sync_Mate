 import { useState } from "react";
import { FaSave, FaPlus, FaTrash, FaCogs } from "react-icons/fa";

export default function EditBOM({ product, bom, setBOM, items, onClose }) {
  const rawMaterials = items.filter((i) => i.category === "Raw Materials");
  const existingBOM = bom[product] || [];

  const [materials, setMaterials] = useState([...existingBOM]);

  const handleMaterialChange = (index, field, value) => {
    const updated = [...materials];
    updated[index][field] = value;
    setMaterials(updated);
  };

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: "", qty: 0 }]);
  };

  const handleRemoveMaterial = (index) => {
    const updated = materials.filter((_, i) => i !== index);
    setMaterials(updated);
  };

  const handleSave = () => {
    const filtered = materials.filter(
      (m) => m.name.trim() !== "" && m.qty > 0
    );
    if (filtered.length === 0) {
      alert("Please add at least one valid material!");
      return;
    }
    setBOM({ ...bom, [product]: filtered });
    onClose();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 w-full mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
          <FaCogs /> Edit BOM – <span className="text-gray-800">{product}</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 font-bold text-lg"
        >
          ✕
        </button>
      </div>

      {/* Materials Table */}
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
        {materials.map((mat, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200"
          >
            {/* Material Name */}
            <select
              value={mat.name}
              onChange={(e) =>
                handleMaterialChange(index, "name", e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
              <option value="">Select Material</option>
              {rawMaterials.map((rm) => (
                <option key={rm.id} value={rm.name}>
                  {rm.name}
                </option>
              ))}
            </select>

            {/* Quantity */}
            <input
              type="number"
              value={mat.qty}
              onChange={(e) =>
                handleMaterialChange(index, "qty", Number(e.target.value))
              }
              placeholder="Qty"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />

            {/* Delete Button */}
            <button
              onClick={() => handleRemoveMaterial(index)}
              className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg py-2 transition"
            >
              <FaTrash /> Remove
            </button>
          </div>
        ))}

        {materials.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center">
            No materials added yet.
          </p>
        )}
      </div>

      {/* Add Button */}
      <div className="mt-5">
        <button
          onClick={handleAddMaterial}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition"
        >
          <FaPlus /> Add Material
        </button>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          <FaSave /> Save BOM
        </button>
      </div>
    </div>
  );
}
