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
      <div className="flex gap-2 mt-2 mb-2">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}>
          {item.category}
        </span>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${stockColors}`}>
          Stock: {item.quantity}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2 w-full">
        <button
          onClick={() => startEdit(item)}
          className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-400 transition"
        >
          Edit
        </button>
        <button
          onClick={() => deleteItem(item.id)}
          className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-500 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
