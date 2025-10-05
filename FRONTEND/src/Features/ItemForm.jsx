export default function ItemForm({ formData, setFormData, editingItem, addItem, saveEdit }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 max-w-md">
      <h3 className="text-lg font-semibold text-blue-700 mb-3">
        {editingItem ? "Edit Item" : "Add New Item"}
      </h3>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Item Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Starting Stock"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="Finished Goods">Finished Goods</option>
          <option value="Raw Materials">Raw Materials</option>
          <option value="Work in Progress">Work in Progress</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={editingItem ? saveEdit : addItem}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
        >
          {editingItem ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </div>
  );
}
