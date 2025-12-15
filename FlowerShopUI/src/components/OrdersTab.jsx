import { useState } from "react";
import OrderTransaction from "./OrderTransaction";
import OrderFulfillment from "./OrderFullfilment";

export default function OrdersTab() {
  const [tab, setTab] = useState("transaction");

  const tabs = [
    {
      id: "transaction",
      label: "Create Order",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      description: "Create new customer orders"
    },
    {
      id: "fulfillment",
      label: "Order Fulfillment",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      description: "Track and update order status"
    }
  ];

  return (
    <div className="">
      {/* Sub-tabs */}
      <div className="flex space-x-1 rounded-xl pb-2 mb-6">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`
              flex items-center px-6 py-3 rounded-t-lg font-medium transition-all duration-200
              ${tab === tabItem.id
                ? "bg-pink-800/45 text-white shadow-md"
                : "bg-[#f8f3ed] border border-[#d4789e26] hover:bg-pink-50 text-pink-800/70"
              }
            `}
          >
            {tabItem.icon}
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-xl border border-[#d4789e26] shadow-sm">
        {tab === "transaction" && <OrderTransaction />}
        {tab === "fulfillment" && <OrderFulfillment />}
      </div>
    </div>
  );
}