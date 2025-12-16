import { useEffect, useState } from "react";
import SalesTable from "./SalesTable.jsx";
import ExportButton from "./ExportButton.jsx";

const DailySales = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsSold, setItemsSold] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchDailySales();
    
    // Set up interval to check for new day
    const intervalId = setInterval(() => {
      const now = new Date();
      const storedDate = new Date(currentDate);
      
      // Check if it's a new day (different date)
      if (
        now.getDate() !== storedDate.getDate() ||
        now.getMonth() !== storedDate.getMonth() ||
        now.getFullYear() !== storedDate.getFullYear()
      ) {
        console.log("🔄 New day detected, resetting data...");
        setCurrentDate(now);
        resetDailyData();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [currentDate]);

  const fetchDailySales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📊 Fetching daily sales...");
      
      // FIX: Use local date components instead of toISOString() to prevent date shifting in timezones behind UTC.
      const todayLocal = new Date();
      const year = todayLocal.getFullYear();
      const month = String(todayLocal.getMonth() + 1).padStart(2, '0');
      const day = String(todayLocal.getDate()).padStart(2, '0');
      
      const today = `${year}-${month}-${day}`; // YYYY-MM-DD
      
      // Try multiple possible endpoints
      const endpoints = [
        `http://localhost:3000/api/reports/sales?period=daily&date=${today}`,
        `http://localhost:3000/api/reports/daily?date=${today}`,
        `http://localhost:3000/sales/daily?date=${today}`
      ];
      
      let response;
      let result;
      let successful = false;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint);
          
          if (response.ok) {
            result = await response.json();
            console.log(`✅ Found working endpoint: ${endpoint}`);
            successful = true;
            break;
          }
        } catch (err) {
          console.log(`❌ Endpoint ${endpoint} failed:`, err.message);
          continue;
        }
      }
      
      if (!successful) {
        throw new Error("No working API endpoint found for daily sales");
      }
      
      console.log("📦 Daily API Response:", result);
      
      if (result.success) {
        // Extract data from the response structure
        let rawData = [];
        let summary = {};
        let topProductsData = [];
        
        if (result.data) {
          rawData = result.data.rawData || [];
          summary = result.data.summary || {};
          topProductsData = result.data.topProducts || [];
        } else {
          // If data is at root level
          rawData = result.rawData || [];
          summary = result.summary || {};
          topProductsData = result.topProducts || [];
        }
        
        console.log(`✅ Daily sales loaded: ${rawData.length} records`);
        
        // Ensure arrays
        if (!Array.isArray(rawData)) rawData = [];
        if (!Array.isArray(topProductsData)) topProductsData = [];
        
        setSalesData(rawData);
        setTopProducts(topProductsData);
        
        // Calculate stats - ensure they're numbers
        const totalRev = parseFloat(summary.total_sales || summary.totalSales || 0);
        const totalOrd = parseInt(summary.transaction_count || rawData.length || 0);
        const totalItems = parseInt(summary.total_items || 0);
        const avg = totalOrd > 0 ? totalRev / totalOrd : 0;
        
        setTotalRevenue(isNaN(totalRev) ? 0 : totalRev);
        setTotalOrders(isNaN(totalOrd) ? 0 : totalOrd);
        setItemsSold(isNaN(totalItems) ? 0 : totalItems);
        setAverageOrderValue(isNaN(avg) ? 0 : avg);
        
        console.log(`📅 Daily data for: ${today}`);
        
      } else {
        throw new Error(result.message || "API request failed");
      }
    } catch (error) {
      console.error('❌ Error fetching daily sales:', error);
      setError(error.message);
      // Set default values on error
      setTotalRevenue(0);
      setTotalOrders(0);
      setItemsSold(0);
      setAverageOrderValue(0);
    } finally {
      setLoading(false);
    }
  };

  const resetDailyData = () => {
    console.log("🔄 Resetting daily data...");
    
    // Reset all state to initial values
    setSalesData([]);
    setTopProducts([]);
    setTotalRevenue(0);
    setTotalOrders(0);
    setItemsSold(0);
    setAverageOrderValue(0);
    
    // Fetch fresh data for the new day
    fetchDailySales();
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchDailySales();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-PH', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        <p className="mt-2 text-pink-800/60">Loading daily sales data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-4">
          <svg className="w-12 h-12 text-pink-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold text-pink-800 mb-2">Error Loading Data</h3>
          <p className="text-pink-700 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors border border-pink-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Ensure averageOrderValue is a number before using toFixed
  const safeAverage = typeof averageOrderValue === 'number' ? averageOrderValue : 0;

  return (
    <>
      {/* Export Button at the top */}
      <div className="flex justify-end mb-6">
        <ExportButton activePeriod="daily" salesData={salesData} />
      </div>

      {/* UPDATED: Consistent card styling with WeeklySales and MonthlySales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* TODAY'S REVENUE */}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-[#d4789e26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-pink-800/80 text-xl font-semibold">Today's Revenue</h6>
            <div className="p-2 bg-pink-50 rounded-full border border-pink-200">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-pink-800/80 mb-2">
            ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center text-sm text-pink-800/60">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Today's Total</span>
          </div>
        </div>

        {/* TODAY'S ORDERS - Updated with blue icon to match WeeklySales */}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-[#d4789e26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-pink-800/80 text-xl font-semibold">Today's Orders</h6>
            <div className="p-2 bg-blue-50 rounded-full border border-blue-200">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-pink-800/80 mb-2">{totalOrders}</p>
          <div className="flex items-center text-sm text-pink-800/60">
            <span>Orders Today</span>
          </div>
        </div>

        {/* ITEMS SOLD TODAY - Updated with purple icon to match WeeklySales */}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-[#d4789e26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-pink-800/80 text-xl font-semibold">Items Sold</h6>
            <div className="p-2 bg-purple-50 rounded-full border border-purple-200">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-pink-800/80 mb-2">{itemsSold}</p>
          <div className="flex items-center text-sm text-pink-800/60">
            <span>Items Sold Today</span>
          </div>
        </div>

        {/* AVG ORDER VALUE TODAY - Updated with orange icon to match WeeklySales */}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-[#d4789e26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-pink-800/80 text-xl font-semibold">Average Order</h6>
            <div className="p-2 bg-orange-50 rounded-full border border-orange-200">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-pink-800/80 mb-2">
            ₱{safeAverage.toFixed(2)}
          </p>
          <div className="flex items-center text-sm text-pink-800/60">
            <span>Per Order Today</span>
          </div>
        </div>
      </div>

      {/* Today's Top Products */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-[#d4789e26]">
          <h3 className="text-lg font-semibold text-pink-800/80 mb-4">Today's Top Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center p-4 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm mr-4 border border-pink-200">
                  <span className="text-lg font-bold text-pink-800/80">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-pink-800/80">{product.product_name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-pink-800/60">
                      {product.total_quantity || 0} sold today
                    </span>
                    <span className="font-medium text-green-600">
                      ₱{Number(product.total_revenue || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODAY'S SALES TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-[#d4789e26]">
        <SalesTable data={salesData} filterType="daily" />
      </div>
    </>
  );
};

export default DailySales;