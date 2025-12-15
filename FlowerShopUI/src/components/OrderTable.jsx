import { useState } from "react";

export default function OrderTable({ data, refreshOrders, isLoading }) {
  const [updatingId, setUpdatingId] = useState(null);

  const updateStatus = async (id, currentStatus, newStatus) => {
    if (updatingId) return; // Prevent multiple simultaneous updates
    
    try {
      setUpdatingId(id);
      
      console.log(`🔄 Updating order ${id} from ${currentStatus} to ${newStatus}`);
      
      // FIXED: Changed from /api/orders/${id}/status to /orders/update-status/${id}
      const response = await fetch(`http://localhost:3000/orders/update-status/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ status: newStatus }), // Removed staff_id since your backend doesn't expect it
      });

      console.log("📡 Update response status:", response.status);

      // First check if response is OK
      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Server error response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Then try to parse as JSON
      const result = await response.json();
      console.log("✅ Update result:", result);

      if (!result.success) {
        throw new Error(result.message || "Update failed");
      }

      console.log("🔄 Refreshing orders list...");
      refreshOrders(); // Refresh UI
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(`Failed to update order: ${error.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatStatus = (status) => {
    return status.replace('-', ' ').toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
      case 'in-progress': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
  };

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
            const statusColors = getStatusColor(order.status);
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
                        {order.order_code}
                      </div>
                      {order.staff_name && (
                        <div className="text-xs text-gray-500">
                          by {order.staff_name}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                  {order.customer_phone && (
                    <div className="text-xs text-gray-500">{order.customer_phone}</div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mr-2">
                      {order.items_count}
                    </span>
                    <div className="text-sm text-gray-600">
                      {Array.isArray(order.items) 
                        ? order.items.map(item => item.name).join(', ')
                        : 'View Items'}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatCurrency(order.total_amount)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                    {formatStatus(order.status)}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(order.created_at || order.formatted_date)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {/* View Details Button */}
                  <button
                    onClick={() => alert(`Order Details:\nOrder ID: ${order.id}\nCode: ${order.order_code}\nCustomer: ${order.customer_name}\nAmount: ${formatCurrency(order.total_amount)}\nItems: ${order.items_count}\nStatus: ${order.status}`)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                  >
                    View
                  </button>
                  
                  {/* Status Update Buttons */}
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, order.status, "in-progress")}
                      disabled={isUpdating || isLoading}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                    >
                      {isUpdating ? 'Processing...' : 'Start'}
                    </button>
                  )}
                  
                  {order.status === "in-progress" && (
                    <button
                      onClick={() => updateStatus(order.id, order.status, "completed")}
                      disabled={isUpdating || isLoading}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                    >
                      {isUpdating ? 'Completing...' : 'Complete'}
                    </button>
                  )}
                  
                  {/* Cancel Button (for pending and in-progress) */}
                  {(order.status === "pending" || order.status === "in-progress") && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          updateStatus(order.id, order.status, "cancelled");
                        }
                      }}
                      disabled={isUpdating || isLoading}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {/* View Sales Record for completed orders */}
                    {order.status === "completed" && (
                      <button
                        onClick={async () => {
                          try {
                            // Fetch sales data for this order
                            const response = await fetch(`http://localhost:3000/orders/${order.id}/sales`);
                            const result = await response.json();
                            
                            if (result.success && result.data.sales.length > 0) {
                              const sale = result.data.sales[0];
                              alert(`Sales Record Created!\n\nSale Code: ${sale.sale_code}\nDate: ${sale.sale_date}\nTime: ${sale.sale_time}\nCustomer: ${sale.customer_name}\nAmount: ${formatCurrency(sale.total_amount)}\nItems: ${sale.items_count}`);
                            } else {
                              alert('No sales record found for this order');
                            }
                          } catch (error) {
                            console.error("Error fetching sales:", error);
                            alert('Could not fetch sales information');
                          }
                        }}
                        className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm font-medium transition-colors"
                      >
                        View Sale
                      </button>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}