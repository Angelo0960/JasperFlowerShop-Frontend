// File: OrderCatalog.jsx (Simplified UI-only version)
import React, { useState } from "react";

const OrderCatalog = () => {
  const [cart, setCart] = useState([]);
  const [currentView, setCurrentView] = useState("cart");
  const [customerName, setCustomerName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");

  return (
    <div className="p-4">
      {/* Title and Search Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Order Catalog</h2>
              <p className="text-gray-600">
                Browse and select products for your order
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Refresh Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products and Cart/Checkout Sections */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Section */}
        <section className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Product Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-800">
                      Category
                    </span>
                    <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                      Stock: 10
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    Product Code
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Product Name
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
                  Product description goes here
                </p>
                
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ₱0.00
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      Product ID
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {}}
                    className="flex items-center px-4 py-2 rounded-lg font-medium transition bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel - switches between Cart and Checkout */}
        <section className="lg:w-96 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
          {currentView === "cart" ? (
            /* CART VIEW */
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Current Order</h2>
                  <p className="text-sm text-gray-500 mt-1">0 items in cart</p>
                </div>
                <div className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                  ₱0.00
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm">Browse products and add items to your order</p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="mb-8 max-h-96 overflow-y-auto pr-2">
                    <div className="space-y-4">
                      {/* Sample cart item would go here */}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">₱0.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tax (8%)</span>
                        <span className="font-medium text-gray-900">₱0.00</span>
                      </div>
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ₱0.00
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Including tax and fees
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => setCurrentView("checkout")}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Proceed to Checkout
                      </div>
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            /* CHECKOUT VIEW */
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
                  <p className="text-sm text-gray-500 mt-1">Order total: ₱0.00</p>
                </div>
                <button
                  onClick={() => setCurrentView("cart")}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ← Back to Cart
                </button>
              </div>

              {/* Total Amount */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-gray-900">₱0.00</div>
              </div>

              {/* Customer Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Staff Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff Name
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Method
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setPaymentMethod("cash")}
                    className="flex-1 py-3 px-4 rounded-lg border-2 transition border-blue-600 bg-blue-50 text-blue-700"
                  >
                    <div className="font-medium">Cash</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className="flex-1 py-3 px-4 rounded-lg border-2 transition border-gray-300 hover:border-gray-400"
                  >
                    <div className="font-medium">Card</div>
                  </button>
                </div>
              </div>

              {/* Cash Received (only shown for cash payment) */}
              {paymentMethod === "cash" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cash Received
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                      <input
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Order Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-sm font-medium text-gray-700 mb-3">Order Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items (0)</span>
                    <span className="font-medium">₱0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">₱0.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₱0.00</span>
                  </div>
                </div>
              </div>

              {/* Complete Payment Button */}
              <button
                onClick={() => {}}
                className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-lg active:translate-y-0"
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Payment
                </div>
              </button>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrderCatalog;