import { useState } from "react";
import ItemFilters from "../Features/ItemFilters.jsx";
import ItemForm from "../Features/ItemForm.jsx";
import ItemCard from "../Features/ItemCard.jsx";

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

  const resetForm = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setShowForm(false);
  };

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

  return (
    <div>
      {/* Filters */}
      <ItemFilters
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        showForm={showForm}
        setShowForm={setShowForm}
        resetForm={resetForm}
      />

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center text-gray-500 p-6">
            No items found
          </div>
        )}
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            startEdit={startEdit}
            deleteItem={deleteItem}
          />
        ))}
      </div>
    </div>
  );
}
