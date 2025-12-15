import React from "react";

const OrderModal = ({ order, onClose, formatCurrency, formatDate, formatStatus }) => {
  if (!order) return null;

  // Helper function to safely parse prices
  const safeParsePrice = (price) => {
    if (price === undefined || price === null) return 0;
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function to safely parse quantity
  const safeParseQuantity = (qty) => {
    if (qty === undefined || qty === null) return 1;
    const parsed = parseInt(qty);
    return isNaN(parsed) ? 1 : parsed;
  };

  // Calculate tax and total
  const taxRate = 0.08; // 8%
  const subtotal = safeParsePrice(order.total_amount);
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  // Get items array
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-pink-300">
        {/* Receipt Header */}
        <div className="p-4 border-b border-pink-300 text-center">
          <div className="text-xs text-gray-500 mb-1">FLOWER SHOP</div>
          <h2 className="text-lg font-bold text-gray-800">ORDER RECEIPT</h2>
          <div className="text-xs text-gray-500 mt-1">#{order.order_code}</div>
        </div>

        {/* Receipt Body */}
        <div className="p-4">
          {/* Order Info */}
          <div className="text-xs text-gray-600 mb-4">
            <div className="flex justify-between mb-1">
              <span>Date:</span>
              <span>{formatDate ? formatDate(order.created_at || order.formatted_date) : 
                    order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Time:</span>
              <span>{order.created_at ? new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Status:</span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status ? order.status.replace('-', ' ') : 'Unknown'}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-t border-gray-300 pt-3 mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">CUSTOMER</div>
            <div className="text-sm text-gray-800">{order.customer_name || 'Walk-in Customer'}</div>
            {order.customer_phone && (
              <div className="text-xs text-gray-600 mt-1"> {order.customer_phone}</div>
            )}
            {order.staff_name && (
              <div className="text-xs text-gray-600 mt-1">Staff: {order.staff_name}</div>
            )}
          </div>

          {/* Items Table */}
          <div className="border-t border-gray-300 pt-3 mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">ITEMS</div>
            <div className="space-y-2">
              {items.length > 0 ? (
                items.map((item, index) => {
                  const price = safeParsePrice(item.unit_price || item.price);
                  const quantity = safeParseQuantity(item.quantity);
                  const itemTotal = price * quantity;
                  
                  return (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.name || item.product_name || 'Item'}</span>
                        <span>₱{itemTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 pl-2">
                        <span>{quantity} × ₱{price.toFixed(2)}</span>
                        <span>Line Total</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-2 text-gray-500 text-sm">
                  No item details available
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-300 pt-3">
            <div className="text-xs font-medium text-gray-700 mb-2">PAYMENT SUMMARY</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>₱{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2 mt-2 font-bold">
                <span>TOTAL:</span>
                <span>₱{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order ID */}
          <div className="text-center mt-6 pt-4 border-t border-gray-300">
            <div className="text-xs text-gray-500">
              Order ID: <span className="font-mono">{order.id}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Thank you for your order!
            </div>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="p-4 border-t border-gray-300 bg-gray-50">
          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded transition-colors border border-gray-300"
            >
              Close
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;