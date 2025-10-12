import { useState, useRef } from "react";
import { FaSave, FaPrint, FaTimes, FaTrash } from "react-icons/fa";

export default function OrderForm({ addNewOrder, onClose }) {
  const ledgerList = ["ABC Traders", "XYZ Enterprises", "LMN Corp","SS Impex","Global Supplies",
    "Crystal Distributions"
  ];
  const itemList = [
    { name: "Product A", rate: 100, unit: "Nos" },
    { name: "Product B", rate: 200, unit: "Kg" },
    { name: "Product C", rate: 150, unit: "Set" },
    { name: "Durofill GL-250 400gm", rate: 840, unit: "Nos" },
    { name: "Durofill Gel 400gm", rate: 860, unit: "Nos" },
    { name: "Durofill GL-250 1500gm", rate: 2525, unit: "Nos" },
    { name: "Durofill Pigment Carbon Black 10gm", rate: 85, unit: "Nos" },
    { name: "Durofill Pigment Porcelain White 40gm", rate: 275, unit: "Nos" },
  ];

  const [ledger, setLedger] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [billNo, setBillNo] = useState(Math.floor(Math.random() * 10000));
  const [items, setItems] = useState([{ name: "", qty: 0, rate: 0, unit: "Nos" }]);

  const inputRefs = useRef([]);

  const subtotal = items.reduce((acc, i) => acc + i.qty * i.rate, 0);
  const tax = subtotal * 0.18;
  const total =  subtotal + tax;
 
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === "qty" || field === "rate" ? Number(value) : value;

    if (field === "name") {
      const item = itemList.find((it) => it.name === value);
      if (item) {
        updated[index].rate = item.rate;
        updated[index].unit = item.unit;
      }
    }

    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { name: "", qty: 0, rate: 0, unit: "Nos" }]);
  };

  const removeRow = (index) => setItems(items.filter((_, i) => i !== index));

  const handlePlaceOrder = () => {
    if (!ledger.trim()) return alert("Please enter a ledger name!");
    const filteredItems = items.filter((i) => i.name);
    if (filteredItems.length === 0) return alert("Please add at least one item!");
    const order = { ledger, date, billNo, items: filteredItems, subtotal, tax, total };
    addNewOrder(order);
    alert("✅ Order placed successfully!");
    resetForm();
    if (onClose) onClose();
  };

  const resetForm = () => {
    setLedger("");
    setBillNo(Math.floor(Math.random() * 10000));
    setItems([{ name: "", qty: 1, rate: 0, unit: "Nos" }]);
    inputRefs.current = [];
  };

  const handleKeyDown = (e, idx, field) => {
    if (e.key !== "Enter") return;

    if (field === "name") {
      inputRefs.current[idx].qty.focus();
    } else if (field === "qty") {
      inputRefs.current[idx].rate.focus();
    } else if (field === "rate") {
      const current = items[idx];
      if (current.name || current.qty || current.rate) {
        addRow();
        setTimeout(() => {
          const newIndex = items.length;
          inputRefs.current[newIndex].name.focus();
        }, 50);
      } else {
        handlePlaceOrder();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-3xl font-bold text-gray-800">🧾 Sales Voucher Entry</h1>
        <div className="flex gap-3">
          <button
            onClick={handlePlaceOrder}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow"
          >
            <FaSave /> Place Order
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow"
          >
            <FaPrint /> Print
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow"
          >
            <FaTimes /> Close
          </button>
        </div>
      </div>

      {/* Voucher Info */}
      <div className="grid grid-cols-3 gap-6 bg-white p-5 rounded-xl shadow border mb-6">
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Ledger Name:</label>
          <input
            list="ledger-list"
            type="text"
            value={ledger}
            onChange={(e) => setLedger(e.target.value)}
            placeholder="Enter party name"
            className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
          />
          <datalist id="ledger-list">
            {ledgerList.map((l, idx) => (
              <option key={idx} value={l} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">Bill No:</label>
          <input
            type="text"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            className="border rounded px-3 py-2 w-full focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white p-5 rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2 text-center w-10">#</th>
              <th className="border px-2 py-2 text-left">Item Name</th>
              <th className="border px-2 py-2 text-center w-24">Qty</th>
              <th className="border px-2 py-2 text-center w-24">Unit</th>
              <th className="border px-2 py-2 text-center w-32">Rate</th>
              <th className="border px-2 py-2 text-center w-32">Amount</th>
              <th className="border px-2 py-2 text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">
                  <input
                    list="item-list"
                    ref={(el) =>
                      (inputRefs.current[idx] = {
                        name: el,
                        qty: inputRefs.current[idx]?.qty,
                        rate: inputRefs.current[idx]?.rate,
                      })
                    }
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx, "name")}
                    className="w-full border-none outline-none"
                    placeholder="Item name"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  <input
                    ref={(el) =>
                      (inputRefs.current[idx] = {
                        ...inputRefs.current[idx],
                        qty: el,
                      })
                    }
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleChange(idx, "qty", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx, "qty")}
                    className="w-16 text-center border rounded px-1"
                  />
                </td>
                <td className="border px-2 py-1 text-center">
                  <select
                    value={item.unit}
                    onChange={(e) => handleChange(idx, "unit", e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Nos">Nos</option>
                    <option value="Kg">Kg</option>
                    <option value="Set">Set</option>
                    <option value="Roll">Roll</option>
                  </select>
                </td>
                <td className="border px-2 py-1 text-center">
                  <input
                    ref={(el) =>
                      (inputRefs.current[idx] = {
                        ...inputRefs.current[idx],
                        rate: el,
                      })
                    }
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) => handleChange(idx, "rate", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, idx, "rate")}
                    className="w-24 text-center border rounded px-1"
                  />
                </td>
                <td className="border px-2 py-1 text-right pr-3">
                  {(item.qty * item.rate).toFixed(2)}
                </td>
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => removeRow(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-6">
        <div className="bg-white rounded-xl shadow border p-5 w-80 space-y-2 text-right text-gray-800">
          <p>
            Subtotal: <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
          </p>
          <p>
            Tax (18%): <span className="font-semibold">₹{tax.toFixed(2)}</span>
          </p>
          <p className="text-lg font-bold">
            Total: <span className="text-blue-700">₹{total.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Datalist */}
      <datalist id="item-list">
        {itemList.map((i, idx) => (
          <option key={idx} value={i.name} />
        ))}
      </datalist>
    </div>
  );
}

