import { useState } from "react";

export default function SalesTable({ data, filterType }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const SortableHeader = ({ children, sortKey }) => (
    <th 
      className="px-4 py-3 border cursor-pointer hover:bg-gray-50"
      onClick={() => sortData(sortKey)}
    >
      <div className="flex items-center justify-between">
        {children}
        {sortConfig.key === sortKey && (
          <span className="ml-1">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader sortKey="sale_code">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sale Code
              </span>
            </SortableHeader>
            
            <SortableHeader sortKey="sale_date">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </span>
            </SortableHeader>
            
            <SortableHeader sortKey="sale_time">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Time
              </span>
            </SortableHeader>
            
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
            
            <SortableHeader sortKey="items_count">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Items
              </span>
            </SortableHeader>
            
            <SortableHeader sortKey="total_amount">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </span>
            </SortableHeader>
            
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
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {row.sale_code || '-'}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(row.sale_date || row.formatted_date)}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {row.sale_time || row.formatted_time || '-'}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                  {row.customer_name || '-'}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {row.staff_name || row.staff || '-'}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {row.items_count || row.items || 0}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(Number(row.total_amount || row.amount || 0))}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                    ${row.payment_method === 'cash' ? 'bg-green-100 text-green-800' :
                      row.payment_method === 'card' ? 'bg-blue-100 text-blue-800' :
                      row.payment_method === 'gcash' ? 'bg-teal-100 text-teal-800' :
                      row.payment_method === 'order_payment' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  `}>
                    {row.payment_method === 'order_payment' ? 'From Order' : row.payment_method || '-'}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {row.order_id ? (
                    <div className="flex flex-col">
                      <span className="font-mono bg-blue-50 px-2 py-1 rounded text-xs mb-1">
                        Order #{row.order_id}
                      </span>
                      <a 
                        href={`/orders/${row.order_id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          // You can add functionality to view the order details
                          alert(`View order details for Order #${row.order_id}`);
                        }}
                      >
                        View Order
                      </a>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">Direct Sale</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-4 py-8 text-gray-500 text-center"
                colSpan="9"
              >
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg">No sales data available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {filterType === "daily" ? "No sales recorded today" :
                     filterType === "weekly" ? "No sales recorded this week" :
                     filterType === "monthly" ? "No sales recorded this month" :
                     "No sales data found"}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        
        {sortedData.length > 0 && (
          <tfoot className="bg-gray-50 border-t">
            <tr>
              <td colSpan="7" className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                Total:
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                {formatCurrency(sortedData.reduce((sum, row) => sum + Number(row.total_amount || row.amount || 0), 0))}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {sortedData.length} {sortedData.length === 1 ? 'sale' : 'sales'}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      
      {/* Sales Summary */}
      {sortedData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Sales Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-xs text-gray-600">Total Sales</div>
              <div className="text-lg font-bold">{sortedData.length}</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-xs text-gray-600">From Orders</div>
              <div className="text-lg font-bold text-blue-600">
                {sortedData.filter(row => row.order_id).length}
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-xs text-gray-600">Direct Sales</div>
              <div className="text-lg font-bold text-green-600">
                {sortedData.filter(row => !row.order_id).length}
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm">
              <div className="text-xs text-gray-600">Total Revenue</div>
              <div className="text-lg font-bold">
                {formatCurrency(sortedData.reduce((sum, row) => sum + Number(row.total_amount || row.amount || 0), 0))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}