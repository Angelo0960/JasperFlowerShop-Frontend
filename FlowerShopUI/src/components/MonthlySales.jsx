import { useEffect, useState } from "react";
import SalesTable from "./SalesTable.jsx";
import ExportButton from "./ExportButton.jsx";  // Add this import
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlySales = () => {
  const [salesData, setSalesData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsSold, setItemsSold] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  const fetchMonthlySales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📊 Fetching monthly sales...");
      
      const response = await fetch('http://localhost:3000/api/reports/sales?period=monthly');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("📦 Monthly API Response:", result);
      
      if (result.success) {
        // Extract data from the response structure
        let rawData = [];
        let summary = {};
        let dailyBreakdown = [];
        let topProductsData = [];
        
        if (result.data) {
          console.log("📊 API data structure:", {
            rawData: result.data.rawData,
            summary: result.data.summary,
            dailyBreakdown: result.data.dailyBreakdown,
            topProducts: result.data.topProducts
          });
          
          rawData = result.data.rawData || [];
          summary = result.data.summary || {};
          dailyBreakdown = result.data.dailyBreakdown || [];
          topProductsData = result.data.topProducts || [];
        }
        
        console.log(`✅ Monthly sales loaded: ${rawData.length} records`);
        
        // Ensure arrays
        if (!Array.isArray(rawData)) rawData = [];
        if (!Array.isArray(dailyBreakdown)) dailyBreakdown = [];
        if (!Array.isArray(topProductsData)) topProductsData = [];
        
        setSalesData(rawData);
        setChartData(dailyBreakdown);
        setTopProducts(topProductsData);
        
        // DEBUG: Log the summary values
        console.log("📊 Summary data:", summary);
        console.log("📊 Summary types:", {
          total_sales: typeof summary.total_sales,
          transaction_count: typeof summary.transaction_count,
          total_items: typeof summary.total_items,
          average_transaction: typeof summary.average_transaction
        });
        
        // Calculate stats - ensure they're numbers with better parsing
        const totalRev = parseFloat(summary.total_sales || summary.totalSales || 0);
        const totalOrd = parseInt(summary.transaction_count || rawData.length || 0, 10);
        const totalItems = parseInt(summary.total_items || 0, 10);
        
        // Calculate average - handle division by zero
        let avg = 0;
        if (totalOrd > 0) {
          avg = totalRev / totalOrd;
        }
        
        // If average_transaction exists in summary, use it
        if (summary.average_transaction !== undefined && summary.average_transaction !== null) {
          avg = parseFloat(summary.average_transaction);
        }
        
        // Set state with validated numbers
        const safeTotalRev = isNaN(totalRev) ? 0 : Number(totalRev);
        const safeTotalOrd = isNaN(totalOrd) ? 0 : Number(totalOrd);
        const safeTotalItems = isNaN(totalItems) ? 0 : Number(totalItems);
        const safeAvg = isNaN(avg) ? 0 : Number(avg);
        
        console.log("📊 Setting state values:", {
          totalRevenue: safeTotalRev,
          totalOrders: safeTotalOrd,
          itemsSold: safeTotalItems,
          averageOrderValue: safeAvg
        });
        
        setTotalRevenue(safeTotalRev);
        setTotalOrders(safeTotalOrd);
        setItemsSold(safeTotalItems);
        setAverageOrderValue(safeAvg);
        
      } else {
        throw new Error(result.message || "API request failed");
      }
    } catch (error) {
      console.error('❌ Error fetching monthly sales:', error);
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

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    fetchMonthlySales();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        <p className="mt-2 text-pink-800/60">Loading monthly sales data...</p>
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

  // Debug: Log the current state values
  console.log("🔄 Render state:", {
    averageOrderValue,
    type: typeof averageOrderValue,
    isNumber: typeof averageOrderValue === 'number',
    value: averageOrderValue
  });

  // Ensure averageOrderValue is a number before using toFixed
  const safeAverage = typeof averageOrderValue === 'number' && !isNaN(averageOrderValue) 
    ? averageOrderValue 
    : 0;

  return (
    <>
      {/* Export Button at the top */}
      <div className="flex justify-end mb-6">
        <ExportButton activePeriod="monthly" salesData={salesData} />
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
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span>Last 30 Days</span>
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
            <span>Last 30 Days</span>
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
            <span>Last 30 Days</span>
          </div>
        </div>

        {/* AVG ORDER VALUE - FIXED with safeAverage */}
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

      {/* Monthly Sales Trend Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-[#d4789e26]">
          <h3 className="text-lg font-semibold text-pink-800/80 mb-4">Monthly Sales Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₱${Number(value).toFixed(2)}`, 'Revenue']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke="#db2777"  // Changed to pink color
                  strokeWidth={2}
                  name="Daily Revenue"
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

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-[#d4789e26]">
          <h3 className="text-lg font-semibold text-pink-800/80 mb-4">Top Selling Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm mr-4 border border-pink-200">
                  <span className="text-lg font-bold text-pink-800/80">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-pink-800/80">{product.product_name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-pink-800/60">
                      {product.total_quantity || 0} sold
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

      {/* SALES TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-[#d4789e26]">
        <div className="p-4 border-b border-pink-200">
          <h3 className="text-lg font-semibold text-pink-800/80">Monthly Sales Details</h3>
          <p className="text-sm text-pink-800/60">Detailed breakdown of all sales in the last 30 days</p>
          <button 
            onClick={retryFetch}
            className="mt-2 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors text-sm font-medium border border-pink-700"
          >
            ↻ Refresh
          </button>
        </div>
        <SalesTable data={salesData} filterType="monthly" />
      </div>
    </>
  );
};

export default MonthlySales;