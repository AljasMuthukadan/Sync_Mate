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
  );
}
