import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import vendorService from '../../services/vendorService';
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

  const ProductStatsCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-white rounded-lg shadow p-6">
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
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.productId)}
              onChange={() => handleSelectProduct(product.productId)}
              className="mt-1 h-4 w-4 text-green-600 rounded border-gray-300"
            />
            <img
              src={product.imageUrl || '/api/placeholder/80/80'}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.sku}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs rounded-full ${vendorService.getStatusBadgeClass(product.status)}`}>
                  {product.status}
                </span>
                <span className="text-sm text-gray-500">{product.category?.name}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setActionMenuOpen(actionMenuOpen === product.productId ? null : product.productId)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <FiMoreVertical className="h-4 w-4" />
            </button>
            
            {actionMenuOpen === product.productId && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <Link
                    to={`/vendor/products/${product.productId}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiEye className="mr-3 h-4 w-4" />
                    View Details
                  </Link>
                  <Link
                    to={`/vendor/products/${product.productId}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiEdit className="mr-3 h-4 w-4" />
                    Edit Product
                  </Link>
                  <button
                    onClick={() => handleDuplicateProduct(product.productId)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiCopy className="mr-3 h-4 w-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.productId)}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 className="mr-3 h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Price</p>
            <p className="font-medium">{vendorService.formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-gray-600">Stock</p>
            <p className="font-medium">{product.quantity}</p>
          </div>
          <div>
            <p className="text-gray-600">MRP</p>
            <p className="font-medium">{vendorService.formatCurrency(product.mrp)}</p>
          </div>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product listings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportProducts}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Export
          </button>
          <Link
            to="/vendor/products/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ProductStatsCard
          title="Total Products"
          value={vendorService.formatNumber(stats.totalProducts || 0)}
          icon={FiPackage}
          color="bg-blue-500"
        />
        <ProductStatsCard
          title="Active Products"
          value={vendorService.formatNumber(stats.activeProducts || 0)}
          icon={FiBarChart}
          color="bg-green-500"
        />
        <ProductStatsCard
          title="Out of Stock"
          value={vendorService.formatNumber(stats.outOfStockProducts || 0)}
          icon={FiAlertCircle}
          color="bg-red-500"
        />
        <ProductStatsCard
          title="Total Value"
          value={vendorService.formatCurrency(stats.totalValue || 0)}
          icon={FiDollarSign}
          color="bg-purple-500"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiFilter className="mr-2 h-4 w-4" />
            Filters
            <FiChevronDown className="ml-2 h-4 w-4" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
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

      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
      )}

      {/* Products Grid */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="text-center py-12">
          <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
          <div className="mt-6">
            <Link
              to="/vendor/products/add"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Select All */}
          {products.length > 0 && (
            <div className="flex items-center space-x-2 px-4">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-green-600 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                Select all ({products.length} products)
              </span>
            </div>
          )}
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Load More / Pagination */}
      {products.length >= filters.size && (
        <div className="text-center">
          <button
            onClick={() => setFilters(prev => ({ ...prev, size: prev.size + 10 }))}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorProducts; 