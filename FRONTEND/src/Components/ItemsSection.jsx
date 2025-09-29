import { useState } from "react";

export default function ItemsSection() {
  const [items, setItems] = useState([
    { id: 1, name: "Laptop", quantity: 10, category: "Finished Goods", image: null },
    { id: 2, name: "Keyboard", quantity: 3, category: "Raw Materials", image: null },
    { id: 3, name: "Mouse", quantity: 40, category: "Finished Goods", image: null },
     { id: 4, name: "Ice Cream", quantity: 0, category: "Finished Goods", image: null },
  { id: 5, name: "Ice Cream Mix", quantity: 500, category: "Raw Materials", image: null },
  { id: 6, name: "Stick", quantity: 200, category: "Raw Materials", image: null },
  { id: 7, name: "Bottle", quantity: 100, category: "Raw Materials", image: null },
  ]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const initialForm = { name: "", quantity: "", category: "Finished Goods", image: null };
  const [formData, setFormData] = useState(initialForm);

  // Add new item
  const addItem = () => {
    if (!formData.name || !formData.category) return alert("Enter name and category");

    const newItem = {
      id: items.length + 1,
      name: formData.name,
      quantity: Number(formData.quantity),
      category: formData.category,
      image: formData.image ? URL.createObjectURL(formData.image) : null,
    };
    setItems([...items, newItem]);
    resetForm();
  };

  // Start editing an item
  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item, image: null }); // keep current image until changed
    setShowForm(true);
  };

  // Save edited item
  const saveEdit = () => {
    setItems(
      items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              quantity: Number(formData.quantity),
              category: formData.category,
              image: formData.image ? URL.createObjectURL(formData.image) : item.image,
            }
          : item
      )
    );
    resetForm();
  };

  const deleteItem = (id) => setItems(items.filter((item) => item.id !== id));

  const resetForm = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setShowForm(false);
  };

  const filteredItems = items.filter(
    (item) =>
      (categoryFilter === "All" || item.category === categoryFilter) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg shadow-sm"
          >
            <option value="All">All Categories</option>
            <option value="Finished Goods">Finished Goods</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Work in Progress">Work in Progress</option>
          </select>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500"
        >
          {showForm ? "Close Form" : "Add Item"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
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
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center text-gray-500 p-6">
            No items found
          </div>
        )}
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow rounded-lg p-4 flex flex-col items-center"
          >
            <div className="w-24 h-24 mb-2">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <h4 className="text-lg font-semibold text-blue-700">{item.name}</h4>
            <p className="text-gray-600 mb-1">Category: {item.category}</p>
            <p
              className={`font-semibold ${item.quantity < 5 ? "text-red-600" : "text-gray-800"}`}
            >
              Stock: {item.quantity}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => startEdit(item)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-400"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
