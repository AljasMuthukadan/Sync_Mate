import { useState } from "react";
import { FaSearch, FaPlus, FaTimes } from "react-icons/fa";
import ItemForm from "../Features/ItemForm.jsx";
import ItemCard from "../Features/ItemCard.jsx";

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
    <div className="space-y-8">
      {/* 🔍 Top Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const count = cat === "All" ? items.length : items.filter((i) => i.category === cat).length;
            const selected = categoryFilter === cat;

            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-all transform active:scale-95 ${
                  selected
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    selected ? "bg-white text-blue-600" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {count}
                </span>
                {selected && (
                  <span className="absolute -inset-0.5 bg-blue-500 opacity-20 blur-lg rounded-full animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add Item Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 active:scale-95 transition-all"
        >
          {showForm ? <FaTimes /> : <FaPlus />}
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

      {/* 🧱 Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 p-6 bg-gray-50 rounded-lg">
            No items found
          </div>
        ) : (
          filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} startEdit={startEdit} deleteItem={deleteItem} />
          ))
        )}
      </div>
    </div>
  );
}

