import { useState } from "react";
import DailySales from "./DailySales";
import WeeklySales from "./WeeklySales";
import MonthlySales from "./MonthlySales";

export default function SalesTab() {
  const [salesPeriod, setSalesPeriod] = useState("daily");

  const tabs = [
    { id: "daily", label: "Daily", component: <DailySales range="day" /> },
    { id: "weekly", label: "Weekly", component: <WeeklySales range="week" /> },
    { id: "monthly", label: "Monthly", component: <MonthlySales range="month" /> }
  ];

  return (
    <div className="p-4">
    
      

      {/* Sub-tabs */}
      <div className="flex space-x-1 border-b border-pink-800/20 pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSalesPeriod(tab.id)}
            className={`
              flex items-center px-6 py-3 rounded-t-lg font-medium transition-all duration-200
              ${salesPeriod === tab.id
                ? "bg-pink-800/45 text-white shadow-md"
                : "bg-[#f8f3ed] border border-[#d4789e26] hover:bg-pink-50 text-pink-800/70"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Component loader - NO ExportButton here anymore */}
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