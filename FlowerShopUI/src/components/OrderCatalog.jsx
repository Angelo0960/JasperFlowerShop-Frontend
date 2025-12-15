import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

const OrderCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Changed from modal state to view state
  const [currentView, setCurrentView] = useState("cart"); // "cart" or "checkout"
  const [customerName, setCustomerName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [change, setChange] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching products from:", "http://localhost:3000/products");
      
      const response = await fetch('http://localhost:3000/products');
      console.log("Response status:", response.status);
      
      const text = await response.text();
      console.log("Raw response text:", text.substring(0, 200));
      
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("Invalid JSON response");
      }
      
      console.log("Parsed result:", result);
      
      if (result.success) {
        console.log("Products received:", result.data?.length || 0);
        const productsData = result.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
      } else {
        throw new Error(result.message || "Failed to load products");
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search results from SearchBar
  const handleSearchResults = (results, term) => {
    setFilteredProducts(results);
    setSearchTerm(term);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.unit_price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.08;
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      alert('Please add items to cart before checkout');
      return;
    }
    setCurrentView("checkout");
    setCashReceived("");
    setChange(0);
  };

  const handleBackToCart = () => {
    setCurrentView("cart");
    setCustomerName("");
    setStaffName("");
    setPaymentMethod("cash");
    setCashReceived("");
    setChange(0);
  };

  const calculateChange = () => {
    const grandTotal = calculateGrandTotal();
    const cash = parseFloat(cashReceived) || 0;
    const calculatedChange = cash - grandTotal;
    setChange(calculatedChange > 0 ? calculatedChange : 0);
  };

  useEffect(() => {
    if (paymentMethod === "cash" && cashReceived) {
      calculateChange();
    }
  }, [cashReceived, paymentMethod]);

  const handleProcessPayment = async () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (!staffName.trim()) {
      alert('Please enter staff name');
      return;
    }

    if (paymentMethod === "cash") {
      const cash = parseFloat(cashReceived) || 0;
      const grandTotal = calculateGrandTotal();
      if (cash < grandTotal) {
        alert(`Cash received (₱${cash.toFixed(2)}) is less than total amount (₱${grandTotal.toFixed(2)})`);
        return;
      }
    }

    // Prepare order data with all fields
    const orderData = {
      customer_name: customerName,
      staff_name: staffName,
      payment_method: paymentMethod,
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      total_amount: calculateTotal(),
      tax_amount: calculateTax(),
      grand_total: calculateGrandTotal(),
      cash_received: paymentMethod === "cash" ? parseFloat(cashReceived) : 0,
      change_amount: paymentMethod === "cash" ? change : 0,
      notes: 'Order from web interface',
      // Include status for order
      status: 'pending'
    };

    console.log("🛒 Sending order data to backend:", orderData);

    try {
      const response = await fetch('http://localhost:3000/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log("📋 Order creation response:", result);
      
      if (result.success) {
        setCart([]);
        alert(`Order created successfully!\nOrder Code: ${result.data.order_code}\nTotal: ₱${calculateGrandTotal().toFixed(2)}`);
        
        if (window.refreshOrders) {
          window.refreshOrders();
        }
        
        handleBackToCart();
      } else {
        alert(`Failed to create order: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      alert('Failed to create order. Check console for details.');
    }
  };

  const clearSearch = () => {
    setFilteredProducts(products);
    setSearchTerm('');
  };

  return (
    <div className="p-4">
      
      <div className="mb-8">
        {/* Title and Stats */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Order Catalog</h2>
              <p className="text-gray-600">
                {filteredProducts.length} of {products.length} products shown
                {searchTerm && ` • Searching: "${searchTerm}"`}
              </p>
            </div>
            
            {/* Search Bar Component */}
            <div className="flex items-center gap-4">
              <SearchBar 
                products={products} 
                onSearchResults={handleSearchResults} 
              />
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Refresh Products
              </button>
            </div>
          </div>
        </div>

        {/* Search Status Display */}
        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-medium text-blue-800">Search Results:</span>
                <span className="ml-2 text-blue-700">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products and Cart/Checkout Sections */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Products Section */}
        <section className="flex-1">
          {loading ? (
            <div className="text-center p-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg">
              <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Products</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-8 bg-yellow-50 rounded-lg">
              <svg className="w-16 h-16 mx-auto text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                {searchTerm ? "No Products Found" : "No Products Available"}
              </h3>
              <p className="text-yellow-700">
                {searchTerm 
                  ? `No products match your search for "${searchTerm}"`
                  : "The products list is empty or could not be loaded."
                }
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          product.category === 'Bouquets' ? 'bg-purple-100 text-purple-800' :
                          product.category === 'Plants' ? 'bg-green-100 text-green-800' :
                          product.category === 'Arrangements' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.category || 'Uncategorized'}
                        </span>
                        <span className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded ${
                          product.stock_quantity === 0 ? 'bg-red-100 text-red-800' :
                          product.stock_quantity < 10 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {product.stock_quantity === 0 ? 'Out of Stock' : `Stock: ${product.stock_quantity}`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {product.product_code}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
                      {product.description || 'No description available'}
                    </p>
                    
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          ₱{parseFloat(product.unit_price || 0).toFixed(2)}
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          ID: {product.id}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                          product.stock_quantity === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  <p className="text-sm text-gray-500 mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
                </div>
                <div className="bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                  ₱{calculateGrandTotal().toFixed(2)}
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
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                          {/* Item Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                    {item.category}
                                  </span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-600">₱{parseFloat(item.unit_price).toFixed(2)} each</span>
                                </div>
                              </div>
                              {/* DELETE BUTTON */}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-colors flex items-center gap-1"
                                title="Remove item from cart"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                            
                            {/* Quantity Controls and Price */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 text-gray-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <span className="w-8 text-center font-semibold text-gray-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    disabled={item.stock_quantity <= item.quantity}
                                    className={`w-8 h-8 flex items-center justify-center bg-white text-gray-600 transition-colors ${
                                      item.stock_quantity <= item.quantity
                                        ? 'opacity-40 cursor-not-allowed'
                                        : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                  Max: {item.stock_quantity}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  ₱{(item.unit_price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ₱{parseFloat(item.unit_price).toFixed(2)} × {item.quantity}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-4">
                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">₱{calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tax (8%)</span>
                        <span className="font-medium text-gray-900">₱{calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Total</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              ₱{calculateGrandTotal().toFixed(2)}
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
                      onClick={handleOpenCheckout}
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
                  <p className="text-sm text-gray-500 mt-1">Order total: ₱{calculateGrandTotal().toFixed(2)}</p>
                </div>
                <button
                  onClick={handleBackToCart}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  ← Back to Cart
                </button>
              </div>

              {/* Total Amount */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-gray-900">₱{calculateGrandTotal().toFixed(2)}</div>
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
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                      paymentMethod === "cash"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">Cash</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
                      paymentMethod === "card"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
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
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Change */}
                  {change > 0 && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="text-sm text-green-600 mb-1">Change</div>
                      <div className="text-2xl font-bold text-green-700">₱{change.toFixed(2)}</div>
                    </div>
                  )}
                </>
              )}

              {/* Order Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-sm font-medium text-gray-700 mb-3">Order Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cart.length})</span>
                    <span className="font-medium">₱{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">₱{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₱{calculateGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Complete Payment Button */}
              <button
                onClick={handleProcessPayment}
                disabled={paymentMethod === "cash" && (!cashReceived || parseFloat(cashReceived) < calculateGrandTotal())}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  paymentMethod === "cash" && (!cashReceived || parseFloat(cashReceived) < calculateGrandTotal())
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-lg active:translate-y-0"
                }`}
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