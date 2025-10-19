import { FaEdit, FaTrash } from "react-icons/fa";

export default function ItemCard({ item, startEdit, deleteItem }) {
  const lowStock = item.quantity < 5;
  const categoryColors = {
    "Finished Goods": "bg-blue-100 text-blue-700",
    "Raw Materials": "bg-yellow-100 text-yellow-800",
    "Work in Progress": "bg-purple-100 text-purple-800",
  };

  const stockColors =
    item.quantity === 0
      ? "bg-red-100 text-red-700"
      : lowStock
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden transition transform hover:shadow-xl hover:-translate-y-1 hover:scale-105 flex flex-col items-center p-4">
      {/* Image */}
      <div className="w-28 h-28 mb-3 overflow-hidden rounded-xl">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 rounded-xl">
            No Image
          </div>
        )}
      </div>

      {/* Name */}
      <h4 className="text-lg font-semibold text-blue-700">{item.name}</h4>

      {/* Badges */}
      <div className="flex gap-2 mt-2 mb-3">
        <span
          className={`px-3 py-1 text-sm font-medium rounded-b-sm ${
            categoryColors[item.category] || "bg-gray-100 text-gray-700"
          }`}
        >
          {item.category}
        </span>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-sm ${stockColors}`}
        >
          Stock: {item.quantity}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-auto w-full">
        {/* Edit Button */}
        <button
          onClick={() => startEdit(item)}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <FaEdit className="text-base" />
          <span className="font-medium">Edit</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={() => deleteItem(item.id)}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-red-500 text-red-600 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
        >
          <FaTrash className="text-base" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
