import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiInfo, 
  FiBarChart, 
  FiPackage, 
  FiSettings,
  FiEdit,
  FiToggleLeft,
  FiCopy,
  FiTrash2,
  FiExternalLink
} from 'react-icons/fi';
import ProductImageGallery from '../product/ProductImageGallery';
import ProductInfoTabs from '../product/ProductInfoTabs';
import QuickEditForm from '../product/QuickEditForm';
import vendorService from '../../services/vendorService';

const ProductDetailModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onProductUpdate,
  onProductDelete,
  onNavigateToEdit 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const vendorId = vendorService.getCurrentVendorId();

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiInfo },
    { id: 'analytics', name: 'Analytics', icon: FiBarChart },
    { id: 'inventory', name: 'Inventory', icon: FiPackage },
    { id: 'actions', name: 'Actions', icon: FiSettings }
  ];

  const quickActions = [
    {
      name: 'Edit Product',
      icon: FiEdit,
      action: 'edit',
      color: 'blue',
      description: 'Edit product details'
    },
    {
      name: 'Delete',
      icon: FiTrash2,
      action: 'delete',
      color: 'red',
      description: 'Delete this product permanently'
    }
  ];

  useEffect(() => {
    if (isOpen && product) {
      loadProductDetails();
    }
  }, [isOpen, product]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Focus trap management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadProductDetails = async () => {
    if (!product?.productId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await vendorService.getProductDetails(vendorId, product.productId);
      console.log('Product details API response:', response);
      
      if (response.success) {
        setProductDetails(response);
      } else {
        setError('Failed to load product details');
      }
    } catch (err) {
      console.error('Error loading product details:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    if (!product) return;

    console.log('handleQuickAction called with:', action, 'product:', product);

    try {
      setActionLoading(action);

      switch (action) {
        case 'edit':
          onNavigateToEdit?.(product.productId);
          onClose();
          break;

        case 'toggle':
          const currentStatus = product.status?.toLowerCase();
          const newStatus = currentStatus === 'active' ? 'INACTIVE' : 'ACTIVE';
          
          console.log('Toggling status from', product.status, 'to', newStatus);
          
          const response = await vendorService.updateProductStatus(vendorId, product.productId, newStatus);
          
          console.log('API response:', response);
          
          if (response.success) {
            // Update the product state in parent component
            onProductUpdate?.({
              ...product,
              status: newStatus
            });
            
            // Update local state
            setProductDetails(prev => {
              if (prev?.data?.data?.basic) {
                return {
                  ...prev,
                  data: {
                    ...prev.data,
                    data: {
                      ...prev.data.data,
                      basic: {
                        ...prev.data.data.basic,
                        status: newStatus
                      }
                    }
                  }
                };
              }
              return prev;
            });
            
            console.log('Status updated successfully');
          } else {
            throw new Error(response.error || 'Failed to update product status');
          }
          break;

        case 'duplicate':
          await vendorService.duplicateProduct(vendorId, product.productId);
          onProductUpdate?.(product); // Trigger refresh
          onClose();
          break;

        case 'delete':
          if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            await vendorService.deleteProduct(vendorId, product.productId);
            onProductDelete?.(product.productId);
            onClose();
          }
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      alert(`Failed to ${action} product. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {product?.name || 'Product Details'}
                </h2>
                {product && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                    product.status?.toLowerCase() === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.status}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {onNavigateToEdit && (
                  <button
                    onClick={() => {
                      onNavigateToEdit(product.productId);
                      onClose();
                    }}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit in full editor"
                  >
                    <FiExternalLink className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Close modal"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={loadProductDetails}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : (
                <ProductInfoTabs
                  activeTab={activeTab}
                  product={product}
                  productDetails={productDetails}
                  vendorId={vendorId}
                  onProductUpdate={onProductUpdate}
                />
              )}
            </div>

            {/* Footer with Quick Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                {product && (
                  <>
                    Created: {new Date(product.createdAt).toLocaleDateString()} • 
                    SKU: {product.sku || 'N/A'}
                  </>
                )}
              </div>
              
              <div className="flex space-x-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const isLoading = actionLoading === action.action;
                  
                  return (
                    <button
                      key={action.action}
                      onClick={() => handleQuickAction(action.action)}
                      disabled={isLoading}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        action.color === 'blue' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                        action.color === 'green' ? 'bg-green-600 text-white hover:bg-green-700' :
                        action.color === 'gray' ? 'bg-gray-600 text-white hover:bg-gray-700' :
                        action.color === 'red' ? 'bg-red-600 text-white hover:bg-red-700' :
                        'bg-gray-600 text-white hover:bg-gray-700'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={action.description}
                    >
                      <Icon className="h-4 w-4 mr-1.5" />
                      {isLoading ? 'Loading...' : action.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal; 