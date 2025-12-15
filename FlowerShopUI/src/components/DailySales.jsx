import { useEffect, useState } from "react";
import SalesTable from "./SalesTable.jsx";
import ExportButton from "./ExportButton.jsx";  
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailySales = () => {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState([]);
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
    
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const storedDate = new Date(currentDate);
      
      if (
        now.getDate() !== storedDate.getDate() ||
        now.getMonth() !== storedDate.getMonth() ||
        now.getFullYear() !== storedDate.getFullYear()
      ) {
        console.log("🔄 New day detected, resetting data...");
        setCurrentDate(now);
        resetDailyData();
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [currentDate]);

  const fetchDailySales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📊 Fetching daily sales...");
      
      const today = new Date().toISOString().split('T')[0]; 
      const response = await fetch(`http://localhost:3000/sales/reports/daily?date=${today}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("📦 Daily API Response:", result);
      
      if (result.success) {
      
        let rawData = [];
        let summary = {};
        let hourlyBreakdown = [];
        let topProductsData = [];
        
        if (result.data) {
          rawData = result.data.rawData || [];
          summary = result.data.summary || {};
          hourlyBreakdown = result.data.hourlyBreakdown || [];
          topProductsData = result.data.topProducts || [];
        }
        
        console.log(`✅ Daily sales loaded: ${rawData.length} records`);
        
       
        if (!Array.isArray(rawData)) rawData = [];
        if (!Array.isArray(hourlyBreakdown)) hourlyBreakdown = [];
        if (!Array.isArray(topProductsData)) topProductsData = [];
        
        setSalesData(rawData);
        
        const formattedChartData = formatHourlyData(hourlyBreakdown);
        setChartData(formattedChartData);
        
        setTopProducts(topProductsData);
        
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
      setTotalRevenue(0);
      setTotalOrders(0);
      setItemsSold(0);
      setAverageOrderValue(0);
    } finally {
      setLoading(false);
    }
  };

  const formatHourlyData = (hourlyData) => {
    if (!Array.isArray(hourlyData) || hourlyData.length === 0) {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map(hour => ({
        hour: `${hour}:00`,
        revenue: 0,
        transactions: 0
      }));
    }
    
    return hourlyData.map(hour => ({
      hour: `${hour.hour}:00`,
      revenue: hour.revenue || 0,
      transactions: hour.transactions || 0
    }));
  };

  const resetDailyData = () => {
    console.log("🔄 Resetting daily data...");
    
    setSalesData([]);
    setChartData([]);
    setTopProducts([]);
    setTotalRevenue(0);
    setTotalOrders(0);
    setItemsSold(0);
    setAverageOrderValue(0);
    
    fetchDailySales();
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchDailySales();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p className="mt-2 text-gray-600">Loading daily sales data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={retryFetch}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const safeAverage = typeof averageOrderValue === 'number' ? averageOrderValue : 0;

  return (
    <>
      {}
      <div className="flex justify-end mb-6">
        <ExportButton activePeriod="daily" salesData={salesData} />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daily Sales Dashboard</h1>
          <p className="text-gray-600">
            {formatDate(currentDate)} • Data resets at midnight
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetDailyData}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium flex items-center"
            title="Reset for new day"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Day
          </button>
          <button 
            onClick={retryFetch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-slate-800 text-xl font-semibold">Today's Revenue</h6>
            <div className="p-2 bg-green-50 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center text-sm text-slate-600">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span>Today's Total</span>
          </div>
        </div>

        {}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-slate-800 text-xl font-semibold">Today's Orders</h6>
            <div className="p-2 bg-blue-50 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">{totalOrders}</p>
          <div className="flex items-center text-sm text-slate-600">
            <span>Orders Today</span>
          </div>
        </div>

        {}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-slate-800 text-xl font-semibold">Items Sold</h6>
            <div className="p-2 bg-purple-50 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">{itemsSold}</p>
          <div className="flex items-center text-sm text-slate-600">
            <span>Items Sold Today</span>
          </div>
        </div>

        {}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-slate-800 text-xl font-semibold">Average Order</h6>
            <div className="p-2 bg-orange-50 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            ₱{safeAverage.toFixed(2)}
          </p>
          <div className="flex items-center text-sm text-slate-600">
            <span>Per Order Today</span>
          </div>
        </div>
      </div>

      {}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hourly Sales Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₱${Number(value).toFixed(2)}`, 'Revenue']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Hourly Revenue"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Transactions"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Top Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm mr-4">
                  <span className="text-lg font-bold text-gray-700">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{product.product_name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">
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

      {}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Today's Sales Details</h3>
          <p className="text-sm text-gray-600">
            Detailed breakdown of all sales for {formatDate(currentDate)}
          </p>
          <div className="mt-2 flex gap-2">
            <button 
              onClick={retryFetch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              ↻ Refresh
            </button>
            <button
              onClick={resetDailyData}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Reset Day
            </button>
          </div>
        </div>
        <SalesTable data={salesData} filterType="daily" />
      </div>
    </>
  );
};

export default DailySales;