import { useState } from "react";
import ItemForm from "../Features/ItemForm.jsx";

export default function ItemsSection() {
  const [items, setItems] = useState([
    { id: 1, name: "Laptop", quantity: 10, unit: "Nos", category: "Finished Goods", image: null },
    { id: 2, name: "Keyboard", quantity: 3, unit: "Nos", category: "Raw Materials", image: null },
    { id: 3, name: "Mouse", quantity: 40, unit: "Nos", category: "Finished Goods", image: null },
    { id: 4, name: "Ice Cream", quantity: 0, unit: "Kg", category: "Finished Goods", image: null },
    { id: 5, name: "Ice Cream Mix", quantity: 500, unit: "Kg", category: "Raw Materials", image: null },
    { id: 6, name: "Stick", quantity: 200, unit: "Nos", category: "Raw Materials", image: null },
    { id: 7, name: "Bottle", quantity: 100, unit: "Nos", category: "Raw Materials", image: null },
  ]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const initialForm = { name: "", quantity: "", unit: "Nos", category: "Finished Goods", image: null };
  const [formData, setFormData] = useState(initialForm);

  const resetForm = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setShowForm(false);
  };

  const addItem = () => {
    if (!formData.name || !formData.category || !formData.unit) return alert("Enter name, category and unit");

    const newItem = {
      id: items.length + 1,
      name: formData.name,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      category: formData.category,
      image: formData.image ? URL.createObjectURL(formData.image) : null,
    };
    setItems([newItem, ...items]);
    resetForm();
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item, image: null });
    setShowForm(true);
  };

  const saveEdit = () => {
    setItems(
      items.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              name: formData.name,
              quantity: Number(formData.quantity),
              unit: formData.unit,
              category: formData.category,
              image: formData.image ? URL.createObjectURL(formData.image) : item.image,
            }
          : item
      )
    );
    resetForm();
  };

  const deleteItem = (id) => setItems(items.filter((item) => item.id !== id));

  const filteredItems = items.filter(
    (item) =>
      (categoryFilter === "All" || item.category === categoryFilter) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ["All", "Finished Goods", "Raw Materials", "Work in Progress"];

  return (
    <div className="space-y-6">
      {/* Search + Category Pills */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm w-full md:w-64"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = cat === "All" ? items.length : items.filter((i) => i.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1 rounded-full font-semibold flex items-center gap-2 transition ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
                <span className="bg-white text-gray-800 px-2 py-0.5 rounded-full text-sm font-medium shadow">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500"
        >
          {showForm ? "Close Form" : "Add Item"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <ItemForm
          formData={formData}
          setFormData={setFormData}
          editingItem={editingItem}
          addItem={addItem}
          saveEdit={saveEdit}
        />
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center text-gray-500 p-6">No items found</div>
        )}
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="w-28 h-28 mb-3 overflow-hidden rounded">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <h4 className="text-lg font-semibold text-blue-700">{item.name}</h4>

            {/* Badges */}
            <div className="flex gap-2 mt-1 mb-2 flex-wrap justify-center">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.category === "Finished Goods" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}
              >
                {item.category}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.quantity < 5 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {item.quantity} {item.unit}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-2 w-full">
              <button
                onClick={() => startEdit(item)}
                className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-400 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-500 transition"
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
