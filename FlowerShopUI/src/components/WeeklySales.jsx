import SalesTable from "./SalesTab.jsx";

const WeeklySales = () => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Weekly Sales Dashboard
          </h1>
          <p className="text-gray-600">
            Week of September 18-24, 2025
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
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
          <p className="text-3xl font-bold text-gray-900">₱45,678.90</p>
          <p className="text-sm text-gray-600 mt-2">Last 7 Days</p>
        </div>

        {/* Orders */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h6 className="text-xl font-semibold text-gray-800 mb-2">
            Total Orders
          </h6>
          <p className="text-3xl font-bold text-gray-900">95</p>
          <p className="text-sm text-gray-600 mt-2">Last 7 Days</p>
        </div>

        {/* Items Sold */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h6 className="text-xl font-semibold text-gray-800 mb-2">
            Items Sold
          </h6>
          <p className="text-3xl font-bold text-gray-900">420</p>
          <p className="text-sm text-gray-600 mt-2">Last 7 Days</p>
        </div>

        {/* Average Order */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h6 className="text-xl font-semibold text-gray-800 mb-2">
            Average Order Value
          </h6>
          <p className="text-3xl font-bold text-gray-900">₱480.83</p>
          <p className="text-sm text-gray-600 mt-2">Per Order</p>
        </div>
      </div>

      {/* SALES TREND (UI PLACEHOLDER) */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Weekly Sales Trend
        </h3>
        <div className="h-80 flex items-center justify-center text-gray-400 border rounded">
          Chart Placeholder
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Weekly Sales Details</h3>
              <p className="text-sm text-gray-600">
                95 sales recorded this week
              </p>
            </div>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
            >
              ↻ Refresh
            </button>
          </div>
        </div>
        <SalesTable />
      </div>
    </>
  );
};

export default WeeklySales;