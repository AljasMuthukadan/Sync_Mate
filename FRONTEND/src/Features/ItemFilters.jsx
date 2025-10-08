export default function ItemFilters({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  showForm,
  setShowForm,
  resetForm,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex gap-3 flex-wrap w-full md:w-auto">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none w-full md:w-64"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none w-full md:w-64"
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
        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-500 transition font-semibold"
      >
        {showForm ? "✖ Close Form" : "➕ Add Item"}
      </button>
    </div>
  );
}
