import { useState } from "react";

export default function OrderModal({ order, closeModal, deleteOrder, restockOrder }) {
  const [itemsState, setItemsState] = useState(order.items);
  const [newItem, setNewItem] = useState({ name: "", qty: 1, rate: 0, unit: "Nos" });

  const handleQtyChange = (index, value) => {
    const updated = [...itemsState];
    updated[index].qty = Number(value);
    setItemsState(updated);
  };

  const handleUnitChange = (index, value) => {
    const updated = [...itemsState];
    updated[index].unit = value;
    setItemsState(updated);
  };

  const removeItem = (index) => setItemsState(itemsState.filter((_, i) => i !== index));

  const addItem = () => {
    if (!newItem.name) return alert("Enter item name");
    setItemsState([...itemsState, { ...newItem, qty: Number(newItem.qty), rate: Number(newItem.rate) }]);
    setNewItem({ name: "", qty: 1, rate: 0, unit: "Nos" });
  };

  const exportCSV = () => {
    const headers = ["Item", "Qty", "Unit", "Rate", "Amount"];
    const rows = itemsState.map((i) => [i.name, i.qty, i.unit, i.rate, i.qty * i.rate]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${order.ledger}_order.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const subtotal = itemsState.reduce((acc, i) => acc + i.qty * i.rate, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:p-0">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 print:max-w-full print:shadow-none print:p-0">
        <div className="flex justify-between items-center mb-6 flex-wrap print:flex-col print:items-start">
          <div>
            <h1 className="text-3xl font-bold print:text-2xl">🏢 My Company</h1>
            <p className="text-gray-700 print:text-black">
              Invoice for: <span className="font-semibold">{order.ledger}</span>
            </p>
            <p className="text-gray-700 print:text-black">Date: {order.date}</p>
            <p className="text-gray-700 print:text-black">Invoice No: {order.invoiceNo}</p>
          </div>
          <div className="flex gap-2 mt-2 print:mt-4">
            <button onClick={() => window.print()} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400 print:hidden">🖨️ Print</button>
            <button onClick={exportCSV} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400 print:hidden">📥 Export CSV</button>
            <button onClick={() => { deleteOrder(order); closeModal(); }} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 print:hidden">🗑️ Delete Order</button>
          </div>
        </div>

        <table className="w-full border border-black border-collapse text-sm print:text-base">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-200">
              <th className="border px-3 py-2 text-left">#</th>
              <th className="border px-3 py-2 text-left">Item</th>
              <th className="border px-3 py-2 text-center">Qty</th>
              <th className="border px-3 py-2 text-center">Unit</th>
              <th className="border px-3 py-2 text-center">Rate</th>
              <th className="border px-3 py-2 text-center">Amount</th>
              <th className="border px-3 py-2 text-center print:hidden">Action</th>
            </tr>
          </thead>
          <tbody>
            {itemsState.map((i, idx) => (
              <tr key={idx} className="hover:bg-gray-50 print:hover:bg-white">
                <td className="border px-3 py-1">{idx + 1}</td>
                <td className="border px-3 py-1">{i.name}</td>
                <td className="border px-3 py-1 text-center">
                  <input type="number" value={i.qty} min="1" onChange={(e) => handleQtyChange(idx, e.target.value)} className="w-16 text-center border rounded print:border-none print:w-12 print:text-center appearance-none" />
                </td>
                <td className="border px-3 py-1 text-center">
                  <select value={i.unit} onChange={(e) => handleUnitChange(idx, e.target.value)} className="border rounded px-1 py-0.5">
                    <option value="Nos">Nos</option>
                    <option value="Kg">Kg</option>
                    <option value="Set">Set</option>
                    <option value="Roll">Roll</option>
                  </select>
                </td>
                <td className="border px-3 py-1 text-center">{i.rate}</td>
                <td className="border px-3 py-1 text-center">{i.qty * i.rate}</td>
                <td className="border px-3 py-1 text-center print:hidden">
                  <button onClick={() => removeItem(idx)} className="bg-red-500 text-white px-2 py-1 rounded">❌</button>
                </td>
              </tr>
            ))}
            <tr className="print:hidden">
              <td className="border px-3 py-1 text-center">+</td>
              <td className="border px-3 py-1">
                <input type="text" placeholder="Item name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="border px-2 py-1 w-full rounded" />
              </td>
              <td className="border px-3 py-1 text-center">
                <input type="number" value={newItem.qty} min="1" onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })} className="w-16 text-center border rounded" />
              </td>
              <td className="border px-3 py-1 text-center">
                <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} className="border rounded px-1 py-0.5">
                  <option value="Nos">Nos</option>
                  <option value="Kg">Kg</option>
                  <option value="Set">Set</option>
                  <option value="Roll">Roll</option>
                </select>
              </td>
              <td className="border px-3 py-1 text-center">
                <input type="number" value={newItem.rate} min="0" onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })} className="w-20 text-center border rounded" />
              </td>
              <td className="border px-3 py-1 text-center">
                <button onClick={addItem} className="bg-green-500 text-white px-2 py-1 rounded">➕</button>
              </td>
              <td className="border px-3 py-1 text-center print:hidden"></td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-right text-gray-700 print:text-black">
          <p>Subtotal: {subtotal}</p>
        </div>

        <div className="mt-4 flex justify-end gap-2 print:hidden">
          <button onClick={closeModal} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-400">Close</button>
        </div>
      </div>
    </div>
  );
}
