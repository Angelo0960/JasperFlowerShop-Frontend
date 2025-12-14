export default function SalesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sale Code
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Time
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Customer
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Staff
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Items
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment
              </span>
            </th>

            <th className="px-4 py-3 border">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Source
              </span>
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-sm font-medium">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                SC-001
              </span>
            </td>

            <td className="px-4 py-3 text-sm text-gray-600">Jan 1, 2025</td>
            <td className="px-4 py-3 text-sm text-gray-600">10:00 AM</td>
            <td className="px-4 py-3 text-sm">Juan Dela Cruz</td>
            <td className="px-4 py-3 text-sm">Staff 1</td>

            <td className="px-4 py-3 text-sm text-center">
              <span className="inline-flex w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs items-center justify-center">
                3
              </span>
            </td>

            <td className="px-4 py-3 text-sm font-semibold">
              ₱1,500.00
            </td>

            <td className="px-4 py-3 text-sm">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Cash
              </span>
            </td>

            <td className="px-4 py-3 text-sm text-gray-600">
              Direct Sale
            </td>
          </tr>
        </tbody>

        <tfoot className="bg-gray-50 border-t">
          <tr>
            <td colSpan="7" className="px-4 py-3 text-sm font-semibold text-right">
              Total:
            </td>
            <td className="px-4 py-3 text-sm font-bold">
              ₱1,500.00
            </td>
            <td className="px-4 py-3 text-sm">
              1 sale
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sales Summary</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">Total Sales</div>
            <div className="text-lg font-bold">1</div>
          </div>

          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">From Orders</div>
            <div className="text-lg font-bold text-blue-600">0</div>
          </div>

          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">Direct Sales</div>
            <div className="text-lg font-bold text-green-600">1</div>
          </div>

          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">Total Revenue</div>
            <div className="text-lg font-bold">₱1,500.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
