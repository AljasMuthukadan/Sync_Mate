export default function ItemForm({ formData, setFormData, editingItem, addItem, saveEdit }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 max-w-md mx-auto md:mx-0 transition transform hover:shadow-2xl">
      <h3 className="text-xl font-bold text-blue-700 mb-5">
        {editingItem ? "✏️ Edit Item" : "➕ Add New Item"}
      </h3>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        <input
          type="number"
          placeholder="Starting Stock"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        {/* Unit Selector */}
        <select
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          <option value="Nos">Nos</option>
          <option value="Kg">Kg</option>
          <option value="Set">Set</option>
          <option value="Roll">Roll</option>
        </select>

        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          <option value="Finished Goods">Finished Goods</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Work in Progress">Work in Progress</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        <button
          onClick={editingItem ? saveEdit : addItem}
          className="bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition"
        >
          {editingItem ? "💾 Save Changes" : "✅ Add Item"}
        </button>
      </div>
    </div>
  );
}
