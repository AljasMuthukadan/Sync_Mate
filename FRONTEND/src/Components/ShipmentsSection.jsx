import { useState,useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import ShipmentsTable from "../ShipCompo/ShipmentsTable";
import ShipmentsMobileCards from "../ShipCompo/ShipmentsMobileCards";
import AddShipmentForm from "../ShipCompo/AddShipmentForm";
import StatusPopup from "../ShipCompo/StatusPopup";
import CaptchaPopup from "../ShipCompo/CaptchaPopup";
import { statusColor } from "../ShipCompo/utils";

export default function ShipmentsSection() {
  const [shipments, setShipments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [popupData, setPopupData] = useState(null);
  const [captchaPopup, setCaptchaPopup] = useState(null);
  const [loading, setLoading] = useState(false);
   
  const fetchShipments = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/shipment/get");
        setShipments(res.data); // assumes your API returns an array of shipments
      } catch (err) {
        console.error("❌ Error fetching shipments:", err);
        alert("Failed to load shipments from server");
      }finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    

    fetchShipments();
  }, []); // runs only once when section opens

  const [newShipment, setNewShipment] = useState({
    ledger: "",
    courier: "",
    tracking: "",
  });

  const couriers = [
    "Trackon",
    "DTDC",
    "APS Parcel Service",
    "Professional Couriers",
    "VRL Logistics",
  ];

  const deleteShipment = async (tracking) => {
  try {
    // Remove locally first for instant UI feedback
    setShipments((prev) => prev.filter((s) => s.tracking !== tracking));

    // Send the specific tracking number to the backend
    await axios.post("http://localhost:5000/api/shipment/delete", { tracking });

    console.log("✅ Shipment deleted successfully");
  } catch (err) {
    console.error("❌ Error deleting shipment:", err);
    alert("Failed to delete shipment");
  }
};


  // ➕ Add shipment
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
    axios.post("http://localhost:5000/api/shipment/add", newShipment)
    setNewShipment({ ledger: "", courier: "", tracking: "" });
  };

  // 🔍 Fetch shipment status (DTDC / Trackon / APS)
  const fetchStatus = async (shipment, showPopup = false) => {
    setLoadingId(shipment.tracking);
   
    try {
      // DTDC requires CAPTCHA
      if (shipment.courier.toLowerCase() === "dtdc") {
        const captchaRes = await axios.get("http://localhost:5000/api/dtdc/captcha");
        if (captchaRes.data?.captcha) {
          let imageData = captchaRes.data.captcha;
          if (!imageData.startsWith("data:image"))
            imageData = `data:image/png;base64,${imageData}`;
          setCaptchaPopup({
            shipment,
            tracking: shipment.tracking,
            image: imageData,
            enteredCaptcha: "",
            showPopup,
            sessionId: captchaRes.data.sessionId,
          });
        } else alert("Failed to fetch CAPTCHA from DTDC.");
        setLoadingId(null);
        return;
      }

      // APS support
      const endpoint =
        shipment.courier.toLowerCase() === "aps parcel service"
          ? "http://localhost:5000/api/aps/check"
          : "http://localhost:5000/api/check-status";

      const res = await axios.post(endpoint, {
        courier: shipment.courier,
        tracking: shipment.tracking,
        ledgerId: shipment.ledger,
      });
      if (res.data.status) {
        console.log(res.data)
        const updated = shipments.map((s) =>
          s.tracking === shipment.tracking
            ? {
                ...s,
                deliveryStatus:
                  res.data.status.event || res.data.status.status || "Fetched",
                location: res.data.status.location || "--",
                lastChecked: new Date().toLocaleString(),
                podImage: res.data.status.podImage || null,
                info: res.data.status.details || null,
                timeline: res.data.status.history || null,
              }
            : s
        );
        
        const updatedShipment = updated.find((s) => s.tracking === shipment.tracking);
        console.log(updatedShipment)
        await axios.post("http://localhost:5000/api/shipment/update", updatedShipment);
        fetchShipments()
 
        
    
        if (showPopup)
          setPopupData({
            ...res.data.status,
            info: res.data.status.details || null,
            timeline: res.data.status.history || null,

          });
        
      } else alert("No status found");
    } catch (err) {
      alert("Error fetching status: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  // 🔐 Handle DTDC CAPTCHA submit
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
        if (captchaPopup.showPopup)
          setPopupData({
            ...res.data.status,
            info: res.data.status.details || null,
            timeline: res.data.status.history || null,
          });
        setCaptchaPopup(null);
      } else alert("Invalid CAPTCHA or no result found");
    } catch (err) {
      alert("Error checking DTDC: " + err.message);
    } finally {
      setLoadingId(null);
    }
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

      {loading ? (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="mt-4 text-blue-600 font-medium tracking-wide">
      Loading shipments...
    </p>
  </div>
) : (
  <>
    <ShipmentsTable
      shipments={shipments}
      fetchStatus={fetchStatus}
      loadingId={loadingId}
      statusColor={statusColor}
      deleteShipment={deleteShipment}
    />
    <ShipmentsMobileCards
      shipments={shipments}
      fetchStatus={fetchStatus}
      loadingId={loadingId}
      statusColor={statusColor}
    />
  </>
)}

      {/* Popups */}
      {showForm && (
        <AddShipmentForm
          newShipment={newShipment}
          setNewShipment={setNewShipment}
          addShipment={addShipment}
          setShowForm={setShowForm}
          couriers={couriers}
          shipments={shipments}
        />
      )}

      {popupData && (
        <StatusPopup popupData={popupData} onClose={() => setPopupData(null)} />
      )}

      {captchaPopup && (
        <CaptchaPopup
          captchaPopup={captchaPopup}
          setCaptchaPopup={setCaptchaPopup}
          handleCaptchaSubmit={handleCaptchaSubmit}
        />
      )}
    </div>
  );
}