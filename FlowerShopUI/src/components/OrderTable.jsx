// File: OrderTable.jsx
import { useState } from "react";

export default function OrderTable({ data, refreshOrders, isLoading }) {
  const [updatingId, setUpdatingId] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((order) => {
            const isUpdating = updatingId === order.id;
            
            return (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                      <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        Order Code
                      </div>
                      {order.staff_name && (
                        <div className="text-xs text-gray-500">
                          by Staff Name
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Customer Name</div>
                  {order.customer_phone && (
                    <div className="text-xs text-gray-500">Customer Phone</div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mr-2">
                      0
                    </span>
                    <div className="text-sm text-gray-600">
                      View Items
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ₱0.00
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border-gray-300 border`}>
                    Status
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Date
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {/* View Details Button */}
                  <button
                    onClick={() => {}}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                  >
                    View
                  </button>
                  
                  {/* Status Update Buttons */}
                  <button
                    onClick={() => {}}
                    disabled={isUpdating || isLoading}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                  >
                    Start
                  </button>
                  
                  <button
                    onClick={() => {}}
                    disabled={isUpdating || isLoading}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                  >
                    Complete
                  </button>
                  
                  {/* Cancel Button */}
                  <button
                    onClick={() => {}}
                    disabled={isUpdating || isLoading}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {/* View Sales Record */}
                  <button
                    onClick={() => {}}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm font-medium transition-colors"
                  >
                    View Sale
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}