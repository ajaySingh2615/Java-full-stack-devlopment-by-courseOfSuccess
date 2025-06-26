import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Package, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Upload,
  Grid,
  List,
  SlidersHorizontal,
  Tag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Vendor Products Component - Phase 1 Foundation
 * 
 * Basic product listing and management interface for vendors
 * Based on product-list-management.json specifications
 */
const VendorProducts = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', or 'table'
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Phase 2 Advanced Features
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Bulk actions state
  const [bulkOperation, setBulkOperation] = useState({
    type: '',
    data: {}
  });
  
  // Mock data for Phase 1 - replace with API calls later
  const mockProducts = [
    {
      id: 1,
      name: 'Organic Basmati Rice',
      sku: 'ORG-RICE-001',
      category: 'Organic Grains',
      price: 899,
      discountPrice: 799,
      stock: 50,
      status: 'ACTIVE',
      image: '/images/products/organic-rice.jpg',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-15'
    },
    {
      id: 2,
      name: 'Pure Honey',
      sku: 'HONEY-001',
      category: 'Traditional Products',
      price: 450,
      discountPrice: null,
      stock: 0,
      status: 'OUT_OF_STOCK',
      image: '/images/products/honey.jpg',
      createdAt: '2025-01-08',
      updatedAt: '2025-01-12'
    },
    {
      id: 3,
      name: 'Organic Turmeric Powder',
      sku: 'TURMERIC-001',
      category: 'Traditional Products',
      price: 299,
      discountPrice: 249,
      stock: 5,
      status: 'LOW_STOCK',
      image: '/images/products/turmeric.jpg',
      createdAt: '2025-01-05',
      updatedAt: '2025-01-10'
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProducts(mockProducts);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Enhanced filtering with Phase 2 features
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Enhanced sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = a.discountPrice || a.price;
        bValue = b.discountPrice || b.price;
        break;
      case 'stock':
        aValue = a.stock;
        bValue = b.stock;
        break;
      case 'created_at':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Get status badge component
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Inactive
          </span>
        );
      case 'OUT_OF_STOCK':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Out of Stock
          </span>
        );
      case 'LOW_STOCK':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Low Stock
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Handle product selection for bulk operations
  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle select all products
  const handleSelectAll = () => {
    if (selectedProducts.length === sortedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(sortedProducts.map(p => p.id));
    }
  };

  // Phase 2 Enhanced Functions
  const handleBulkStatusChange = (newStatus) => {
    const updatedProducts = products.map(product => 
      selectedProducts.includes(product.id) 
        ? { ...product, status: newStatus, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    setSelectedProducts([]);
  };

  const handleBulkPriceUpdate = (updateType, value) => {
    const updatedProducts = products.map(product => {
      if (!selectedProducts.includes(product.id)) return product;
      
      let newPrice = product.price;
      switch (updateType) {
        case 'percentage_increase':
          newPrice = Math.round(product.price * (1 + value / 100));
          break;
        case 'percentage_decrease':
          newPrice = Math.round(product.price * (1 - value / 100));
          break;
        case 'fixed_increase':
          newPrice = product.price + value;
          break;
        case 'fixed_decrease':
          newPrice = Math.max(1, product.price - value);
          break;
      }
      
      return { 
        ...product, 
        price: newPrice,
        discountPrice: product.discountPrice ? Math.round(newPrice * 0.9) : null,
        updatedAt: new Date().toISOString()
      };
    });
    setProducts(updatedProducts);
    setSelectedProducts([]);
  };

  const handleBulkStockUpdate = (updateType, value) => {
    const updatedProducts = products.map(product => {
      if (!selectedProducts.includes(product.id)) return product;
      
      let newStock = product.stock;
      switch (updateType) {
        case 'set':
          newStock = value;
          break;
        case 'add':
          newStock = product.stock + value;
          break;
        case 'subtract':
          newStock = Math.max(0, product.stock - value);
          break;
      }
      
      // Auto-update status based on stock
      let newStatus = product.status;
      if (newStock === 0) {
        newStatus = 'OUT_OF_STOCK';
      } else if (newStock <= 5) {
        newStatus = 'LOW_STOCK';
      } else if (product.status === 'OUT_OF_STOCK' || product.status === 'LOW_STOCK') {
        newStatus = 'ACTIVE';
      }
      
      return { 
        ...product, 
        stock: newStock,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    });
    setProducts(updatedProducts);
    setSelectedProducts([]);
  };

  const handleExport = (format = 'csv') => {
    const exportData = selectedProducts.length > 0 
      ? products.filter(p => selectedProducts.includes(p.id))
      : sortedProducts;
    
    console.log(`Exporting ${exportData.length} products as ${format}:`, exportData);
    
    // Simulate export
    const fileName = `products_export_${new Date().toISOString().split('T')[0]}.${format}`;
    alert(`Export started: ${fileName}\n${exportData.length} products will be exported.`);
  };

  const handleImport = (file) => {
    console.log('Importing products from file:', file);
    // Simulate import
    alert('Import functionality will be implemented with file upload and CSV parsing.');
  };

  const handleDuplicateProducts = () => {
    const duplicatedProducts = products
      .filter(p => selectedProducts.includes(p.id))
      .map(product => ({
        ...product,
        id: Date.now() + Math.random(),
        name: `${product.name} - Copy`,
        sku: `${product.sku}-COPY`,
        status: 'INACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
    
    setProducts([...products, ...duplicatedProducts]);
    setSelectedProducts([]);
  };

  const handleDeleteProducts = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      const updatedProducts = products.filter(p => !selectedProducts.includes(p.id));
      setProducts(updatedProducts);
      setSelectedProducts([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-1">Manage your product listings and inventory</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Link
                to="/vendor/products/import"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Products
              </Link>
              <Link
                to="/vendor/products/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Products</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.status === 'LOW_STOCK').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.filter(p => p.status === 'OUT_OF_STOCK').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search - Phase 2 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col space-y-4">
            {/* Primary Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products by name, SKU, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Quick Filters */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="Organic Grains">Organic Grains</option>
                  <option value="Traditional Products">Traditional Products</option>
                  <option value="Fresh Vegetables">Fresh Vegetables</option>
                  <option value="Seasonal Fruits">Seasonal Fruits</option>
                </select>

                {/* Sort Controls */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="created_at">Sort by Created</option>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="stock">Sort by Stock</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                
                {/* View Mode */}
                <div className="flex items-center space-x-1 border border-gray-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-md ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-r-md ${viewMode === 'table' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Package className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedProducts.length === sortedProducts.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Quick Bulk Actions */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkStatusChange(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-2 py-1 border border-blue-300 rounded text-sm"
                  >
                    <option value="">Change Status</option>
                    <option value="ACTIVE">Set Active</option>
                    <option value="INACTIVE">Set Inactive</option>
                  </select>
                  
                  <button
                    onClick={handleDuplicateProducts}
                    className="px-3 py-1 border border-blue-300 text-blue-700 rounded-md text-sm hover:bg-blue-100"
                  >
                    Duplicate
                  </button>
                  
                  <button
                    onClick={() => handleExport('csv')}
                    className="px-3 py-1 border border-blue-300 text-blue-700 rounded-md text-sm hover:bg-blue-100"
                  >
                    Export Selected
                  </button>
                  
                  <button
                    onClick={handleDeleteProducts}
                    className="px-3 py-1 border border-red-300 text-red-700 rounded-md text-sm hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {sortedProducts.length} of {products.length} products
              </span>
              <span>
                {selectedProducts.length > 0 && `${selectedProducts.length} selected`}
              </span>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Link
                  to="/vendor/products/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Bulk Actions Bar */}
              {selectedProducts.length > 0 && (
                <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Bulk Edit
                      </button>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Update Status
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Delete Selected
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === sortedProducts.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Product</span>
                </div>
              </div>

              {/* Products Table */}
              <div className="divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleProductSelect(product.id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <div className="ml-4 flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-md object-cover bg-gray-100"
                              src={product.image}
                              alt={product.name}
                              onError={(e) => {
                                e.target.src = '/images/placeholder-product.jpg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-8">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium">
                            ₹{product.discountPrice || product.price}
                            {product.discountPrice && (
                              <span className="ml-2 text-gray-500 line-through">₹{product.price}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-900">
                          Stock: {product.stock}
                        </div>
                        
                        <div>
                          {getStatusBadge(product.status)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/vendor/products/preview/${product.id}`}
                            className="text-gray-400 hover:text-gray-600"
                            title="Preview Product"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/vendor/products/edit/${product.id}`}
                            className="text-gray-400 hover:text-gray-600"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {product.productType === 'variable' && (
                            <Link
                              to={`/vendor/products/${product.id}/variants`}
                              className="text-blue-400 hover:text-blue-600"
                              title="Manage Variants"
                            >
                              <Tag className="w-4 h-4" />
                            </Link>
                          )}
                          <button 
                            onClick={() => handleDeleteProducts()}
                            className="text-gray-400 hover:text-red-600"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProducts; 