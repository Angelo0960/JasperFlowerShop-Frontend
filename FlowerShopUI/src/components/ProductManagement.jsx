
import React, { useState, useEffect } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
 
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Bouquets",
    unit_price: "",
    product_code: ""
  });

  
  const categories = ["Bouquets", "Plants", "Arrangements", "Accessories"];

  
  useEffect(() => {
    fetchProducts();
  }, []);

  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.product_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      let result;
      
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("Invalid JSON response");
      }
      
      if (result.success) {
        const productsData = result.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        console.log(`✅ Loaded ${productsData.length} products`);
      } else {
        throw new Error(result.message || "Failed to load products");
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError(error.message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "Bouquets",
      unit_price: "",
      product_code: ""
    });
    setCurrentProduct(null);
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      category: product.category || "Bouquets",
      unit_price: product.unit_price,
      product_code: product.product_code || ""
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Product name is required');
      return false;
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      alert('Please enter a valid unit price');
      return false;
    }
    return true;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) return;

    try {
      const productData = {
        ...formData,
        unit_price: parseFloat(formData.unit_price)
      };

      console.log("📤 Creating product:", productData);

      const response = await fetch('http://localhost:3000/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();
      console.log("📥 Create response:", result);

      if (result.success) {
        alert('✅ Product created successfully!');
        closeModal();
        fetchProducts(); 
      } else {
        alert(`❌ Failed to create product: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error creating product:', error);
      alert('Failed to create product. Check console for details.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!validateForm() || !currentProduct) return;

    try {
      const productData = {
        ...formData,
        unit_price: parseFloat(formData.unit_price)
      };

      console.log("📤 Updating product:", productData);

      const response = await fetch(`http://localhost:3000/products/update/${currentProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      const result = await response.json();
      console.log("📥 Update response:", result);

      if (result.success) {
        alert('✅ Product updated successfully!');
        closeModal();
        fetchProducts(); 
      } else {
        alert(`❌ Failed to update product: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error updating product:', error);
      alert('Failed to update product. Check console for details.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      console.log(`🗑️ Deleting product ID: ${productId}`);

      const response = await fetch(`http://localhost:3000/products/delete/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      console.log("📥 Delete response:", result);

      if (result.success) {
        alert('✅ Product deleted successfully!');
        fetchProducts(); 
      } else {
        alert(`❌ Failed to delete product: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      alert('Failed to delete product. Check console for details.');
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleUpdateProduct();
    } else {
      handleCreateProduct();
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Bouquets': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Plants': return 'bg-green-100 text-green-800 border-green-200';
      case 'Arrangements': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      
      <div className="mb-8 p-6 bg-pink-50 rounded-xl border border-pink-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-pink-800/80 mb-2">Product Management</h1>
            <p className="text-pink-800/60">Manage your product catalog. Create, edit, and delete products.</p>
          </div>
          
          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors flex items-center border border-pink-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Product
          </button>
        </div>

        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products by name, category, or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-[#d4789e26] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white text-pink-800/70"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-800/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-800/80">{products.length}</div>
              <div className="text-sm text-pink-800/60">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-800/80">{filteredProducts.length}</div>
              <div className="text-sm text-pink-800/60">Showing</div>
            </div>
            <button
              onClick={fetchProducts}
              className="px-4 py-2 bg-[#f8f3ed] hover:bg-pink-50 text-pink-800/70 font-medium rounded-lg transition-colors border border-[#d4789e26] flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        
        {searchTerm && (
          <div className="mt-4 p-3 bg-pink-100 border border-pink-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-pink-800/70">
                Searching: <span className="font-semibold">"{searchTerm}"</span> • Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-pink-600 hover:text-pink-800 hover:underline"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>

      
      {loading && (
        <div className="text-center p-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
          <p className="text-pink-800/60 text-lg">Loading products...</p>
        </div>
      )}

      
      {error && !loading && (
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 mb-6">
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
      )}

      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-pink-50 rounded-xl border border-pink-200">
              <svg className="w-20 h-20 mx-auto text-pink-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-pink-800/70 mb-2">
                {searchTerm ? "No Products Found" : "No Products Available"}
              </h3>
              <p className="text-pink-800/60 mb-6">
                {searchTerm 
                  ? `No products match your search for "${searchTerm}"`
                  : "Start by adding your first product"
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={openAddModal}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors border border-pink-700"
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Product
                </button>
              )}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-[#d4789e26] hover:shadow-md transition-shadow">
                <div className="p-6">
                  
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(product.category)}`}>
                        {product.category || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="text-xs text-pink-800/60 font-mono bg-pink-50 px-2 py-1 rounded border border-pink-200">
                      {product.product_code || `ID: ${product.id}`}
                    </div>
                  </div>
                  
                  
                  <h3 className="text-xl font-semibold text-pink-800/80 mb-3">
                    {product.name}
                  </h3>
                  
                  <p className="text-pink-800/70 text-sm mb-6 min-h-[60px]">
                    {product.description || 'No description available'}
                  </p>
                  
                  
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-2xl font-bold text-pink-800/80">
                        ₱{parseFloat(product.unit_price || 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-pink-800/60 mt-1">
                        Last updated: {new Date(product.updated_at || product.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium rounded-lg transition-colors border border-pink-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors border border-red-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#d4789e26]">
            
            <div className="p-6 border-b border-pink-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-pink-800/80">
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-pink-800/60 hover:text-pink-800"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-pink-800/60 mt-1">
                {isEditing ? 'Update product details below' : 'Fill in the product details below'}
              </p>
            </div>

           
            <div className="p-6">
              <div className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium text-pink-800/70 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border border-[#d4789e26] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white text-pink-800/70"
                    required
                  />
                </div>

               
                <div>
                  <label className="block text-sm font-medium text-pink-800/70 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows="3"
                    className="w-full px-4 py-3 border border-[#d4789e26] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white text-pink-800/70"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-pink-800/70 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#d4789e26] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white text-pink-800/70"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                 
                  <div>
                    <label className="block text-sm font-medium text-pink-800/70 mb-2">
                      Product Code
                    </label>
                    <input
                      type="text"
                      name="product_code"
                      value={formData.product_code}
                      onChange={handleInputChange}
                      placeholder="e.g., PROD-001"
                      className="w-full px-4 py-3 border border-[#d4789e26] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white text-pink-800/70"
                    />
                  </div>
                </div>

                
                <div>
                  <label className="block text-sm font-medium text-pink-800/70 mb-2">
                    Unit Price (₱) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-800/60">₱</span>
                    <input
                      type="number"
                      name="unit_price"
                      value={formData.unit_price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-[#d4789e26] rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition bg-white text-pink-800/70"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            
            <div className="p-6 border-t border-pink-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-[#f8f3ed] hover:bg-pink-50 text-pink-800/70 font-medium rounded-lg transition-colors border border-[#d4789e26]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors border border-pink-700 flex items-center"
                >
                  {isEditing ? (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Product
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
