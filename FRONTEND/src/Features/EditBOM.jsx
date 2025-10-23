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
    setMaterials(materials.filter((_, i) => i !== index));
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
    <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 w-full mt-4 font-[Inter] transition-all">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-5">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaCogs className="text-blue-600 text-xl" />
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Edit BOM
          </span>
          <span className="text-gray-700 font-normal">— {product}</span>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 font-bold text-lg rounded-full hover:bg-red-100 p-1 transition-all"
        >
          ✕
        </button>
      </div>

      {/* Material List */}
      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
        {materials.map((mat, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            {/* Material Name */}
            <select
              value={mat.name}
              onChange={(e) =>
                handleMaterialChange(index, "name", e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/70 transition-all"
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
              placeholder="Quantity"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none bg-white/70 transition-all"
            />

            {/* Delete Button */}
            <button
              onClick={() => handleRemoveMaterial(index)}
              className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg py-2 text-sm font-medium transition-all"
            >
              <FaTrash /> Remove
            </button>
          </div>
        ))}

        {materials.length === 0 && (
          <p className="text-gray-500 text-sm italic text-center py-6">
            No materials added yet.
          </p>
        )}
      </div>

      {/* Add Material */}
      <div className="mt-5 flex justify-start">
        <button
          onClick={handleAddMaterial}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md transition-all"
        >
          <FaPlus /> Add Material
        </button>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-md transition-all"
        >
          <FaSave /> Save BOM
        </button>
      </div>
    </div>
  );
}
