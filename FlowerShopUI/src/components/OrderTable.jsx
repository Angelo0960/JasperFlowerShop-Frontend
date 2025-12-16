import { useState } from "react";
import OrderDetailsModal from "./OrderModal.jsx";

export default function OrderTable({ data, refreshOrders, isLoading, onOrderStatusUpdate }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewingOrder, setViewingOrder] = useState(null);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  const updateStatus = async (id, currentStatus, newStatus, isAutoRefreshAction = false) => {
    if (updatingId) return;
    
    try {
      setUpdatingId(id);
      
      console.log(`🔄 Updating order ${id} from ${currentStatus} to ${newStatus}`);
      
      const response = await fetch(`http://localhost:3000/orders/update-status/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ status: newStatus }),
      });

      console.log("📡 Update response status:", response.status);

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Server error response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Update result:", result);

      if (!result.success) {
        throw new Error(result.message || "Update failed");
      }

      console.log("🔄 Updating UI...");
      
      // Only trigger instant UI update for Start and Complete buttons
      if (isAutoRefreshAction && onOrderStatusUpdate) {
        console.log("⚡ Triggering instant auto-refresh for action:", currentStatus, "->", newStatus);
        onOrderStatusUpdate(id, currentStatus, newStatus);
        
        // Also refresh the current tab data after a short delay
        setTimeout(() => {
          if (refreshOrders) refreshOrders();
        }, 300);
      } else {
        // For Cancel button, just refresh normally
        console.log("↻ Regular refresh for cancel action");
        if (refreshOrders) refreshOrders();
      }
      
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

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div>
      {/* Pagination Controls - Top */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0">
        <div className="text-sm text-pink-800/60">
        
        </div>
        
        <div className="flex items-center space-x-4 p-2 pt-4 pr-4">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-pink-800/60">Show:</span>
            <select 
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-[#d4789e26] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-pink-800/70"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          
          {/* Page navigation */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l border border-[#d4789e26] bg-[#f8f3ed] text-pink-800/70 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              «
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[#d4789e26] bg-[#f8f3ed] text-pink-800/70 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ‹
            </button>
            
            {/* Page numbers */}
            {getPageNumbers().map((pageNumber, index) => (
              pageNumber === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1 text-pink-800/40">
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-3 py-1 border border-[#d4789e26] text-sm ${
                    currentPage === pageNumber
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'bg-[#f8f3ed] text-pink-800/70 hover:bg-pink-50'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-[#d4789e26] bg-[#f8f3ed] text-pink-800/70 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ›
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r border border-[#d4789e26] bg-[#f8f3ed] text-pink-800/70 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-[#d4789e26]">
        <table className="min-w-full divide-y divide-pink-200">
          <thead className="bg-pink-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-800/70 uppercase tracking-wider">
                Order Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-800/70 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-800/70 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-800/70 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-800/70 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-800/70 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-pink-800/70 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-pink-100">
            {currentItems.length === 0 ? (
              <tr>
                
              </tr>
            ) : (
              currentItems.map((order) => {
                const statusColors = getStatusColor(order.status);
                const isUpdating = updatingId === order.id;
                
                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-pink-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-pink-100 rounded-lg border border-pink-200">
                          <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-pink-800/80">
                            {order.order_code}
                          </div>
                          {order.staff_name && (
                            <div className="text-xs text-pink-800/60">
                              by {order.staff_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-pink-800/80">{order.customer_name}</div>
                      {order.customer_phone && (
                        <div className="text-xs text-pink-800/60">{order.customer_phone}</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-700 text-sm font-medium mr-2 border border-pink-200">
                          {order.items_count}
                        </span>
                        <div className="text-sm text-pink-800/70 truncate max-w-xs">
                          {Array.isArray(order.items) 
                            ? order.items.slice(0, 2).map(item => item.name).join(', ')
                            : 'View Items'}
                          {Array.isArray(order.items) && order.items.length > 2 && (
                            <span className="text-pink-800/40 ml-1">
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-pink-800/80">
                      {formatCurrency(order.total_amount)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-800/70">
                      {formatDate(order.created_at || order.formatted_date)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {/* View Details Button */}
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="px-3 py-1 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded text-sm font-medium transition-colors border border-pink-200"
                      >
                        View
                      </button>
                      
                      {/* START Button (pending -> in-progress) - WITH AUTO REFRESH */}
                      {order.status === "pending" && (
                        <button
                          onClick={() => updateStatus(order.id, order.status, "in-progress", true)}
                          disabled={isUpdating || isLoading}
                          className="px-3 py-1 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors border border-pink-700"
                        >
                          {isUpdating ? 'Processing...' : 'Start'}
                        </button>
                      )}
                      
                      {/* COMPLETE Button (in-progress -> completed) - WITH AUTO REFRESH */}
                      {order.status === "in-progress" && (
                        <button
                          onClick={() => updateStatus(order.id, order.status, "completed", true)}
                          disabled={isUpdating || isLoading}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors border border-green-700"
                        >
                          {isUpdating ? 'Completing...' : 'Complete'}
                        </button>
                      )}
                      
                      {/* Cancel Button (for pending and in-progress) - NO AUTO REFRESH */}
                      {(order.status === "pending" || order.status === "in-progress") && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this order?')) {
                              updateStatus(order.id, order.status, "cancelled", false);
                            }
                          }}
                          disabled={isUpdating || isLoading}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition-colors border border-red-700"
                        >
                          Cancel
                        </button>
                      )}
                      
                 
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Bottom */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-pink-200 space-y-2 sm:space-y-0">
          <div className="text-sm text-pink-800/60">
            Page {currentPage} of {totalPages} • Showing {itemsPerPage} per page
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-pink-800/60">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  goToPage(page);
                }
              }}
              className="w-16 border border-[#d4789e26] rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white text-pink-800/70"
            />
            <span className="text-sm text-pink-800/60">of {totalPages}</span>
          </div>
          
          <div className="flex items-center space-x-1 p-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#f8f3ed] hover:bg-pink-50 text-pink-800/70 rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-[#d4789e26]"
            >
              Previous
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-pink-700"
            >
              Next
            </button>
          </div>
          {viewingOrder && (
                <OrderDetailsModal
                  order={viewingOrder}
                  onClose={() => setViewingOrder(null)}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  formatStatus={formatStatus}
                />
              )}
        </div>
        
      )}
    </div>
  );
}