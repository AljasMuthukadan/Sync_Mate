import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import  axios from "axios";

export default function AddShipmentForm({
  newShipment,
  setNewShipment,
  addShipment,
  setShowForm,
  couriers,
  shipments,
}) {
  const [errors, setErrors] = useState({});
  const [ledgerSuggestions, setLedgerSuggestions] = useState([]);
  const suggestionRef = useRef(null);
  const justClicked = useRef(false); // ✅ prevents dropdown reopening
   const [commonLedgers, setCommonLedgers] = useState([]);
  
  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/ledger/get");
        console.log(res.data[0].name);
        const ledgerNames = res.data.map((ledger) => ledger.name);
        setCommonLedgers(ledgerNames);
      } catch (err) {
        console.error("Error fetching ledgers:", err);
      }
    };
    fetchLedgers();
  }, []);

  // ✅ Filter suggestions when typing
  useEffect(() => {
    newShipment.ledger = newShipment.ledger || "";
    if (justClicked.current) {
      justClicked.current = false;
      return; // don't reopen after selecting
    }

    if (newShipment.ledger.trim() === "") {
      setLedgerSuggestions([]);
    } else {
      const filtered = commonLedgers.filter((ledger) =>
        ledger.toLowerCase().includes(newShipment.ledger.toLowerCase())
      );
      setLedgerSuggestions(filtered);
    }
  }, [newShipment.ledger]);

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setLedgerSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Add shipment + reset form
  const handleAdd = () => {
    const validation = {};
    if (!newShipment.ledger.trim()) validation.ledger = "Ledger is required";
    if (!newShipment.courier) validation.courier = "Courier is required";
    if (!newShipment.tracking.trim())
      validation.tracking = "Tracking number is required";

    if (shipments.some((s) => s.tracking === newShipment.tracking.trim())) {
      validation.tracking = "This tracking number already exists";
    }

    setErrors(validation);

    if (Object.keys(validation).length === 0) {
      addShipment();
      setNewShipment({ ledger: "", courier: "", tracking: "" });
      setLedgerSuggestions([]);
    }
  };

  // ✅ Keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
    if (e.key === "Escape") setShowForm(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="bg-white border rounded-xl shadow-2xl p-6 w-full max-w-lg relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>

        <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
          Add New Shipment
        </h3>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Ledger Name */}
          <div className="relative" ref={suggestionRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ledger Name
            </label>
            <input
              type="text"
              value={newShipment.ledger}
              onChange={(e) => {
                setNewShipment({ ...newShipment, ledger: e.target.value });
              }}
              className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"
              placeholder="Enter or select ledger"
              autoFocus
            />
            {errors.ledger && (
              <p className="text-red-500 text-xs mt-1">{errors.ledger}</p>
            )}

            {/* ✅ Ledger Suggestions Dropdown */}
            {ledgerSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-sm mt-1 z-10 max-h-32 overflow-auto shadow-md">
                {ledgerSuggestions.map((ledger, i) => (
                  <li
                    key={i}
                    className="px-3 py-1 hover:bg-blue-100 cursor-pointer text-sm"
                    onMouseDown={() => {
                      // use onMouseDown instead of onClick to prevent blur conflicts
                      justClicked.current = true;
                      setNewShipment({ ...newShipment, ledger });
                      setLedgerSuggestions([]);
                    }}
                  >
                    {ledger}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Courier Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Courier
            </label>
            <select
              value={newShipment.courier}
              onChange={(e) =>
                setNewShipment({ ...newShipment, courier: e.target.value })
              }
              className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"
            >
              <option value="">Select Courier</option>
              {couriers.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.courier && (
              <p className="text-red-500 text-xs mt-1">{errors.courier}</p>
            )}
          </div>

          {/* Tracking Number */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tracking Number
            </label>
            <input
              type="text"
              value={newShipment.tracking}
              onChange={(e) =>
                setNewShipment({ ...newShipment, tracking: e.target.value })
              }
              className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"
              placeholder="Enter tracking number"
            />
            {errors.tracking && (
              <p className="text-red-500 text-xs mt-1">{errors.tracking}</p>
            )}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}

