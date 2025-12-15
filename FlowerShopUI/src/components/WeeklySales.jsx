import { useEffect, useState } from "react";
import SalesTable from "./SalesTable.jsx";
import ExportButton from "./ExportButton.jsx";  
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklySales = () => {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsSold, setItemsSold] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeeklySales();
  }, []);

  const fetchWeeklySales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📊 Fetching weekly sales...");
      
      
const endpoints = [
  "http://localhost:3000/api/reports/sales?period=weekly",  
  "http://localhost:3000/sales/reports/weekly"  
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
        throw new Error("No working API endpoint found");
      }
      
      console.log("📦 API Response:", result);
      
      if (result.success) {
        
        let rawData = [];
        let summary = {};
        let dailyBreakdown = [];
        
        if (result.data) {
          rawData = result.data.rawData || [];
          summary = result.data.summary || {};
          dailyBreakdown = result.data.dailyBreakdown || [];
        }
        
        console.log(`📊 Processed ${rawData.length} sales records`);
        
        
        if (!Array.isArray(rawData)) rawData = [];
        if (!Array.isArray(dailyBreakdown)) dailyBreakdown = [];
        
        setSalesData(rawData);
        setChartData(dailyBreakdown);
        
        
        const totalRev = parseFloat(summary.total_sales || summary.totalSales || 0);
        const totalOrd = parseInt(summary.transaction_count || rawData.length || 0, 10);
        const totalItems = parseInt(summary.total_items || 0, 10);
        
        
        let avg = 0;
        if (totalOrd > 0) {
          avg = totalRev / totalOrd;
        }
        
        
        if (summary.average_transaction !== undefined && summary.average_transaction !== null) {
          avg = parseFloat(summary.average_transaction);
        }
        
        
        setTotalRevenue(isNaN(totalRev) ? 0 : totalRev);
        setTotalOrders(isNaN(totalOrd) ? 0 : totalOrd);
        setItemsSold(isNaN(totalItems) ? 0 : totalItems);
        setAverageOrderValue(isNaN(avg) ? 0 : avg);
        
      } else {
        throw new Error(result.message || "API request failed");
      }
    } catch (error) {
      console.error('❌ Error fetching weekly sales:', error);
      setError(error.message);
      
      setTotalRevenue(0);
      setTotalOrders(0);
      setItemsSold(0);
      setAverageOrderValue(0);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchWeeklySales();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        <p className="mt-2 text-pink-800/60">Loading weekly sales data...</p>
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
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors border border-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  
  const safeAverage = typeof averageOrderValue === 'number' && !isNaN(averageOrderValue) 
    ? averageOrderValue 
    : 0;

  return (
    <>
      {/* Export Button at the top */}
      <div className="flex justify-end mb-6">
        <ExportButton activePeriod="weekly" salesData={salesData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* TOTAL REVENUE */}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-[#d4789e26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-pink-800/80 text-xl font-semibold">Total Revenue</h6>
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
            <span>Last 7 Days</span>
          </div>
        </div>

        {/* TOTAL ORDERS */}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-[#d4789e26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-pink-800/80 text-xl font-semibold">Total Orders</h6>
            <div className="p-2 bg-blue-50 rounded-full border border-blue-200">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-pink-800/80 mb-2">{totalOrders}</p>
          <div className="flex items-center text-sm text-pink-800/60">
            <span>Last 7 Days</span>
          </div>
        </div>

        {/* ITEMS SOLD */}
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
            <span>Last 7 Days</span>
          </div>
        </div>

        {/* AVERAGE ORDER VALUE - FIXED with safeAverage */}
        <div className="relative flex flex-col my-6 bg-white shadow-sm border border-[#d4789e26] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h6 className="text-pink-800/80 text-xl font-semibold">Average Order Value</h6>
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
            <span>Per Order</span>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-[#d4789e26]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-pink-800/80">Weekly Sales Trend</h3>
            <span className="text-sm text-pink-800/60">
              {chartData.length} days of data
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Revenue (₱)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`₱${Number(value).toFixed(2)}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar 
                  dataKey="totalSales" 
                  fill="#db2777"  
                  name="Daily Revenue" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SALES TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-[#d4789e26]">
        <div className="p-4 border-b border-pink-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-pink-800/80">Weekly Sales Details</h3>
              <p className="text-sm text-pink-800/60">
                {salesData.length > 0 
                  ? `${salesData.length} sales recorded this week` 
                  : 'No sales recorded yet this week'}
              </p>
            </div>
            <button 
              onClick={retryFetch}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors text-sm font-medium border border-pink-700"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
        <SalesTable data={salesData} filterType="weekly" />
      </div>
    </>
  );
};

export default WeeklySales;