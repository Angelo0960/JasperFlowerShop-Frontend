import { useState } from "react";
import OrderTransaction from "./OrderTransaction";
import OrderFulfillment from "./OrderFulfillment";

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
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
        <p className="text-gray-600">Create new orders and manage order fulfillment</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex space-x-1 border-b pb-2 mb-6">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`
              flex items-center px-6 py-3 rounded-t-lg font-medium transition-all duration-200
              ${tab === tabItem.id
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            `}
          >
            {tabItem.icon}
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 bg-white rounded-lg shadow">
        {tab === "transaction" && <OrderTransaction />}
        {tab === "fulfillment" && <OrderFulfillment />}
      </div>

    

      
    
        
        
      
    </div>
  );
}