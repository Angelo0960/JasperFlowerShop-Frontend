import { useState, useEffect, useCallback, useMemo } from "react";
import OrderTable from "./OrderTable";

const STATUS_TABS = [
  { id: "pending", label: "Pending" },
  { id: "in-progress", label: "In-Progress" },
  { id: "completed", label: "Completed" },
 
];

export default function OrderFulfillmentTab() {
  const [activeStatus, setActiveStatus] = useState("pending");
  const [allOrders, setAllOrders] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
   
  });

 
  const isToday = (dateString) => {
    if (!dateString) return false;
    
    const orderDate = new Date(dateString);
    const today = new Date();
    
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };

  
  const getTodayCompletedOrders = useCallback((orders) => {
    if (!Array.isArray(orders)) return [];
    
    return orders.filter(order => {
      
      if (order.status !== "completed") return false;
      
      
      const dateToCheck = order.completed_at || order.updated_at || order.created_at;
      return isToday(dateToCheck);
    });
  }, []);

  
  const fetchOrderStats = useCallback(async () => {
    try {
      console.log("📊 Fetching order stats...");
      const response = await fetch("http://localhost:3000/orders/stats");
      const result = await response.json();
      console.log("📊 Order stats received:", result);
      if (result.success) {
        setStats({
          total: result.data.total_orders || 0,
          pending: result.data.pending_orders || 0,
          inProgress: result.data.in_progress_orders || 0,
          completed: result.data.completed_orders || 0
          
        });
      }
    } catch (err) {
      console.error("❌ Error fetching order stats:", err);
    }
  }, []);

  
  const loadOrders = useCallback(async () => {
    try {
      console.log("🔄 Loading orders with status:", activeStatus);
      setLoading(true);
      setError(null);
      
      let url = "http://localhost:3000/orders/list";
      
      
      
      console.log("🌐 Fetching from:", url);
      
      const response = await fetch(url);
      
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("📦 Orders received:", result.data?.length || 0, "orders");
      
      if (result.success) {
        
        setAllOrders(result.data || []);
        console.log("✅ Orders loaded successfully");
      } else {
        console.error("❌ Failed to load orders:", result.message);
        throw new Error(result.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("❌ Error loading orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeStatus]);

  
  const updateStatsImmediately = useCallback((oldStatus, newStatus) => {
    console.log(`📊 Updating stats: ${oldStatus} -> ${newStatus}`);
    
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      
      if (oldStatus === "pending") newStats.pending = Math.max(0, newStats.pending - 1);
      if (oldStatus === "in-progress") newStats.inProgress = Math.max(0, newStats.inProgress - 1);
      if (oldStatus === "completed") newStats.completed = Math.max(0, newStats.completed - 1);
     
      
      
      if (newStatus === "pending") newStats.pending += 1;
      if (newStatus === "in-progress") newStats.inProgress += 1;
      if (newStatus === "completed") newStats.completed += 1;
      
      
      console.log("📊 Updated stats immediately:", newStats);
      return newStats;
    });
  }, []);

  
  const handleOrderStatusUpdate = useCallback((orderId, oldStatus, newStatus) => {
    console.log(`🔄 Order ${orderId} status changed: ${oldStatus} -> ${newStatus}`);
    
    
    updateStatsImmediately(oldStatus, newStatus);
    
    
    setAllOrders(prevOrders => {
      return prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              
              ...(newStatus === "completed" && !order.completed_at ? {
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString() 
              } : newStatus !== "completed" ? {} : order)
            }
          : order
      );
    });
    
    
    setTimeout(() => {
      fetchOrderStats();
    }, 500);
    
  }, [updateStatsImmediately, fetchOrderStats]);

  
  useEffect(() => {
    console.log("🎯 Loading orders for status:", activeStatus);
    loadOrders();
  }, [loadOrders]);

  
  useEffect(() => {
    console.log("📊 Loading order stats");
    fetchOrderStats();
  }, [fetchOrderStats]);

  
  const getTabCount = useCallback((tabId) => {
    switch(tabId) {
      case "pending":
        return stats.pending;
      case "in-progress":
        return stats.inProgress;
      case "completed":
        
        return stats.completed;
      
      default:
        return 0;
    }
  }, [stats]);

  
  const getTodayCompletedCount = useMemo(() => {
    return getTodayCompletedOrders(allOrders).length;
  }, [allOrders, getTodayCompletedOrders]);

  
  const filteredOrders = useMemo(() => {
    console.log("🔍 Filtering orders by status:", activeStatus);
    
    if (activeStatus === "completed") {
      
      return getTodayCompletedOrders(allOrders);
    } else {
      
      return allOrders.filter(order => order.status === activeStatus);
    }
  }, [allOrders, activeStatus, getTodayCompletedOrders]);

  
  const handleManualRefresh = useCallback(() => {
    console.log("🔄 Manual refresh triggered");
    loadOrders();
    fetchOrderStats();
  }, [loadOrders, fetchOrderStats]);

  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-4">
      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#f8f3ed] border border-[#d4789e26] rounded-lg shadow-sm p-4">
          <div className="text-sm text-pink-800/70">Total Orders</div>
          <div className="text-2xl font-bold text-pink-800/80">{stats.total}</div>
        </div>
        <div className="bg-[#f8f3ed] border border-[#d4789e26] rounded-lg shadow-sm p-4">
          <div className="text-sm text-pink-800/70">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-[#f8f3ed] border border-[#d4789e26] rounded-lg shadow-sm p-4">
          <div className="text-sm text-pink-800/70">In Progress</div>
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        </div>
        <div className="bg-[#f8f3ed] border border-[#d4789e26] rounded-lg shadow-sm p-4">
          <div className="text-sm text-pink-800/70">Completed (Today)</div>
          <div className="text-2xl font-bold text-green-600">{getTodayCompletedCount}</div>
        </div>
        
      </div>

      {/* Status Tabs with Today's Date for Completed Tab */}
      <div className="flex space-x-1 border-b border-pink-800/20 pb-2 mb-4 items-center">
        <div className="flex-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                console.log(`🔘 Tab clicked: ${tab.id}`);
                setActiveStatus(tab.id);
              }}
              className={`
                mr-2 px-4 py-2 rounded-t-lg font-medium transition-all duration-200
                ${activeStatus === tab.id
                  ? "bg-pink-800/45 text-white shadow-sm"
                  : "bg-[#f8f3ed] hover:bg-pink-50 text-pink-800/70 border border-[#d4789e26]"
                }
              `}
            >
              <div className="flex items-center">
                <span>{tab.label}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeStatus === tab.id 
                    ? "bg-white bg-opacity-20 text-pink-800/70" 
                    : "bg-pink-100 text-pink-800/70"
                }`}>
                  {getTabCount(tab.id)}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Show today's date indicator for completed tab */}
        {activeStatus === "completed" && (
          <div className="text-sm text-pink-800/60 bg-pink-50 px-3 py-1 rounded border border-pink-200">
            <span className="font-medium">Today:</span> {formatDate(new Date())}
          </div>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-8 text-center text-pink-800/60">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
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
            onClick={() => {
              console.log("🔄 Retry button clicked");
              loadOrders();
            }}
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm border border-red-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-[#d4789e26] overflow-hidden">
        {!loading && error === null && (
          <>
            {/* Completed Tab Header */}
            {activeStatus === "completed" && (
              <div className="p-4 border-b border-pink-200 bg-pink-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-pink-800/80">Today's Completed Orders</h3>
                    <p className="text-sm text-pink-800/60">
                      Showing {getTodayCompletedCount} orders completed on {formatDate(new Date())}
                      {stats.completed > getTodayCompletedCount && 
                        ` (${stats.completed} total completed orders in system)`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleManualRefresh}
                      className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors text-sm font-medium border border-pink-700"
                    >
                      ↻ Refresh
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <OrderTable 
              data={filteredOrders} 
              refreshOrders={loadOrders}
              isLoading={loading}
              onOrderStatusUpdate={handleOrderStatusUpdate}
            />
            
            {filteredOrders.length === 0 && (
              <div className="p-8 text-center text-pink-800/50">
                <svg className="w-16 h-16 mx-auto text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="mt-2 text-lg text-pink-800/70">
                  {activeStatus === "completed" 
                    ? `No orders completed today (${formatDate(new Date())})`
                    : `No ${activeStatus} orders found`
                  }
                </p>
                <p className="text-sm">
                  {activeStatus === "completed" 
                    ? `Orders completed today will appear here (${stats.completed} total completed orders in system)`
                    : `Orders with status "${activeStatus}" will appear here`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}