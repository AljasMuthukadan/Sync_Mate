export default function ItemCard({ item, startEdit, deleteItem }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
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
      <p className={`font-semibold ${item.quantity < 5 ? "text-red-600" : "text-gray-800"}`}>
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
  );
}
