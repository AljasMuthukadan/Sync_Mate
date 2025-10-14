import { FaBoxOpen, FaSortNumericUp, FaTag, FaWeightHanging, FaImage, FaSave, FaPlus } from "react-icons/fa";

export default function ItemForm({ formData, setFormData, editingItem, addItem, saveEdit }) {
  const units = ["Nos", "Kg", "Litre", "Meter"];
  const categories = ["Finished Goods", "Raw Materials", "Work in Progress"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full transition-all duration-300">
      <h3 className="text-2xl font-semibold text-blue-700 mb-5 flex items-center gap-2">
        {editingItem ? <FaSave /> : <FaPlus />}
        {editingItem ? "Edit Item" : "Add New Item"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Item Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
            <FaBoxOpen /> Item Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter item name"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
            <FaSortNumericUp /> Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Unit */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
            <FaWeightHanging /> Unit
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
            <FaTag /> Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div className="mt-5">
        <label className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
          <FaImage /> Upload Image
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${
            formData.image ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="cursor-pointer block">
            {formData.image ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
                <p className="text-sm text-blue-600">Change Image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <FaImage size={30} />
                <p>Click to upload an image</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={editingItem ? saveEdit : addItem}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold shadow-md transition-all ${
            editingItem ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          {editingItem ? <FaSave /> : <FaPlus />}
          {editingItem ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </div>
  );
}
