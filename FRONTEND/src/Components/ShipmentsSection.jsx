import { useState } from "react";
import { FaPlus, FaTimes, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

export default function ShipmentsSection() {
  const [shipments, setShipments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [popupData, setPopupData] = useState(null);

  const [newShipment, setNewShipment] = useState({
    ledger: "",
    courier: "",
    tracking: "",
    date: "",
  });

  const couriers = ["Trackon", "DTDC", "Professional Couriers", "VRL Logistics"];

  const addShipment = () => {
    if (!newShipment.ledger || !newShipment.courier || !newShipment.tracking) return;

    setShipments([
      ...shipments,
      {
        id: shipments.length + 1,
        ...newShipment,
        deliveryStatus: "Pending",
        location: "--",
        lastChecked: "--",
      },
    ]);

    setShowForm(false);
    setNewShipment({ ledger: "", courier: "", tracking: "", date: "" });
  };

  const fetchStatus = async (shipment, showPopup = false) => {
    setLoadingId(shipment.id);
    try {
      const res = await axios.post("http://localhost:5000/api/check-status", {
        courier: shipment.courier,
        tracking: shipment.tracking,
      });

      if (res.data.status) {
        const updated = shipments.map((s) =>
          s.id === shipment.id
            ? {
                ...s,
                deliveryStatus: res.data.status.event,
                location: res.data.status.location,
                lastChecked: new Date().toLocaleString(),
                podImage: res.data.status.podImage || null,
              }
            : s
        );
        setShipments(updated);

        if (showPopup) {
          setPopupData({ ...res.data.status });
        }
      } else {
        alert("No status found");
      }
    } catch (err) {
      alert("Error fetching status: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const statusColor = (status) => {
    if (!status) return "text-gray-700";
    if (/delivered/i.test(status)) return "text-green-600 font-semibold";
    if (/in transit|shipped/i.test(status))
      return "text-blue-600 font-medium";
    if (/out for delivery/i.test(status))
      return "text-yellow-600 font-semibold";
    if (/pending|not found/i.test(status))
      return "text-orange-600 font-medium";
    return "text-gray-700";
  };

  return (
    <div className="relative p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          🚚 Shipments
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition"
        >
          <FaPlus /> Add Shipment
        </button>
      </div>

      {/* Shipments Table */}
      <div className="overflow-x-auto rounded-xl shadow hidden sm:block">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-50 text-blue-700 text-sm uppercase">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Ledger</th>
              <th className="p-3 text-left">Courier</th>
              <th className="p-3 text-left">Tracking</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Last Checked</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length > 0 ? (
              shipments.map((s) => (
                <tr key={s.id} className="border-b hover:bg-blue-50 text-sm">
                  <td className="p-3">{s.id}</td>
                  <td className="p-3">{s.ledger}</td>
                  <td className="p-3">{s.courier}</td>
                  <td className="p-3">{s.tracking}</td>
                  <td
                    className={`p-3 cursor-pointer ${statusColor(s.deliveryStatus)}`}
                    onClick={() => fetchStatus(s, true)}
                  >
                    {loadingId === s.id ? "Loading..." : s.deliveryStatus}
                  </td>
                  <td className="p-3">{s.location}</td>
                  <td className="p-3 text-xs">{s.lastChecked || "--"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => fetchStatus(s, false)}
                      disabled={loadingId === s.id}
                      className={`flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 ${
                        loadingId === s.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <FaSyncAlt className={loadingId === s.id ? "animate-spin" : ""} />
                      {loadingId === s.id ? "Checking..." : "Check Status"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-6 text-gray-500 italic bg-gray-50"
                >
                  No shipments added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile Card View */}
      <div className="sm:hidden space-y-4">
        {shipments.length > 0 ? (
          shipments.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-700 font-semibold">#{s.id}</span>
                <button
                  onClick={() => fetchStatus(s, false)}
                  disabled={loadingId === s.id}
                  className={`flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 ${
                    loadingId === s.id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaSyncAlt className={loadingId === s.id ? "animate-spin" : ""} />
                  {loadingId === s.id ? "..." : "Check"}
                </button>
              </div>

              <p><strong>Ledger:</strong> {s.ledger}</p>
              <p><strong>Courier:</strong> {s.courier}</p>
              <p><strong>Tracking:</strong> {s.tracking}</p>
              <p
                className={`mt-1 cursor-pointer ${statusColor(s.deliveryStatus)}`}
                onClick={() => fetchStatus(s, true)}
              >
                <strong>Status:</strong> {loadingId === s.id ? "Loading..." : s.deliveryStatus}
              </p>
              <p><strong>Location:</strong> {s.location}</p>
              <p className="text-xs text-gray-500">
                <strong>Last Checked:</strong> {s.lastChecked || "--"}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 italic bg-gray-50 p-6 rounded-xl">
            No shipments added yet
          </div>
        )}
      </div>

      {/* Add Shipment Form */}
      {showForm && (
        <div className="absolute inset-0 flex justify-center items-start mt-10 z-50">
          <div className="bg-white border rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">
              Add New Shipment
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ledger Name
                </label>
                <input
                  type="text"
                  value={newShipment.ledger}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, ledger: e.target.value })
                  }
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Courier
                </label>
                <select
                  value={newShipment.courier}
                  onChange={(e) =>
                    setNewShipment({ ...newShipment, courier: e.target.value })
                  }
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full text-sm outline-none"
                >
                  <option value="">Select Courier</option>
                  {couriers.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
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
                  className="border border-gray-300 px-3 py-2 rounded-lg w-full text-sm outline-none"
                />
              </div>
            </div>
            <button
              onClick={addShipment}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* ✅ Premium Status Popup */}
      {popupData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-20 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden border border-gray-100">
            {/* Close button */}
            <button
              onClick={() => setPopupData(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes size={18} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-2xl shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                📦 Tracking Details
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500 font-medium">Tracking No</p>
                  <p className="text-gray-900 font-semibold text-base">{popupData.trackingNo}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500 font-medium">Date</p>
                  <p className="text-gray-900 font-semibold text-base">{popupData.date}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900 font-semibold text-base">{popupData.location}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition">
                  <p className="text-sm text-gray-500 font-medium">Current Status</p>
                  <p
                    className={`text-base font-bold ${
                      /delivered/i.test(popupData.event)
                        ? "text-green-600"
                        : /out for delivery/i.test(popupData.event)
                        ? "text-yellow-600"
                        : /in transit/i.test(popupData.event)
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {popupData.event}
                  </p>
                </div>
              </div>

              {/* POD Image */}
              {popupData.podImage && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    🧾 Proof of Delivery (POD)
                  </h4>
                  <div className="relative group">
                    <img
                      src={popupData.podImage}
                      alt="POD"
                      className="rounded-xl border border-gray-200 w-full shadow-md group-hover:shadow-lg transition"
                    />
                    <a
                      href={popupData.podImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-blue-500 transition "
                    >
                      View / Download POD
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        `}
      </style>
    </div>
  );
}