import { useEffect, useState } from "react";
import SalesTable from "./SalesTable.jsx";
import ExportButton from "./ExportButton.jsx";


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

  // Function to extract top products from sales data - IMPROVED VERSION
  const extractTopProductsFromSalesData = (sales) => {
    console.log("🔍 Analyzing sales data for top products...");
    console.log("📊 Sales data sample (first 3):", sales.slice(0, 3));
    
    const productMap = {};
    let totalItemsProcessed = 0;
    
    // Process each sale to extract product information
    sales.forEach((sale, saleIndex) => {
      // Check multiple possible structures for product information
      let productsFound = false;
      
      // Method 1: Check if sale has items array
      if (sale.items && Array.isArray(sale.items)) {
        console.log(`Sale ${saleIndex} has items array:`, sale.items);
        sale.items.forEach(item => {
          processProductItem(item);
          totalItemsProcessed++;
        });
        productsFound = true;
      }
      
      // Method 2: Check if sale has products array (alternative naming)
      if (!productsFound && sale.products && Array.isArray(sale.products)) {
        console.log(`Sale ${saleIndex} has products array:`, sale.products);
        sale.products.forEach(item => {
          processProductItem(item);
          totalItemsProcessed++;
        });
        productsFound = true;
      }
      
      // Method 3: Check if sale has line_items array (common in e-commerce)
      if (!productsFound && sale.line_items && Array.isArray(sale.line_items)) {
        console.log(`Sale ${saleIndex} has line_items array:`, sale.line_items);
        sale.line_items.forEach(item => {
          processProductItem(item);
          totalItemsProcessed++;
        });
        productsFound = true;
      }
      
      // Method 4: Check if sale has order_items array
      if (!productsFound && sale.order_items && Array.isArray(sale.order_items)) {
        console.log(`Sale ${saleIndex} has order_items array:`, sale.order_items);
        sale.order_items.forEach(item => {
          processProductItem(item);
          totalItemsProcessed++;
        });
        productsFound = true;
      }
      
      // Method 5: Check if sale has product details directly (for simple transactions)
      if (!productsFound && (sale.product_name || sale.product_id)) {
        console.log(`Sale ${saleIndex} has direct product info:`, sale);
        processProductItem(sale);
        totalItemsProcessed++;
        productsFound = true;
      }
      
      if (!productsFound) {
        console.log(`Sale ${saleIndex} has no product info structure. Sale object:`, sale);
      }
    });
    
    // Helper function to process a product item
    function processProductItem(item) {
      const productId = item.product_id || item.id || item.productId || 'unknown_' + Math.random();
      const productName = item.product_name || item.name || item.productName || 
                         item.description || 'Unknown Product';
      const quantity = parseInt(item.quantity || item.qty || item.amount || 1);
      const price = parseFloat(item.unit_price || item.price || item.unitPrice || 
                              item.total_price || item.totalPrice || 0);
      
      // Debug each item
      console.log(`  Processing item: ${productName} (ID: ${productId}), Qty: ${quantity}, Price: ${price}`);
      
      if (!productMap[productId]) {
        productMap[productId] = {
          product_id: productId,
          product_name: productName,
          total_quantity: 0,
          total_revenue: 0
        };
      }
      
      productMap[productId].total_quantity += quantity;
      productMap[productId].total_revenue += (price * quantity);
    }
    
    console.log(`📊 Total items processed: ${totalItemsProcessed}`);
    console.log("📊 Product map:", productMap);
    
    // Convert to array and sort by revenue
    const productsArray = Object.values(productMap);
    const sortedProducts = productsArray.sort((a, b) => b.total_revenue - a.total_revenue);
    
    console.log("📊 Sorted top products:", sortedProducts);
    
    // Take top 6 products or all if less than 6
    return sortedProducts.slice(0, 6);
  };

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
        }
        
        console.log(`✅ Monthly sales loaded: ${rawData.length} records`);
        
        // Ensure arrays
        if (!Array.isArray(rawData)) rawData = [];
        if (!Array.isArray(dailyBreakdown)) dailyBreakdown = [];
        
        setSalesData(rawData);
        setChartData(dailyBreakdown);
        
        // Extract top products from sales data
        const extractedTopProducts = extractTopProductsFromSalesData(rawData);
        console.log("📊 Extracted top products:", extractedTopProducts);
        setTopProducts(extractedTopProducts);
        
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

      
      {/* SALES TABLE - SIMPLIFIED LIKE DAILY SALES */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-[#d4789e26]">
        <SalesTable data={salesData} filterType="monthly" />
      </div>
    </>
  );
};

export default MonthlySales;