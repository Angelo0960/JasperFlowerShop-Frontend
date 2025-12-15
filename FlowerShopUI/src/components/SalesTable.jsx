import { useState } from "react";

export default function SalesTable({ data, filterType }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  
  
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  
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
  
  
  const currentData = sortedData.slice(startIndex, endIndex);

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
      className="px-4 py-3 border border-pink-200 cursor-pointer hover:bg-pink-50"
      onClick={() => sortData(sortKey)}
    >
      <div className="flex items-center justify-between">
        {children}
        {sortConfig.key === sortKey && (
          <span className="ml-1 text-pink-600">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); 
  };

  
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      
      pageNumbers.push(1);
      
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      
      if (currentPage <= 2) {
        end = 4;
      }
      
      
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="overflow-x-auto">
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <div className="text-sm text-pink-800/70 mb-2 sm:mb-0">
            Showing <span className="font-semibold text-pink-800/80">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-pink-800/80">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-semibold text-pink-800/80">{totalItems}</span> sales
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-pink-800/70">Show:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border border-[#d4789e26] rounded px-2 py-1 text-sm bg-white text-pink-800/70"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-pink-800/70">per page</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === 1
                    ? "bg-[#f8f3ed] text-pink-800/40 cursor-not-allowed border border-pink-300"
                    : "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
                }`}
              >
                Previous
              </button>
              
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded text-sm ${
                    pageNumber === currentPage
                      ? "bg-pink-600 text-white"
                      : typeof pageNumber === 'number'
                      ? "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
                      : "bg-transparent text-pink-800/40 cursor-default"
                  }`}
                  disabled={typeof pageNumber !== 'number'}
                >
                  {pageNumber}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded text-sm ${
                  currentPage === totalPages
                    ? "bg-[#f8f3ed] text-pink-800/40 cursor-not-allowed border border-pink-300"
                    : "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      
      <table className="min-w-full divide-y divide-pink-200">
        <thead className="bg-pink-50">
          <tr>
            <SortableHeader sortKey="sale_code">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Sale Code
              </span>
            </SortableHeader>
            
            <SortableHeader sortKey="sale_date">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Date
              </span>
            </SortableHeader>
            
            <SortableHeader sortKey="sale_time">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Time
              </span>
            </SortableHeader>
            
            <th className="px-4 py-3 border border-pink-200">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Customer
              </span>
            </th>
            
            <th className="px-4 py-3 border border-pink-200">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Staff
              </span>
            </th>
            
            <SortableHeader sortKey="items_count">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Items
              </span>
            </SortableHeader>
            
            <SortableHeader sortKey="total_amount">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Amount
              </span>
            </SortableHeader>
            
            <th className="px-4 py-3 border border-pink-200">
              <span className="text-xs font-semibold text-pink-800/70 uppercase tracking-wider">
                Payment
              </span>
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-pink-100">
          {currentData.length > 0 ? (
            currentData.map((row, index) => (
              <tr key={startIndex + index} className="hover:bg-pink-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-pink-800/80">
                  <span className="font-mono bg-pink-100 px-2 py-1 rounded text-xs border border-pink-200">
                    {row.sale_code || '-'}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-pink-800/70">
                  {formatDate(row.sale_date || row.formatted_date)}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-pink-800/70">
                  {row.sale_time || row.formatted_time || '-'}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-pink-800/80">
                  {row.customer_name || '-'}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-pink-800/70">
                  {row.staff_name || row.staff || '-'}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-pink-100 text-pink-700 rounded-full text-xs border border-pink-200">
                    {row.items_count || row.items || 0}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-pink-800/80">
                  {formatCurrency(Number(row.total_amount || row.amount || 0))}
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize border
                    ${row.payment_method === 'cash' ? 'bg-green-100 text-green-800 border-green-200' :
                      row.payment_method === 'card' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      row.payment_method === 'gcash' ? 'bg-teal-100 text-teal-800 border-teal-200' :
                      row.payment_method === 'order_payment' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      'bg-pink-100 text-pink-800 border-pink-200'
                    }
                  `}>
                    {row.payment_method === 'order_payment' ? 'From Order' : row.payment_method || '-'}
                  </span>
                </td>
                
              </tr>
            ))
          ) : (
            <tr>
              <td
                className="px-4 py-8 text-pink-800/50 text-center"
                colSpan="8"  
              >
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-pink-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg text-pink-800/70">No sales data available</p>
                  <p className="text-sm text-pink-800/50 mt-1">
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
        
        {currentData.length > 0 && (
          <tfoot className="bg-pink-50 border-t border-pink-200">
            <tr>
              <td colSpan="4" className="px-4 py-3 text-sm font-semibold text-pink-800/70">
                Page {currentPage} of {totalPages}
              </td>
              <td colSpan="2" className="px-4 py-3 text-sm font-semibold text-pink-800/70 text-right">
                Total (Current Page):
              </td>
              <td className="px-4 py-3 text-sm font-bold text-pink-800/80">
                {formatCurrency(currentData.reduce((sum, row) => sum + Number(row.total_amount || row.amount || 0), 0))}
              </td>
              <td className="px-4 py-3 text-sm text-pink-800/60">
                {currentData.length} {currentData.length === 1 ? 'sale' : 'sales'}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
      
      
      {sortedData.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
          <div className="text-sm text-pink-800/70 mb-2 sm:mb-0">
            Showing <span className="font-semibold text-pink-800/80">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-pink-800/80">{Math.min(endIndex, totalItems)}</span> of{" "}
            <span className="font-semibold text-pink-800/80">{totalItems}</span> sales
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === 1
                  ? "bg-[#f8f3ed] text-pink-800/40 cursor-not-allowed border border-pink-300"
                  : "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
              }`}
            >
              First
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === 1
                  ? "bg-[#f8f3ed] text-pink-800/40 cursor-not-allowed border border-pink-300"
                  : "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNumber === 'number' && handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded text-sm min-w-[40px] ${
                    pageNumber === currentPage
                      ? "bg-pink-600 text-white"
                      : typeof pageNumber === 'number'
                      ? "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
                      : "bg-transparent text-pink-800/40 cursor-default"
                  }`}
                  disabled={typeof pageNumber !== 'number'}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === totalPages
                  ? "bg-[#f8f3ed] text-pink-800/40 cursor-not-allowed border border-pink-300"
                  : "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
              }`}
            >
              Next
            </button>
            
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === totalPages
                  ? "bg-[#f8f3ed] text-pink-800/40 cursor-not-allowed border border-pink-300"
                  : "bg-white border border-[#d4789e26] text-pink-800/70 hover:bg-pink-50"
              }`}
            >
              Last
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <span className="text-sm text-pink-800/70">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  handlePageChange(page);
                }
              }}
              className="w-16 border border-[#d4789e26] rounded px-2 py-1 text-sm bg-white text-pink-800/70"
            />
          </div>
        </div>
      )}
    </div>
  );
}