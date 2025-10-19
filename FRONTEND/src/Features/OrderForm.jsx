import { useState, useRef } from "react";
import { FaTrash } from "react-icons/fa";

export default function OrderForm({ addNewOrder, onClose }) {
  // Ledger list (you can later add address & GSTIN separately if needed)
  const ledgerList = [
    { name: "SS Impex", address: "123 MG Road, Chennai", gstin: "33AABCS1234F1ZV" },
    { name: "Crystal Distributions", address: "45 Hill View, Coimbatore", gstin: "33AACCC2345G1ZR" },
    { name: "KP Agencies", address: "78 Market Street, Madurai", gstin: "33AAACK3456L1ZS" },
    { name: "Kallis Floorings", address: "22 Anna Nagar, Trichy", gstin: "33AADCK6789H1ZW" },
    { name: "Sea Rock", address: "99 Beach Road, Tuticorin", gstin: "33AACSR9876M1ZP" },
  ];

  // 🆕 Added `stock` info for each item
  const itemList = [
    { name: "Durofill GL-250 400gm", rate: 840, unit: "Nos", stock: "50 Nos" },
    { name: "Durofill Gel 400gm", rate: 860, unit: "Nos", stock: "35 Nos" },
    { name: "Durofill GL-250 1500gm", rate: 2525, unit: "Nos", stock: "12 Nos" },
    { name: "Durofill Pigment Carbon Black 10gm", rate: 85, unit: "Nos", stock: "56 Nos" },
    { name: "Durofill Pigment Porcelain White 40gm", rate: 275, unit: "Nos", stock: "180 Nos" },
  ];

  const [ledger, setLedger] = useState("");
  const [ledgerAddress, setLedgerAddress] = useState("");
  const [ledgerGSTIN, setLedgerGSTIN] = useState("");
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerDropdown, setLedgerDropdown] = useState(false);
  const [ledgerActiveIndex, setLedgerActiveIndex] = useState(0);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [billNo, setBillNo] = useState(Math.floor(Math.random() * 10000));

  const [items, setItems] = useState([{ name: "", qty: 0, rate: 0, unit: "Nos" }]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeItemIndex, setActiveItemIndex] = useState(null);
  const [itemDropdownIndex, setItemDropdownIndex] = useState(null);
  const [discount, setDiscount] = useState(0);

  const inputRefs = useRef({ ledger: null, items: [], discount: null });

  // --- Calculations ---
  const subtotal = items.reduce((acc, i) => acc + i.qty * i.rate, 0);
  const tax = subtotal * 0.18;
  const beforeDiscount = subtotal + tax;
  const afterDiscount = beforeDiscount - discount;
  const roundOff = Math.round(afterDiscount) - afterDiscount;
  const total = afterDiscount + roundOff;

  // --- Filters ---
  const filteredLedger = ledgerList.filter((l) =>
    l.name.toLowerCase().includes(ledgerSearch.toLowerCase())
  );
  const filteredItems = itemList.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Ledger Selection ---
  const selectLedger = (name) => {
    const selected = ledgerList.find((l) => l.name === name);
    if (selected) {
      setLedger(selected.name);
      setLedgerAddress(selected.address);
      setLedgerGSTIN(selected.gstin);
    }
    setLedgerSearch("");
    setLedgerDropdown(false);
    inputRefs.current.items[0]?.name?.focus();
  };

  // --- Item Editing ---
  const handleItemChange = (index, field, value) => {
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
    setItems((prev) => {
      const newItems = [...prev, { name: "", qty: 0, rate: 0, unit: "Nos" }];
      setTimeout(() => {
        const newIndex = newItems.length - 1;
        inputRefs.current.items[newIndex]?.name?.focus();
      }, 50);
      return newItems;
    });
  };

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handlePlaceOrder = () => {
    if (!ledger.trim()) return alert("Please select a ledger!");
    const filledItems = items.filter((i) => i.name);
    if (filledItems.length === 0) return alert("Please add at least one item!");

    const order = {
      ledger,
      ledgerAddress,
      ledgerGSTIN,
      date,
      billNo,
      items: filledItems,
      subtotal,
      tax,
      discount,
      roundOff,
      total,
    };

    addNewOrder(order);
    alert("✅ Order placed successfully!");

    const wantPrint = window.confirm("🖨️ Do you want to print this invoice?");
    if (wantPrint) window.print();

    resetForm();
    onClose && onClose();
  };

  const resetForm = () => {
    setLedger("");
    setLedgerAddress("");
    setLedgerGSTIN("");
    setDiscount(0);
    setBillNo(Math.floor(Math.random() * 10000));
    setItems([{ name: "", qty: 0, rate: 0, unit: "Nos" }]);
    inputRefs.current.items = [];
  };

  // --- Keyboard Navigation ---
  const handleLedgerKeyDown = (e) => {
    if (!ledgerDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setLedgerActiveIndex((prev) => (prev + 1) % filteredLedger.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setLedgerActiveIndex((prev) => (prev - 1 + filteredLedger.length) % filteredLedger.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredLedger[ledgerActiveIndex]) {
        selectLedger(filteredLedger[ledgerActiveIndex].name);
      }
    } else if (e.key === "Escape") {
      setLedgerDropdown(false);
    }
  };

  const handleItemKeyDown = (e, idx, field) => {
    if (field === "name") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setItemDropdownIndex((prev) =>
          prev === null ? 0 : (prev + 1) % filteredItems.length
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setItemDropdownIndex((prev) =>
          prev === null ? filteredItems.length - 1 : (prev - 1 + filteredItems.length) % filteredItems.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (itemDropdownIndex !== null && filteredItems[itemDropdownIndex]) {
          handleItemChange(idx, "name", filteredItems[itemDropdownIndex].name);
        }
        setSearchTerm("");
        setActiveItemIndex(null);
        setItemDropdownIndex(null);
        inputRefs.current.items[idx].qty.focus();
      }
    } else if (field === "qty") {
      if (e.key === "Enter") inputRefs.current.items[idx].rate.focus();
    } else if (field === "rate") {
      if (e.key === "Enter") {
        const current = items[idx];
        if (current.name || current.qty || current.rate) {
          addRow();
        } else {
          inputRefs.current.discount.focus();
        }
      }
    }
  };

  const handleDiscountKeyDown = (e) => {
    if (e.key === "Enter") handlePlaceOrder();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-400 pb-2">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-wide">Sales Voucher Entry</h1>
      </div>

      {/* Ledger Section */}
      <div className="grid grid-cols-3 gap-4 bg-white border border-gray-300 p-3 mb-4 text-sm">
        <div className="relative">
          <label className="font-medium text-gray-700">Ledger:</label>
          <input
            type="text"
            value={ledgerSearch || ledger}
            onFocus={() => setLedgerDropdown(true)}
            onChange={(e) => {
              setLedger(e.target.value);
              setLedgerSearch(e.target.value);
              setLedgerDropdown(true);
            }}
            onKeyDown={handleLedgerKeyDown}
            ref={(el) => (inputRefs.current.ledger = el)}
            className="border border-gray-400 px-2 py-1 w-full focus:outline-blue-500"
            placeholder="Select ledger..."
          />
          {ledgerDropdown && (ledgerSearch || !ledger) && (
            <div className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto">
              {filteredLedger.length > 0 ? (
                filteredLedger.map((l, i) => (
                  <div
                    key={i}
                    onClick={() => selectLedger(l.name)}
                    className={`px-2 py-1 cursor-pointer ${
                      i === ledgerActiveIndex ? "bg-yellow-100" : "hover:bg-gray-100"
                    }`}
                  >
                    {l.name}
                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-gray-400">No results</div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="font-medium text-gray-700">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-400 px-2 py-1 w-full focus:outline-blue-500"
          />
        </div>

        <div>
          <label className="font-medium text-gray-700">Bill No:</label>
          <input
            type="text"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            className="border border-gray-400 px-2 py-1 w-full focus:outline-blue-500"
          />
        </div>
      </div>

      {/* Show address and GSTIN */}
      {ledger && ledgerAddress && (
        <div className="bg-white border border-gray-300 p-3 mb-4 text-sm">
          <p><span className="font-medium">Address:</span> {ledgerAddress}</p>
          <p><span className="font-medium">GSTIN:</span> {ledgerGSTIN}</p>
        </div>
      )}

      {/* --- ITEMS TABLE --- */}
      <div className="bg-white border border-gray-300">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-200 border-b border-gray-300">
            <tr>
              <th className="border px-2 py-1 text-center w-8">#</th>
              <th className="border px-2 py-1 text-left">Item Name</th>
              <th className="border px-2 py-1 w-20 text-center">Qty</th>
              <th className="border px-2 py-1 w-20 text-center">Unit</th>
              <th className="border px-2 py-1 w-24 text-center">Rate</th>
              <th className="border px-2 py-1 w-24 text-right">Amount</th>
              <th className="border px-2 py-1 w-10 text-center">X</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 relative">
                <td className="border text-center px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1 relative">
                  <input
                    type="text"
                    value={item.name}
                    onFocus={() => setActiveItemIndex(idx)}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      handleItemChange(idx, "name", e.target.value);
                      setItemDropdownIndex(null);
                    }}
                    onKeyDown={(e) => handleItemKeyDown(e, idx, "name")}
                    className="w-full border-none outline-none"
                    placeholder="Search item..."
                    ref={(el) =>
                      (inputRefs.current.items[idx] = {
                        ...inputRefs.current.items[idx],
                        name: el,
                      })
                    }
                  />
                  {activeItemIndex === idx && searchTerm && (
                    <div className="absolute bg-white border border-gray-300 w-full z-10 mt-1 max-h-40 overflow-y-auto">
                      {filteredItems.length > 0 ? (
                        filteredItems.map((it, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              handleItemChange(idx, "name", it.name);
                              setSearchTerm("");
                              setActiveItemIndex(null);
                              inputRefs.current.items[idx].qty.focus();
                            }}
                            className={`px-2 py-1 cursor-pointer flex justify-between ${
                              i === itemDropdownIndex ? "bg-yellow-100" : "hover:bg-gray-100"
                            }`}
                          >
                            <span>{it.name}</span>
                            {/* 🆕 Stock info shown here */}
                            <span className="text-gray-500 text-xs">{it.stock}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-gray-400">No items</div>
                      )}
                    </div>
                  )}
                </td>
                <td className="border text-center">
                  <input
                    type="number"
                    min="0"
                    value={item.qty}
                    onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                    onKeyDown={(e) => handleItemKeyDown(e, idx, "qty")}
                    className="w-16 text-center border border-gray-400 px-1"
                    ref={(el) => (inputRefs.current.items[idx].qty = el)}
                  />
                </td>
                <td className="border text-center">{item.unit}</td>
                <td className="border text-center">
                  <input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                    onKeyDown={(e) => handleItemKeyDown(e, idx, "rate")}
                    className="w-20 text-center border border-gray-400 px-1"
                    ref={(el) => (inputRefs.current.items[idx].rate = el)}
                  />
                </td>
                <td className="border text-right px-2">{(item.qty * item.rate).toFixed(2)}</td>
                <td className="border text-center">
                  <button onClick={() => removeRow(idx)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mt-4">
        <div className="bg-white border border-gray-300 p-3 w-80 text-sm space-y-1 text-right">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax (18%): ₹{tax.toFixed(2)}</p>
          <p>
            Discount:
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              onKeyDown={handleDiscountKeyDown}
              ref={(el) => (inputRefs.current.discount = el)}
              className="border border-gray-400 text-right px-1 ml-2 w-20"
            />
          </p>
          <p>
            Round Off:
            <span className={`ml-2 ${roundOff > 0 ? "text-green-600" : "text-red-600"}`}>
              {roundOff > 0 ? "+" : ""}
              {roundOff.toFixed(2)}
            </span>
          </p>
          <p className="font-semibold border-t border-gray-400 pt-2 text-lg">
            Total: ₹{total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
