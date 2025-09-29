import { useState } from "react";

export default function SettingsSection() {
  const [appName, setAppName] = useState("Inventory Management");
  const [theme, setTheme] = useState("Blue & White");

  const saveSettings = () => {
    alert(`Settings Saved!\nApp Name: ${appName}\nTheme: ${theme}`);
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-md sm:max-w-lg">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center sm:text-left">
          ⚙️ Settings
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">App Name</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Theme</label>
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

        <div className="flex justify-center sm:justify-start">
          <button
            onClick={saveSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 w-full sm:w-auto"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

