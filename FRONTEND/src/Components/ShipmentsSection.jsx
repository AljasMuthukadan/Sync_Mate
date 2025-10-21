import { useState } from "react";
import { FaPlus, FaTimes, FaSyncAlt } from "react-icons/fa";
import axios from "axios";

export default function ShipmentsSection() {
  const [shipments, setShipments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [captchaPopup, setCaptchaPopup] = useState(null);

  const [newShipment, setNewShipment] = useState({
    ledger: "",
    courier: "",
    tracking: "",
  });

  const couriers = ["Trackon", "DTDC", "Professional Couriers", "VRL Logistics"];

  // Add new shipment
  const addShipment = () => {
    if (!newShipment.ledger || !newShipment.courier || !newShipment.tracking) {
      alert("Please fill all fields");
      return;
    }
    setShipments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newShipment,
        deliveryStatus: "Pending",
        location: "--",
        lastChecked: "--",
      },
    ]);
    setShowForm(false);
    setNewShipment({ ledger: "", courier: "", tracking: "" });
  };

  // Fetch shipment status
  const fetchStatus = async (shipment, showPopup = false) => {
    setLoadingId(shipment.id);
    try {
      if (shipment.courier.toLowerCase() === "dtdc") {
        const captchaRes = await axios.get("http://localhost:5000/api/dtdc/captcha");
        if (captchaRes.data?.captcha) {
          let imageData = captchaRes.data.captcha;
          if (!imageData.startsWith("data:image")) imageData = `data:image/png;base64,${imageData}`;
          setCaptchaPopup({
            shipment,
            tracking: shipment.tracking,
            image: imageData,
            enteredCaptcha: "",
            showPopup,
            sessionId: captchaRes.data.sessionId,
          });
        } else {
          alert("Failed to fetch CAPTCHA from DTDC.");
        }
        setLoadingId(null);
        return;
      }

      const res = await axios.post("http://localhost:5000/api/check-status", {
        courier: shipment.courier,
        tracking: shipment.tracking,
      });

      if (res.data.status) {
        const updated = shipments.map((s) =>
          s.id === shipment.id
            ? {
                ...s,
                deliveryStatus: res.data.status.event || res.data.status.status || "Fetched",
                location: res.data.status.location || "--",
                lastChecked: new Date().toLocaleString(),
                podImage: res.data.status.podImage || null,
                info: res.data.status.details || null,
                timeline: res.data.status.history || null,
              }
            : s
        );
        setShipments(updated);
        if (showPopup) setPopupData({
          ...res.data.status,
          info: res.data.status.details || null,
          timeline: res.data.status.history || null
        });
      } else {
        alert("No status found");
      }
    } catch (err) {
      alert("Error fetching status: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // Handle DTDC CAPTCHA submit
  const handleCaptchaSubmit = async () => {
    if (!captchaPopup?.enteredCaptcha) {
      alert("Please enter the CAPTCHA");
      return;
    }

    setLoadingId(captchaPopup.shipment.id);
    try {
      const res = await axios.post("http://localhost:5000/api/dtdc/check", {
        tracking: captchaPopup.tracking,
        captcha: captchaPopup.enteredCaptcha,
        sessionId: captchaPopup.sessionId,
      });

      if (res.data.status) {
        const updated = shipments.map((s) =>
          s.id === captchaPopup.shipment.id
            ? {
                ...s,
                deliveryStatus: res.data.status.status || "Fetched",
                location: res.data.status.location || "--",
                lastChecked: new Date().toLocaleString(),
                info: res.data.status.details || null,
                timeline: res.data.status.history || null,
              }
            : s
        );
        setShipments(updated);
        if (captchaPopup.showPopup) setPopupData({
          ...res.data.status,
          info: res.data.status.details || null,
          timeline: res.data.status.history || null
        });
        setCaptchaPopup(null);
      } else {
        alert("Invalid CAPTCHA or no result found");
      }
    } catch (err) {
      alert("Error checking DTDC: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // Status color logic
  const statusColor = (status) => {
    if (!status) return "text-gray-700";
    if (/delivered/i.test(status)) return "text-green-600 font-semibold";
    if (/in transit|shipped|out for delivery/i.test(status)) return "text-blue-600 font-medium";
    if (/pending|not found/i.test(status)) return "text-orange-600 font-medium";
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

      {/* Desktop Table */}
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
                  <td className={`p-3 cursor-pointer ${statusColor(s.deliveryStatus)}`} onClick={() => fetchStatus(s, true)}>
                    {loadingId === s.id ? "Loading..." : s.deliveryStatus}
                  </td>
                  <td className="p-3">{s.location}</td>
                  <td className="p-3 text-xs">{s.lastChecked || "--"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => fetchStatus(s, false)}
                      disabled={loadingId === s.id}
                      className={`flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 ${loadingId === s.id ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <FaSyncAlt className={loadingId === s.id ? "animate-spin" : ""} />
                      {loadingId === s.id ? "Checking..." : "Check Status"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500 italic bg-gray-50">
                  No shipments added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {shipments.length > 0 ? (
          shipments.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-700 font-semibold">#{s.id}</span>
                <button
                  onClick={() => fetchStatus(s, false)}
                  disabled={loadingId === s.id}
                  className={`flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 ${loadingId === s.id ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <FaSyncAlt className={loadingId === s.id ? "animate-spin" : ""} />
                  {loadingId === s.id ? "..." : "Check"}
                </button>
              </div>

              <p><strong>Ledger:</strong> {s.ledger}</p>
              <p><strong>Courier:</strong> {s.courier}</p>
              <p><strong>Tracking:</strong> {s.tracking}</p>
              <p className={`mt-1 cursor-pointer ${statusColor(s.deliveryStatus)}`} onClick={() => fetchStatus(s, true)}>
                <strong>Status:</strong> {loadingId === s.id ? "Loading..." : s.deliveryStatus}
              </p>
              <p><strong>Location:</strong> {s.location}</p>
              <p className="text-xs text-gray-500"><strong>Last Checked:</strong> {s.lastChecked || "--"}</p>
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white border rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
            <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"><FaTimes /></button>
            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b pb-2">Add New Shipment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Name</label>
                <input type="text" value={newShipment.ledger} onChange={(e)=>setNewShipment({...newShipment, ledger:e.target.value})} className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Courier</label>
                <select value={newShipment.courier} onChange={(e)=>setNewShipment({...newShipment, courier:e.target.value})} className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none">
                  <option value="">Select Courier</option>
                  {couriers.map((c,i)=><option key={i} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                <input type="text" value={newShipment.tracking} onChange={(e)=>setNewShipment({...newShipment, tracking:e.target.value})} className="border border-gray-300 px-3 py-2 rounded-sm w-full text-sm outline-none"/>
              </div>
            </div>
            <button onClick={addShipment} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Add</button>
          </div>
        </div>
      )}
{/* 🚀 Enhanced Professional Status Popup */}
{popupData && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start pt-20 z-50 animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative overflow-y-auto max-h-[85vh] border border-gray-100">
      
      {/* Close Button */}
      <button
        onClick={() => setPopupData(null)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
      >
        <FaTimes size={22} />
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl px-6 py-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          🚚 Shipment Tracking Details
        </h3>
        <p className="text-sm text-blue-100">Comprehensive tracking summary and proof of delivery</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">

        {/* Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {popupData.trackingNo && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-gray-500">Tracking No</p>
              <p className="font-semibold text-gray-800">{popupData.trackingNo}</p>
            </div>
          )}
          {popupData.date && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-gray-500">Last Updated</p>
              <p className="font-semibold text-gray-800">{popupData.date}</p>
            </div>
          )}
          {popupData.location && (
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-gray-500">Current Location</p>
              <p className="font-semibold text-gray-800">{popupData.location}</p>
            </div>
          )}
          {(popupData.event || popupData.status) && (
            <div className="bg-gray-50 rounded-lg p-3 border col-span-1 sm:col-span-2 md:col-span-3">
              <p className="text-gray-500">Status</p>
              <p
                className={`font-semibold text-lg ${
                  /delivered/i.test(popupData.event || popupData.status)
                    ? "text-green-600"
                    : /in transit|out for delivery|shipped/i.test(popupData.event || popupData.status)
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {popupData.event || popupData.status}
              </p>
            </div>
          )}
        </div>

        {/* Shipment Info */}
        {popupData.info && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-blue-700 mb-2">📦 Shipment Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {Object.entries(popupData.info).map(([key, value]) => (
                <p key={key}>
                  <span className="font-medium text-gray-600">{key}:</span>{" "}
                  <span className="text-gray-800">{value}</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* POD Section */}
        {popupData.podImage && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
              📄 Proof of Delivery (POD)
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <img
                src={popupData.podImage}
                alt="POD"
                className="rounded-lg border shadow-md max-h-64  w-full sm:w-1/2 object-cover"
              />
              <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                <a
                  href={popupData.podImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition text-center"
                >
                View POD
                </a>
                <a
                  href={popupData.podImage}
                  download={`POD_${popupData.trackingNo || "Trackon"}.jpg`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md transition text-center"
                >
                Download POD
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Timeline / History */}
        {popupData.timeline && popupData.timeline.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-blue-700 mb-3">🕒 Tracking History</h4>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-blue-200"></div>
              <ul className="space-y-4">
                {popupData.timeline.map((event, idx) => (
                  <li key={idx} className="relative">
                    <div className="absolute -left-[7px] top-1.5 w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                    <div className="ml-2">
                      <p className="font-semibold text-gray-800">{event.activity || event.event}</p>
                      {event.location && (
                        <p className="text-sm text-gray-600">{event.location}</p>
                      )}
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      {/* DTDC CAPTCHA Popup */}
      {captchaPopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] px-3">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-fadeIn">
            <button onClick={()=>setCaptchaPopup(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><FaTimes size={20}/></button>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-blue-700 flex items-center justify-center gap-2"><FaSyncAlt/> DTDC CAPTCHA</h3>
              <p className="text-gray-500 text-sm mt-1">Enter the code shown below to track your shipment</p>
            </div>
            <div className="flex flex-col items-center gap-3 mb-4">
              {captchaPopup.image ? <img src={captchaPopup.image} alt="CAPTCHA" className="w-56 h-20 object-contain border border-gray-300 rounded-lg shadow-sm"/> : <p className="text-gray-500">Loading CAPTCHA...</p>}
              <button onClick={async ()=>{
                try {
                  const res = await axios.get("http://localhost:5000/api/dtdc-captcha");
                  if(res.data?.captcha){
                    let imageData=res.data.captcha;
                    if(!imageData.startsWith("data:image")) imageData=`data:image/png;base64,${imageData}`;
                    setCaptchaPopup({...captchaPopup,image:imageData,enteredCaptcha:"",sessionId:res.data.sessionId});
                  }
                }catch(err){alert("Failed to refresh CAPTCHA");}
              }} className="text-sm text-blue-600 hover:text-blue-800 underline transition">Refresh CAPTCHA</button>
            </div>
            <input type="text" placeholder="Enter CAPTCHA" value={captchaPopup.enteredCaptcha||""} onChange={(e)=>setCaptchaPopup({...captchaPopup,enteredCaptcha:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-300"/>
            <button onClick={handleCaptchaSubmit} className="mt-4 w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition">Submit</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:scale(0.95);} to {opacity:1; transform:scale(1);} }
        .animate-fadeIn { animation:fadeIn 0.3s ease-out;}
      `}</style>
    </div>
  );
}