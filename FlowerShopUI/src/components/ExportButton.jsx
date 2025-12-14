const ExportButton = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Format Selector */}
      <div className="relative">
        <select
          className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="csv">CSV (.csv)</option>
          <option value="excel">Excel (.xlsx)</option>
          <option value="pdf">PDF (.pdf)</option>
        </select>
        <div className="text-xs text-gray-500 mt-1 text-center">Format</div>
      </div>

      {/* Current Period Display */}
      <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 min-w-[120px]">
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700 font-medium">Today</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">Period</div>
      </div>

      {/* Export Button */}
      <button
        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 min-w-[200px] justify-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Daily Data (CSV)
      </button>
    </div>
  );
};

export default ExportButton;