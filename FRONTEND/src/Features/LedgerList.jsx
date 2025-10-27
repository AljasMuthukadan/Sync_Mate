export default function LedgerList({ ledgers }) {
  return (
    <div className="overflow-x-auto bg-gray-50 rounded-2xl shadow-inner p-2 border border-gray-200">
      <table className="min-w-full border-collapse font-sans text-sm">
        <thead className="bg-gray-100 text-gray-700 font-semibold sticky top-0 z-10">
          <tr>
            <th className="p-3 text-left border-b border-gray-300">Ledger Name</th>
            <th className="p-3 text-left border-b border-gray-300">GSTIN</th>
            <th className="p-3 text-left border-b border-gray-300">Pincode</th>
            <th className="p-3 text-left border-b border-gray-300">Phone</th>
            <th className="p-3 text-left border-b border-gray-300">Category</th>
          </tr>
        </thead>
        <tbody>
          {ledgers.map((l, idx) => (
            <tr
              key={idx}
              className={`transition-colors ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-100 cursor-pointer`}
            >
              <td className="p-3 border-b border-gray-200">{l.name}</td>
              <td className="p-3 border-b border-gray-200">{l.gstin}</td>
              <td className="p-3 border-b border-gray-200">{l.pincode}</td>
              <td className="p-3 border-b border-gray-200">{l.phone}</td>
              <td className="p-3 border-b border-gray-200">{l.category}</td>
            </tr>
          ))}
          {ledgers.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="text-center py-6 text-gray-400 font-medium"
              >
                No ledgers available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
