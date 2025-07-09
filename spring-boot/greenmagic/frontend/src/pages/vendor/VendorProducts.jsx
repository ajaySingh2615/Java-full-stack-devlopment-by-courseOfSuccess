import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import vendorService from '../../services/vendorService';
import ProductDetailModal from '../../components/modals/ProductDetailModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import SuccessModal from '../../components/modals/SuccessModal';
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
  FiX,
  FiToggleLeft,
  FiCheck
} from 'react-icons/fi';
import ProductPerformanceBadge from '../../components/product/ProductPerformanceBadge';
import StockLevelIndicator from '../../components/product/StockLevelIndicator';
import QuickActionMenu from '../../components/product/QuickActionMenu';
import BulkActionToolbar from '../../components/bulk/BulkActionToolbar';
import BulkOperationModal from '../../components/bulk/BulkOperationModal';
import ProgressIndicator from '../../components/bulk/ProgressIndicator';
import { useBulkOperations } from '../../hooks/useBulkOperations';

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
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  // Bulk operations hook
  const {
    selectedProducts,
    selectAll,
    bulkToolbarVisible,
    activeOperation,
    operationProgress,
    selectProduct,
    selectAllProducts,
    selectFilteredProducts,
    clearSelection,
    isProductSelected,
    getSelectedCount,
    getSelectedProductIds,
    startBulkOperation,
    cancelBulkOperation,
    validateBulkOperation,
    getProgressPercentage,
    isOperationInProgress,
    getOperationStatusText
  } = useBulkOperations();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Add state for inline editing
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [quickActionLoading, setQuickActionLoading] = useState({});
  const [performanceData, setPerformanceData] = useState({});

  // Modal states for duplication
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [duplicateProductId, setDuplicateProductId] = useState(null);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Bulk operation modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedBulkOperation, setSelectedBulkOperation] = useState(null);
  const [bulkCategories, setBulkCategories] = useState([]);

  const vendorId = vendorService.getCurrentVendorId();

  useEffect(() => {
    if (!vendorId) {
      setError('Unable to identify vendor. Please log in again.');
      setLoading(false);
      return;
    }
    
    loadProducts();
    loadStats();
    loadCategories();
    loadPerformanceData();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendorProducts(vendorId, filters);
      
      if (response.success) {
        const productsList = response.data.content || [];
        setProducts(productsList);
      } else {
        setError(response.message || 'Failed to load products');
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
        // Set categories for bulk operations (array format)
        setBulkCategories(response.data);
        
        // Transform to object format for existing filter dropdown
        const categoriesObj = {};
        response.data.forEach(category => {
          categoriesObj[category.id] = category;
        });
        setCategories(categoriesObj);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadPerformanceData = async () => {
    if (!vendorId) return;
    
    try {
      const result = await vendorService.getProductPerformance(vendorId);
      if (result.success && Array.isArray(result.data)) {
        // Create a map of product ID to performance data
        const performanceMap = {};
        result.data.forEach(item => {
          if (item && item.productId) {
            performanceMap[item.productId] = item;
          }
        });
        setPerformanceData(performanceMap);
      } else {
        console.warn('Performance data not available or invalid format');
      }
    } catch (error) {
      console.error('Error loading performance data:', error);
      // Continue with empty performance data
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
    selectProduct(productId);
  };

  const handleSelectAll = () => {
    const allProductIds = products.map(p => p.productId);
    selectAllProducts(allProductIds);
  };

  const handleBulkAction = (operation) => {
    setSelectedBulkOperation(operation);
    setShowBulkModal(true);
  };

  const handleBulkOperationExecute = async (parameters) => {
    try {
      const result = await startBulkOperation(vendorId, selectedBulkOperation, parameters);
      
      if (result.success) {
        // Operation started successfully, progress will be tracked automatically
        // Refresh products list when operation is complete
        setTimeout(() => {
          loadProducts();
          loadStats();
        }, 2000); // Give some time for the operation to complete
        
        return result;
      } else {
        throw new Error(result.error || 'Failed to start bulk operation');
      }
    } catch (error) {
      console.error('Bulk operation failed:', error);
      throw error;
    }
  };

  const handleBulkModalClose = () => {
    setShowBulkModal(false);
    setSelectedBulkOperation(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    setQuickActionLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await vendorService.deleteProduct(vendorId, productId);
      if (response.success) {
        setProducts(prevProducts => prevProducts.filter(p => p.productId !== productId));
      } else {
        alert(`Failed to delete product: ${response.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert(`Error deleting product: ${err.message}`);
    } finally {
      setQuickActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleDuplicateProduct = async (productId) => {
    setDuplicateProductId(productId);
    setShowConfirmModal(true);
  };

  const handleConfirmDuplicate = async () => {
    if (!duplicateProductId) return;

    setDuplicateLoading(true);
    setQuickActionLoading(prev => ({ ...prev, [duplicateProductId]: true }));
    
    try {
      const response = await vendorService.duplicateProduct(vendorId, duplicateProductId);
      if (response.success) {
        // Refresh the entire product list to ensure correct ordering
        await loadProducts();
        
        // Show success modal
        setSuccessMessage(`Product duplicated successfully! New product "${response.data.name}" has been created.`);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      } else {
        alert(`Failed to duplicate product: ${response.error || 'Unknown error'}`);
        setShowConfirmModal(false);
      }
    } catch (err) {
      alert(`Error duplicating product: ${err.message}`);
      setShowConfirmModal(false);
    } finally {
      setDuplicateLoading(false);
      setQuickActionLoading(prev => ({ ...prev, [duplicateProductId]: false }));
      setDuplicateProductId(null);
    }
  };

  const handleCancelDuplicate = () => {
    setShowConfirmModal(false);
    setDuplicateProductId(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessMessage('');
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

  // Handle card hover
  const handleCardHover = (productId, isHovering) => {
    setHoveredCard(isHovering ? productId : null);
  };

  // Handle inline editing
  const handleQuickEdit = (productId, field, currentValue) => {
    setEditingField({ productId, field });
    setEditValue(currentValue);
  };

  // Handle saving inline edits
  const handleQuickSave = async () => {
    if (!editingField) return;
    
    const { productId, field } = editingField;
    setQuickActionLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const result = await vendorService.quickUpdateProduct(
        vendorId, 
        productId, 
        field, 
        field === 'price' ? parseFloat(editValue) : parseInt(editValue, 10)
      );
      
      if (result.success) {
        // Update local state
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.productId === productId ? { ...p, [field]: editValue } : p
          )
        );
      } else {
        alert(`Failed to update ${field}: ${result.error}`);
      }
    } catch (error) {
      alert(`Error updating ${field}: ${error.message}`);
    } finally {
      setQuickActionLoading(prev => ({ ...prev, [productId]: false }));
      setEditingField(null);
    }
  };

  // Handle canceling inline edits
  const handleQuickCancel = () => {
    setEditingField(null);
  };

  // Enhanced handleToggleStatus with loading state
  const handleToggleStatus = async (product) => {
    const productId = product.productId;
    const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    
    setQuickActionLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await vendorService.updateProductStatus(vendorId, productId, newStatus);
      if (response.success) {
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.productId === productId ? { ...p, status: newStatus } : p
          )
        );
        
        // Show success toast or notification
        const message = newStatus === 'ACTIVE' ? 'Product activated' : 'Product deactivated';
        // If you have a toast system, use it here
        // toast.success(message);
        console.log(message); // Placeholder for toast
      } else {
        alert(`Failed to update product status: ${response.error}`);
      }
    } catch (err) {
      alert(`Error updating product status: ${err.message}`);
    } finally {
      setQuickActionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Calculate sales trend based on history
  const calculateTrend = (product) => {
    if (!product || !product.productId) return 'stable';
    
    const performance = performanceData[product.productId];
    
    if (!performance) return 'stable';
    
    // If we have explicit trend data, use it
    if (performance.salesTrend) return performance.salesTrend;
    
    // Otherwise calculate based on available data
    const currentSales = performance.salesCount || 0;
    const previousSales = performance.previousSalesCount || 0;
    
    if (currentSales > previousSales * 1.1) return 'up';
    if (currentSales < previousSales * 0.9) return 'down';
    return 'stable';
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

  const ProductCard = ({ product }) => {
    const isEditing = editingField && editingField.productId === product.productId;
    const isLoading = quickActionLoading[product.productId];
    const performance = performanceData[product.productId] || {};
    const isSelected = isProductSelected(product.productId);
    
    // Get average values for comparison - handle empty data
    const totalSales = Object.values(performanceData).reduce((sum, p) => sum + (p?.salesCount || 0), 0);
    const totalProducts = Math.max(Object.keys(performanceData).length, 1);
    const avgSales = totalSales / totalProducts;
    
    // Calculate trend for this product
    const trend = calculateTrend(product);
    
    return (
      <div 
        className={`relative bg-white rounded-lg shadow-sm border transition-all duration-300 group ${
          isSelected 
            ? 'border-blue-500 shadow-lg ring-2 ring-blue-500 ring-opacity-50' 
            : 'border-gray-200 hover:shadow-lg'
        }`}
        onMouseEnter={() => handleCardHover(product.productId, true)}
        onMouseLeave={() => handleCardHover(product.productId, false)}
      >
        {/* Selection Overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg pointer-events-none z-10" />
        )}
        <div className="relative">
          <div 
            className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Performance Badge - Hide on smallest screens */}
          <div className="absolute top-2 left-2 z-10 hidden sm:block">
            <ProductPerformanceBadge 
              type="sales"
              value={performance?.salesCount}
              avgValue={avgSales}
            />
          </div>
          
          {/* Trending Indicator - Hide on smallest screens */}
          <div className="absolute top-2 right-2 z-10 hidden sm:block">
            <ProductPerformanceBadge 
              type="trend"
              trend={trend}
            />
          </div>
          
          {/* Quick Action Menu - Adjust for touch devices */}
          <div className="hidden group-hover:block sm:block">
            <QuickActionMenu 
              product={product}
              onView={handleProductClick}
              onEdit={(p) => navigate(`/vendor/products/edit/${p.productId}`)}
              onDelete={(p) => handleDeleteProduct(p.productId)}
              onDuplicate={(p) => handleDuplicateProduct(p.productId)}
              onToggleStatus={handleToggleStatus}
              onManageVariants={(p) => navigate(`/vendor/products/${p.productId}/variants`)}
              loading={isLoading}
            />
          </div>
          
          {/* Checkbox for bulk selection */}
          <div className="absolute top-2 left-2 z-20">
            <div className={`p-1 rounded-full shadow-sm transition-all duration-200 ${
              isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-white hover:bg-gray-50'
            }`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectProduct(product.productId)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
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
            {/* Price with inline editing */}
            <div className="flex items-center space-x-2">
              {isEditing && editingField.field === 'price' ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold text-gray-900">₹</span>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-20 px-1 py-0.5 border border-blue-300 rounded text-lg font-bold"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuickSave();
                      } else if (e.key === 'Escape') {
                        e.preventDefault();
                        handleQuickCancel();
                      }
                    }}
                  />
                  <div className="ml-2 flex space-x-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickSave();
                      }}
                      className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      <FiCheck className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickCancel();
                      }}
                      className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <span 
                  className="text-lg font-bold text-gray-900 cursor-pointer hover:text-blue-600"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleQuickEdit(product.productId, 'price', product.price);
                  }}
                  title="Double-click to edit price"
                >
                  ₹{product.price}
                </span>
              )}
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.comparePrice}</span>
              )}
            </div>
            
            {/* Status Badge */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              product.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {product.status}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            {/* Stock with inline editing */}
            {isEditing && editingField.field === 'stockQuantity' ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-1">Stock:</span>
                <input
                  type="number"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-16 px-1 py-0.5 border border-blue-300 rounded text-sm"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleQuickSave();
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      handleQuickCancel();
                    }
                  }}
                />
                <div className="ml-2 flex space-x-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickSave();
                    }}
                    className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    <FiCheck className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickCancel();
                    }}
                    className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleQuickEdit(product.productId, 'stockQuantity', product.stockQuantity);
                }}
                title="Double-click to edit stock"
                className="cursor-pointer hover:text-blue-600"
              >
                <StockLevelIndicator 
                  stock={product.stockQuantity} 
                  lowStockThreshold={product.lowStockThreshold || 10}
                />
              </div>
            )}
            <span>{product.category?.name || 'Uncategorized'}</span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between border-t pt-3 gap-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/vendor/products/edit/${product.productId}`);
                }}
                disabled={isLoading}
                className={`text-blue-600 hover:text-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Edit product"
              >
                <FiEdit className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicateProduct(product.productId);
                }}
                disabled={isLoading}
                className={`text-gray-600 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Duplicate product"
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 rounded-full border-2 border-t-transparent border-gray-600 animate-spin"></span>
                ) : (
                  <FiCopy className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProduct(product.productId);
                }}
                disabled={isLoading}
                className={`text-red-600 hover:text-red-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Delete product"
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 rounded-full border-2 border-t-transparent border-red-600 animate-spin"></span>
                ) : (
                  <FiTrash2 className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(product);
                }}
                disabled={isLoading}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  product.status === 'ACTIVE' 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow'
                }`}
                title={product.status === 'ACTIVE' ? 'Deactivate product' : 'Activate product'}
              >
                <FiToggleLeft 
                  className={`h-3.5 w-3.5 mr-1 transition-transform duration-300 ${
                    product.status === 'ACTIVE' ? 'transform rotate-180' : ''
                  }`} 
                />
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="h-3 w-3 mr-1 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
                    <span className="hidden sm:inline">
                      {product.status === 'ACTIVE' ? 'Deactivating...' : 'Activating...'}
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="hidden sm:inline">
                      {product.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </span>
                    <span className="sm:hidden">
                      {product.status === 'ACTIVE' ? 'Off' : 'On'}
                    </span>
                  </span>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/vendor/products/${product.productId}/variants`);
                }}
                disabled={isLoading}
                className={`text-gray-600 hover:text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Manage variants"
              >
                <FiPackage className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FiPackage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {filters.search || filters.status || filters.category 
                  ? 'No products match your current filters. Try adjusting your search criteria.' 
                  : 'You haven\'t added any products yet. Start by creating your first product.'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/vendor/products/add"
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-medium inline-flex items-center"
                >
                  <FiPlus className="h-5 w-5 mr-2" />
                  Add Your First Product
                </Link>
                {(filters.search || filters.status || filters.category) && (
                  <button
                    onClick={() => {
                      setFilters({
                        search: '',
                        status: '',
                        category: '',
                        page: 0,
                        size: 10,
                        sortBy: 'createdAt',
                        sortDir: 'desc'
                      });
                    }}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Select All Checkbox and Selection Summary */}
              {products.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Select all products ({products.length})
                    </label>
                  </div>
                  
                  {getSelectedCount() > 0 && (
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800">
                          {getSelectedCount()} selected
                        </span>
                      </div>
                      <button
                        onClick={clearSelection}
                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Clear selection
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            </>
          )}

          {/* Enhanced Bulk Action Toolbar */}
          <BulkActionToolbar
            selectedCount={getSelectedCount()}
            onClearSelection={clearSelection}
            onBulkAction={handleBulkAction}
            isOperationInProgress={isOperationInProgress()}
            visible={bulkToolbarVisible}
          />

          {/* Progress Indicator */}
          <ProgressIndicator
            isVisible={isOperationInProgress()}
            operationProgress={operationProgress}
            operationStatusText={getOperationStatusText()}
            onClose={cancelBulkOperation}
            onCancel={cancelBulkOperation}
          />

          {/* Bulk Operation Modal */}
          {showBulkModal && selectedBulkOperation && (
            <BulkOperationModal
              operation={selectedBulkOperation}
              selectedCount={getSelectedCount()}
              categories={bulkCategories}
              onClose={handleBulkModalClose}
              onExecute={handleBulkOperationExecute}
            />
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

          {/* Confirmation Modal */}
          <ConfirmModal
            isOpen={showConfirmModal}
            onClose={handleCancelDuplicate}
            onConfirm={handleConfirmDuplicate}
            title="Duplicate Product"
            message="Are you sure you want to duplicate this product? This will create a new copy with &quot;-Copy&quot; added to the name."
            confirmText="Yes, Duplicate"
            cancelText="Cancel"
            type="info"
            icon={FiCopy}
            loading={duplicateLoading}
          />

          {/* Success Modal */}
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={handleCloseSuccessModal}
            title="Product Duplicated Successfully!"
            message={successMessage}
            buttonText="Continue"
          />
        </div>
      </div>
    </div>
  );
};

export default VendorProducts; 