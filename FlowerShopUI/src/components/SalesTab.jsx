import { useState } from "react";
import DailySales from "./DailySales";
import WeeklySales from "./WeeklySales";
import MonthlySales from "./MonthlySales";

export default function SalesTab() {
  const [salesPeriod, setSalesPeriod] = useState("daily");

  const tabs = [
    { id: "daily", label: "Daily", component: <DailySales /> },
    { id: "weekly", label: "Weekly", component: <WeeklySales /> },
    { id: "monthly", label: "Monthly", component: <MonthlySales /> }
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
        <p className="text-gray-600">Track and analyze sales performance across different time periods</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex space-x-1 border-b pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSalesPeriod(tab.id)}
            className={`
              flex items-center px-6 py-3 rounded-t-lg font-medium transition-all duration-200
              ${salesPeriod === tab.id
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Component loader */}
      <div className="p-4">
        {tabs.map((tab) => (
          <div key={tab.id} className={salesPeriod === tab.id ? "block" : "hidden"}>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
}