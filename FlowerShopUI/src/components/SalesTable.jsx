export default function SalesTable() {
  // Static data defined inside the component
  const sampleData = [
    {
      sale_code: "SALE-001",
      sale_date: "2025-09-18",
      sale_time: "10:30 AM",
      customer_name: "John Doe",
      staff_name: "Sarah Smith",
      items_count: 3,
      total_amount: 450.75,
      payment_method: "cash",
      order_id: "ORD-123"
    },
    {
      sale_code: "SALE-002",
      sale_date: "2025-09-18",
      sale_time: "11:45 AM",
      customer_name: "Jane Smith",
      staff_name: "Mike Johnson",
      items_count: 5,
      total_amount: 925.50,
      payment_method: "card",
      order_id: null
    },
    {
      sale_code: "SALE-003",
      sale_date: "2025-09-18",
      sale_time: "02:15 PM",
      customer_name: "Robert Brown",
      staff_name: "Sarah Smith",
      items_count: 2,
      total_amount: 210.00,
      payment_method: "gcash",
      order_id: "ORD-124"
    },
    {
      sale_code: "SALE-004",
      sale_date: "2025-09-18",
      sale_time: "04:30 PM",
      customer_name: "Emily Davis",
      staff_name: "Mike Johnson",
      items_count: 1,
      total_amount: 120.00,
      payment_method: "cash",
      order_id: null
    }
  ];

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
          {sampleData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  {row.sale_code}
                </span>
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {formatDate(row.sale_date)}
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {row.sale_time}
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                {row.customer_name}
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {row.staff_name}
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {row.items_count}
                </span>
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatCurrency(Number(row.total_amount))}
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                  ${row.payment_method === 'cash' ? 'bg-green-100 text-green-800' :
                    row.payment_method === 'card' ? 'bg-blue-100 text-blue-800' :
                    row.payment_method === 'gcash' ? 'bg-teal-100 text-teal-800' :
                    'bg-gray-100 text-gray-800'
                  }
                `}>
                  {row.payment_method}
                </span>
              </td>
              
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                {row.order_id ? (
                  <div className="flex flex-col">
                    <span className="font-mono bg-blue-50 px-2 py-1 rounded text-xs mb-1">
                      Order #{row.order_id}
                    </span>
                    <span className="text-xs text-blue-600">
                      View Order
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Direct Sale</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        
        <tfoot className="bg-gray-50 border-t">
          <tr>
            <td colSpan="7" className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
              Total:
            </td>
            <td className="px-4 py-3 text-sm font-bold text-gray-900">
              {formatCurrency(sampleData.reduce((sum, row) => sum + Number(row.total_amount), 0))}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
              {sampleData.length} sales
            </td>
          </tr>
        </tfoot>
      </table>
      
      {/* Sales Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sales Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">Total Sales</div>
            <div className="text-lg font-bold">{sampleData.length}</div>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">From Orders</div>
            <div className="text-lg font-bold text-blue-600">
              {sampleData.filter(row => row.order_id).length}
            </div>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">Direct Sales</div>
            <div className="text-lg font-bold text-green-600">
              {sampleData.filter(row => !row.order_id).length}
            </div>
          </div>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-xs text-gray-600">Total Revenue</div>
            <div className="text-lg font-bold">
              {formatCurrency(sampleData.reduce((sum, row) => sum + Number(row.total_amount), 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}