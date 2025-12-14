import SalesTable from "./SalesTable.jsx";

const MonthlySales = () => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Monthly Sales Dashboard
          </h1>
          <p className="text-gray-600">
            September 2025
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Revenue */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h6 className="text-xl font-semibold text-gray-800 mb-2">
            Total Revenue
          </h6>
          <p className="text-3xl font-bold text-gray-900">₱128,950.25</p>
          <p className="text-sm text-gray-600 mt-2">Last 30 Days</p>
        </div>

        {/* Orders */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h6 className="text-xl font-semibold text-gray-800 mb-2">
            Total Orders
          </h6>
          <p className="text-3xl font-bold text-gray-900">285</p>
          <p className="text-sm text-gray-600 mt-2">Last 30 Days</p>
        </div>

        {/* Items Sold */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h6 className="text-xl font-semibold text-gray-800 mb-2">
            Items Sold
          </h6>
          <p className="text-3xl font-bold text-gray-900">1,250</p>
          <p className="text-sm text-gray-600 mt-2">Last 30 Days</p>
        </div>

        {/* Average Order */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h6 className="text-xl font-semibold text-gray-800 mb-2">
            Average Order Value
          </h6>
          <p className="text-3xl font-bold text-gray-900">₱452.46</p>
          <p className="text-sm text-gray-600 mt-2">Per Order</p>
        </div>
      </div>

      {/* SALES TREND (UI PLACEHOLDER) */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Monthly Sales Trend
        </h3>
        <div className="h-80 flex items-center justify-center text-gray-400 border rounded">
          Chart Placeholder
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Top Selling Products
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded shadow mr-4">
                <span className="font-bold">#{item}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">
                  Product Name
                </h4>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">85 sold this month</span>
                  <span className="text-green-600 font-medium">
                    ₱5,200.00
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Monthly Sales Details</h3>
          <p className="text-sm text-gray-600">Detailed breakdown of all sales in the last 30 days</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
          >
            ↻ Refresh
          </button>
        </div>
        <SalesTable />
      </div>
    </>
  );
};

export default MonthlySales;