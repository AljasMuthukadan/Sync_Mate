import { useState } from "react";

export default function SettingsSection() {
  const [appName, setAppName] = useState("Inventory Management");
  const [theme, setTheme] = useState("Blue & White");
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#1D4ED8"); // Blue
  const [secondaryColor, setSecondaryColor] = useState("#FBBF24"); // Amber
  const [defaultPage, setDefaultPage] = useState("Dashboard");
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");

  const [units, setUnits] = useState(["Nos", "Kg", "Litre"]); // Default units
  const [newUnit, setNewUnit] = useState("");

  const addUnit = () => {
    if (newUnit.trim() && !units.includes(newUnit.trim())) {
      setUnits([...units, newUnit.trim()]);
      setNewUnit("");
    }
  };

  const removeUnit = (unitToRemove) => {
    setUnits(units.filter((u) => u !== unitToRemove));
  };

  const saveSettings = () => {
    alert(
      `✅ Settings Saved!\n
App Name: ${appName}
Theme: ${theme} ${darkMode ? "(Dark Mode)" : ""}
Primary Color: ${primaryColor}
Secondary Color: ${secondaryColor}
Default Page: ${defaultPage}
Low Stock Threshold: ${lowStockThreshold}
Date Format: ${dateFormat}
Units: ${units.join(", ")}`
    );
  };

  const resetSettings = () => {
    if (window.confirm("⚠️ Reset all settings?")) {
      setAppName("Inventory Management");
      setTheme("Blue & White");
      setDarkMode(false);
      setPrimaryColor("#1D4ED8");
      setSecondaryColor("#FBBF24");
      setDefaultPage("Dashboard");
      setLowStockThreshold(5);
      setDateFormat("DD-MM-YYYY");
      setUnits(["Nos", "Kg", "Litre"]);
      setNewUnit("");
    }
  };

  return (
    <div className="flex justify-center py-6 px-2">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center sm:text-left">
          ⚙️ Settings
        </h2>

        {/* App Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">App Name</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Theme & Dark Mode */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Blue & White">Blue & White</option>
              <option value="Dark">Dark</option>
              <option value="Light">Light</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-6 sm:mt-8">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              id="darkMode"
              className="w-5 h-5 accent-blue-600"
            />
            <label htmlFor="darkMode" className="text-gray-700 font-medium">
              Enable Dark Mode
            </label>
          </div>
        </div>

        {/* Colors */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Primary Color</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Secondary Color</label>
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-full h-10 cursor-pointer rounded border border-gray-300"
            />
          </div>
        </div>

        {/* Default Page & Low Stock Threshold */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Default Page</label>
            <select
              value={defaultPage}
              onChange={(e) => setDefaultPage(e.target.value)}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option>Dashboard</option>
              <option>Items</option>
              <option>Orders</option>
              <option>Production</option>
              <option>Shipments</option>
              <option>Settings</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Low Stock Threshold</label>
            <input
              type="number"
              min="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Date Format */}
        <div className="grid sm:grid-cols-1 gap-4 mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Date Format</label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
          </select>
        </div>

        {/* Units Management */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Units</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add new unit (e.g. Sheet)"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={addUnit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {units.map((unit, i) => (
              <span
                key={i}
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                {unit}
                <button
                  onClick={() => removeUnit(unit)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save / Reset Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 justify-center sm:justify-start">
          <button
            onClick={saveSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full sm:w-auto"
          >
            Save Settings
          </button>
          <button
            onClick={resetSettings}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
          >
            Reset Settings
          </button>
        </div>
      </div>
    </div>
  );
}
