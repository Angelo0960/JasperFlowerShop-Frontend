import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import OrderModal from "./OrderModal";

const OrderCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("cart");
  const [customerName, setCustomerName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Only cash option
  const [cashReceived, setCashReceived] = useState("");
  const [change, setChange] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatCurrency = (amount) => {
    return `₱${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStatus = (status) => {
    return status ? status.replace('-', ' ') : 'Unknown';
  };

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

  const handleSearchResults = (results, term) => {
    let filtered = results;
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredProducts(filtered);
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (category !== "all") {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    setFilteredProducts(filtered);
  };

  const getUniqueCategories = () => {
    const categories = products
      .map(product => product.category)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return ["all", ...categories];
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
    setCashReceived("");
    setChange(0);
  };

  useEffect(() => {
    if (cashReceived) {
      const grandTotal = calculateGrandTotal();
      const cash = parseFloat(cashReceived) || 0;
      const calculatedChange = cash - grandTotal;
      setChange(calculatedChange > 0 ? calculatedChange : 0);
    }
  }, [cashReceived]);

  const handleProcessPayment = async () => {
    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (!staffName.trim()) {
      alert('Please enter staff name');
      return;
    }

    const cash = parseFloat(cashReceived) || 0;
    const grandTotal = calculateGrandTotal();
    if (cash < grandTotal) {
      alert(`Cash received (₱${cash.toFixed(2)}) is less than total amount (₱${grandTotal.toFixed(2)})`);
      return;
    }

    // Prepare order data with all fields
    const orderData = {
      customer_name: customerName,
      staff_name: staffName,
      payment_method: "cash", // Always cash
      items: cart.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price
      })),
      total_amount: calculateTotal(),
      tax_amount: calculateTax(),
      grand_total: calculateGrandTotal(),
      cash_received: parseFloat(cashReceived),
      change_amount: change,
      notes: 'Order from web interface',
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
        const createdOrder = {
          ...orderData,
          id: result.data.id,
          order_code: result.data.order_code,
          created_at: new Date().toISOString()
        };
        
        setLastOrder(createdOrder);
        setCart([]);
        setShowReceipt(true);
        
        if (window.refreshOrders) {
          window.refreshOrders();
        }
      } else {
        alert(`Failed to create order: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error creating order:', error);
      alert('Failed to create order. Check console for details.');
    }
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setLastOrder(null);
    handleBackToCart();
  };

  const clearSearch = () => {
    setFilteredProducts(products);
    setSearchTerm('');
    setSelectedCategory("all");
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-pink-800/80">Order Catalog</h1>
              <p className="text-pink-800/60">
                {filteredProducts.length} of {products.length} products shown
                {searchTerm && ` • Searching: "${searchTerm}"`}
                {selectedCategory !== "all" && ` • Category: ${selectedCategory}`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <SearchBar 
                products={products} 
                onSearchResults={handleSearchResults} 
              />
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-[#f8f3ed] rounded hover:bg-pink-50 transition-colors whitespace-nowrap border border-[#d4789e26] text-pink-800/70"
              >
                Refresh Products
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            
            {getUniqueCategories().map(category => (
              <button
                
                onClick={() => handleCategoryFilter(category)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  selectedCategory === category
                    ? "bg-pink-600 text-white border-pink-700"
                    : "bg-white text-pink-800/70 border-pink-300 hover:bg-pink-50 hover:border-pink-400"
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
          
          {selectedCategory !== "all" && (
            <div className="inline-flex items-center px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm border border-pink-200">
              <span>{selectedCategory}</span>
              <button
                onClick={() => handleCategoryFilter("all")}
                className="ml-2 text-pink-600 hover:text-pink-800"
                title="Clear category filter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Search Status Display */}
        {searchTerm && (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="font-medium text-pink-800">Search Results:</span>
                <span className="ml-2 text-pink-700">
                  Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
                  {selectedCategory !== "all" && ` in ${selectedCategory}`}
                </span>
              </div>
              <button
                onClick={clearSearch}
                className="text-sm text-pink-600 hover:text-pink-800 hover:underline"
              >
                Clear All Filters
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
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
              <p className="text-pink-800/60">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
              <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Products</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 border border-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
              <svg className="w-16 h-16 mx-auto text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                {searchTerm ? "No Products Found" : "No Products Available"}
              </h3>
              <p className="text-yellow-700">
                {searchTerm 
                  ? `No products match your search for "${searchTerm}"${
                    selectedCategory !== "all" ? ` in ${selectedCategory} category` : ""
                  }`
                  : "The products list is empty or could not be loaded."
                }
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 border border-yellow-700"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-[#d4789e26] rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                      <div>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                          product.category === 'Bouquets' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                          product.category === 'Plants' ? 'bg-green-100 text-green-800 border border-green-200' :
                          product.category === 'Arrangements' ? 'bg-pink-100 text-pink-800 border border-pink-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {product.category || 'Uncategorized'}
                        </span>
                      </div>
                      <div className="text-xs text-pink-800/60 font-mono">
                        {product.product_code}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-pink-800/80 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-pink-800/70 text-sm mb-4 min-h-[40px]">
                      {product.description || 'No description available'}
                    </p>
                    
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="text-2xl font-bold text-pink-800/80">
                          ₱{parseFloat(product.unit_price || 0).toFixed(2)}
                        </span>
                        <div className="text-sm text-pink-800/60 mt-1">
                          ID: {product.id}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center px-4 py-2 rounded-lg font-medium transition border bg-pink-600 hover:bg-pink-700 text-white border-pink-700"
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

        {/* Right Panel - Cart/Checkout */}
        <section className="lg:w-96 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6 border border-[#d4789e26]">
          {currentView === "cart" ? (
            /* CART VIEW */
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-200">
                <div>
                  <h2 className="text-2xl font-bold text-pink-800/80">Current Order</h2>
                  <p className="text-sm text-pink-800/60 mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in cart</p>
                </div>
                <div className="bg-pink-50 text-pink-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-pink-200">
                  ₱{calculateGrandTotal().toFixed(2)}
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center border border-pink-200">
                    <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-pink-800/70 mb-2">Your cart is empty</h3>
                  <p className="text-pink-800/60 text-sm">Browse products and add items to your order</p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="mb-8 max-h-96 overflow-y-auto pr-2">
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-start p-4 bg-pink-50 border border-pink-200 rounded-xl hover:bg-pink-100 transition-colors duration-200">
                          {/* Item Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-pink-800/80 truncate">{item.name}</h4>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className="text-xs font-medium px-2 py-0.5 bg-pink-100 text-pink-700 rounded border border-pink-200">
                                    {item.category}
                                  </span>
                                  <span className="text-xs text-pink-800/40">•</span>
                                  <span className="text-xs text-pink-800/60">₱{parseFloat(item.unit_price).toFixed(2)} each</span>
                                </div>
                              </div>
                              {/* DELETE BUTTON */}
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-colors flex items-center gap-1 border border-red-200"
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
                                <div className="flex items-center border border-pink-300 rounded-lg overflow-hidden bg-white">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-pink-100 text-pink-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                  </button>
                                  <span className="w-8 text-center font-semibold text-pink-800/80 bg-pink-50">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-pink-100 text-pink-600 transition-colors"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-pink-800/80">
                                  ₱{(item.unit_price * item.quantity).toFixed(2)}
                                </div>
                                <div className="text-xs text-pink-800/60">
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
                    <div className="bg-pink-50 rounded-xl p-4 space-y-3 border border-pink-200">
                      <div className="flex justify-between items-center">
                        <span className="text-pink-800/70">Subtotal</span>
                        <span className="font-medium text-pink-800/80">₱{calculateTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-pink-800/70">Tax (8%)</span>
                        <span className="font-medium text-pink-800/80">₱{calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="border-t border-pink-300 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-pink-800/80">Total</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-pink-800/80">
                              ₱{calculateGrandTotal().toFixed(2)}
                            </div>
                            <div className="text-xs text-pink-800/60 mt-1">
                              Including tax and fees
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleOpenCheckout}
                      className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 border border-pink-700"
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
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-pink-200">
                <div>
                  <h2 className="text-2xl font-bold text-pink-800/80">Complete Payment</h2>
                  <p className="text-sm text-pink-800/60 mt-1">Order total: ₱{calculateGrandTotal().toFixed(2)}</p>
                </div>
                <button
                  onClick={handleBackToCart}
                  className="text-sm text-pink-600 hover:text-pink-800 hover:underline"
                >
                  ← Back to Cart
                </button>
              </div>

              {/* Total Amount */}
              <div className="mb-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
                <div className="text-sm text-pink-800/70 mb-1">Total Amount</div>
                <div className="text-3xl font-bold text-pink-800/80">₱{calculateGrandTotal().toFixed(2)}</div>
              </div>

              {/* Customer Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-pink-800/70 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white"
                />
              </div>

              {/* Staff Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-pink-800/70 mb-2">
                  Staff Name
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white"
                />
              </div>

              {/* Payment Method Display (Cash Only) */}
              <div className="mb-6 p-4 bg-pink-50 border border-pink-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-pink-800/70 mb-1">Payment Method</div>
                    <div className="text-lg font-semibold text-pink-800/80">Cash</div>
                  </div>
                  <div className="text-pink-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Cash Received */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-pink-800/70 mb-2">
                  Cash Received
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-800/60">₱</span>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Change */}
              {change > 0 && (
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="text-sm text-orange-700 mb-1">Change</div>
                  <div className="text-2xl font-bold text-orange-800">₱{change.toFixed(2)}</div>
                </div>
              )}

              {/* Order Summary */}
              <div className="mb-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
                <div className="text-sm font-medium text-pink-800/70 mb-3">Order Summary</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-pink-800/70">Items ({cart.length})</span>
                    <span className="font-medium text-pink-800/80">₱{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pink-800/70">Tax (8%)</span>
                    <span className="font-medium text-pink-800/80">₱{calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-pink-300">
                    <span className="font-medium text-pink-800/80">Total</span>
                    <span className="font-bold text-pink-800/80">₱{calculateGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Complete Payment Button */}
              <button
                onClick={handleProcessPayment}
                disabled={!cashReceived || parseFloat(cashReceived) < calculateGrandTotal()}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 border ${
                  !cashReceived || parseFloat(cashReceived) < calculateGrandTotal()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
                    : "bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white hover:shadow-lg active:translate-y-0 border-pink-700"
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

      {/* Order Receipt Modal */}
      {showReceipt && lastOrder && (
        <OrderModal
          order={lastOrder}
          onClose={handleCloseReceipt}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          formatStatus={formatStatus}
        />
      )}
    </div>
  );
};

export default OrderCatalog;