import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import vendorService from '../../services/vendorService';
import ProductDetailModal from '../../components/modals/ProductDetailModal';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiEye,
  FiDownload,
  FiPackage,
  FiDollarSign,
  FiBarChart,
  FiAlertCircle,
  FiChevronDown,
  FiX
} from 'react-icons/fi';

/**
 * Vendor Products Component - Phase 1 Foundation
 * 
 * Basic product listing and management interface for vendors
 * Based on product-list-management.json specifications
 */
const VendorProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState({});
  
  // Filters and pagination
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDir: 'desc'
  });
  
  // UI states
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  // Bulk action states
  const [bulkAction, setBulkAction] = useState('');
  const [bulkValue, setBulkValue] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const vendorId = vendorService.getCurrentVendorId();

  useEffect(() => {
    loadProducts();
    loadStats();
    loadCategories();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendorProducts(vendorId, filters);
      if (response.success) {
        setProducts(response.data.content || []);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await vendorService.getProductStats(vendorId);
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await vendorService.getProductCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 0
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0
    }));
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const isSelected = prev.includes(productId);
      const newSelection = isSelected 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const allProductIds = products.map(p => p.productId);
    const allSelected = selectedProducts.length === products.length;
    
    if (allSelected) {
      setSelectedProducts([]);
      setShowBulkActions(false);
    } else {
      setSelectedProducts(allProductIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    try {
      setBulkLoading(true);
      
      switch (bulkAction) {
        case 'status':
          await vendorService.bulkUpdateProductStatus(vendorId, selectedProducts, bulkValue);
          break;
        case 'price':
          await vendorService.bulkUpdateProductPrices(vendorId, selectedProducts, 'percentage', parseFloat(bulkValue));
          break;
        case 'stock':
          await vendorService.bulkUpdateProductStock(vendorId, selectedProducts, 'increase', parseInt(bulkValue));
          break;
        default:
          break;
      }
      
      // Reset selections and reload
      setSelectedProducts([]);
      setShowBulkActions(false);
      setBulkAction('');
      setBulkValue('');
      loadProducts();
      loadStats();
    } catch (err) {
      console.error('Bulk action error:', err);
      alert('Failed to perform bulk action');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await vendorService.deleteProduct(vendorId, productId);
      loadProducts();
      loadStats();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete product');
    }
  };

  const handleDuplicateProduct = async (productId) => {
    try {
      await vendorService.duplicateProduct(vendorId, productId);
      loadProducts();
      loadStats();
    } catch (err) {
      console.error('Duplicate error:', err);
      alert('Failed to duplicate product');
    }
  };

  const handleExportProducts = async () => {
    try {
      const response = await vendorService.exportProducts(vendorId, 'csv', {
        status: filters.status,
        category: filters.category,
        productIds: selectedProducts.length > 0 ? selectedProducts : undefined
      });
      
      if (response.success && response.data.downloadUrl) {
        vendorService.downloadFile(response.data.downloadUrl, response.data.fileName);
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export products');
    }
  };

  // Modal handlers
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductUpdate = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.productId === updatedProduct.productId ? { ...p, ...updatedProduct } : p
      )
    );
    loadStats(); // Refresh stats
  };

  const handleProductDelete = (productId) => {
    setProducts(prevProducts =>
      prevProducts.filter(p => p.productId !== productId)
    );
    loadStats(); // Refresh stats
  };

  const handleNavigateToEdit = (productId) => {
    navigate(`/vendor/products/edit/${productId}`);
  };

  const ProductStatsCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow transition-shadow">
      <div className="relative">
        <div 
          className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden cursor-pointer"
          onClick={() => handleProductClick(product)}
        >
          <img
            src={product.imageUrl || '/placeholder-product.jpg'}
            alt={product.name}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-200"
          />
        </div>
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={selectedProducts.includes(product.productId)}
            onChange={() => handleSelectProduct(product.productId)}
            className="h-4 w-4 text-green-600 rounded border-gray-300 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="absolute top-2 left-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick(product);
            }}
            className="bg-white bg-opacity-90 text-gray-600 p-2 rounded-full hover:bg-opacity-100 transition-all"
            title="View details"
          >
            <FiEye className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div 
        className="p-4 cursor-pointer"
        onClick={() => handleProductClick(product)}
      >
        <div className="mb-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.comparePrice}</span>
            )}
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.status === 'active' ? 'bg-green-100 text-green-800' :
            product.status === 'draft' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {product.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Stock: {product.stockQuantity}</span>
          <span>{product.category}</span>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/vendor/products/edit/${product.productId}`);
              }}
              className="text-blue-600 hover:text-blue-700"
              title="Edit product"
            >
              <FiEdit className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateProduct(product.productId);
              }}
              className="text-gray-600 hover:text-gray-700"
              title="Duplicate product"
            >
              <FiCopy className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProduct(product.productId);
              }}
              className="text-red-600 hover:text-red-700"
              title="Delete product"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/vendor/products/variants/${product.productId}`);
            }}
            className="text-gray-600 hover:text-gray-700"
            title="Manage variants"
          >
            <FiPackage className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <Link
              to="/vendor/products/add"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium inline-flex items-center"
            >
              <FiPlus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProductStatsCard
            title="Total Products"
            value={stats.totalProducts || 0}
            icon={FiPackage}
            color="bg-blue-600"
            change={stats.productGrowth}
          />
          <ProductStatsCard
            title="Active Products"
            value={stats.activeProducts || 0}
            icon={FiBarChart}
            color="bg-green-600"
          />
          <ProductStatsCard
            title="Low Stock"
            value={stats.lowStockProducts || 0}
            icon={FiAlertCircle}
            color="bg-yellow-600"
          />
          <ProductStatsCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue || 0}`}
            icon={FiDollarSign}
            color="bg-purple-600"
            change={stats.revenueGrowth}
          />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={filters.search}
                  onChange={handleSearch}
                  placeholder="Search products..."
                  className="block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiFilter className="h-5 w-5 mr-2" />
                Filters
              </button>
              
              <button
                onClick={handleExportProducts}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiDownload className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
              
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Categories</option>
                {Object.entries(categories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={`${filters.sortBy}-${filters.sortDir}`}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortDir', sortDir);
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-desc">Price High-Low</option>
                <option value="price-asc">Price Low-High</option>
              </select>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedProducts.length} products selected
                  </span>
                  
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-1 border border-blue-300 rounded text-sm"
                  >
                    <option value="">Choose action...</option>
                    <option value="status">Update Status</option>
                    <option value="price">Adjust Prices</option>
                    <option value="stock">Update Stock</option>
                  </select>
                  
                  {bulkAction === 'status' && (
                    <select
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      className="px-3 py-1 border border-blue-300 rounded text-sm"
                    >
                      <option value="">Select status...</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  )}
                  
                  {(bulkAction === 'price' || bulkAction === 'stock') && (
                    <input
                      type="number"
                      value={bulkValue}
                      onChange={(e) => setBulkValue(e.target.value)}
                      placeholder={bulkAction === 'price' ? '% change' : 'Quantity'}
                      className="px-3 py-1 border border-blue-300 rounded text-sm w-24"
                    />
                  )}
                  
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction || !bulkValue || bulkLoading}
                    className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {bulkLoading ? 'Processing...' : 'Apply'}
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedProducts([]);
                    setShowBulkActions(false);
                    setBulkAction('');
                    setBulkValue('');
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onProductUpdate={handleProductUpdate}
          onProductDelete={handleProductDelete}
          onNavigateToEdit={handleNavigateToEdit}
        />
      </div>
    </div>
  );
};

export default VendorProducts; 