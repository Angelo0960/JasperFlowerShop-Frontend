// File: OrderFulfillmentTab.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import OrderTable from "./OrderTable";

const STATUS_TABS = [
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In-Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" }
];

export default function OrderFulfillmentTab() {
  const [activeStatus, setActiveStatus] = useState("pending");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0
  });

  return (
    <div className="p-4">
      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Cancelled</div>
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-1 border-b pb-2 mb-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log(`🔘 Tab clicked: ${tab.id}`);
              setActiveStatus(tab.id);
            }}
            className={`
              px-4 py-2 rounded-t-lg font-medium transition-all duration-200
              ${activeStatus === tab.id
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            `}
          >
            <div className="flex items-center">
              <span>{tab.label}</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeStatus === tab.id 
                  ? "bg-white bg-opacity-20 text-black" 
                  : "bg-gray-300 bg-opacity-50"
              }`}>
                {/* Tab count would go here */}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-8 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="mt-2">Loading orders...</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded border border-red-200">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>Error: {error}</span>
          </div>
          <button 
            onClick={() => {}}
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {!loading && error === null && (
          <>
            <OrderTable 
              data={[]} 
              refreshOrders={() => {}}
              isLoading={loading}
            />
            
            {orders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-lg">No orders found</p>
                <p className="text-sm">Orders will appear here</p>
                <button
                  onClick={() => {}}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create Test Order
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}