import React, { useState } from 'react';
import { 
  FiTag, 
  FiCalendar, 
  FiDollarSign, 
  FiPackage,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiShoppingCart,
  FiStar,
  FiBox,
  FiAlertTriangle,
  FiRefreshCw,
  FiEdit3,
  FiSave,
  FiX
} from 'react-icons/fi';
import ProductImageGallery from './ProductImageGallery';
import QuickEditForm from './QuickEditForm';

const ProductInfoTabs = ({ 
  activeTab, 
  product, 
  productDetails, 
  vendorId, 
  onProductUpdate 
}) => {
  const [isQuickEditing, setIsQuickEditing] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-IN').format(number || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderOverviewTab = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Images */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
          <ProductImageGallery
            images={productDetails?.media?.images || [product?.imageUrl]}
            productName={product?.name}
            showThumbnails={true}
          />
        </div>

        {/* Right Column - Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Product Name</label>
                  <p className="text-sm font-medium text-gray-900">{product?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">SKU</label>
                  <p className="text-sm font-medium text-gray-900">{product?.sku || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {product?.description || 'No description available'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="text-sm font-medium text-gray-900">{product?.category?.name || 'Uncategorized'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product?.status === 'active' ? 'bg-green-100 text-green-800' :
                    product?.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product?.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Created</label>
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                    {product?.createdAt ? formatDate(product.createdAt) : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Modified</label>
                  <p className="text-sm font-medium text-gray-900 flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2 text-gray-400" />
                    {product?.updatedAt ? formatDate(product.updatedAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Selling Price</label>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(product?.price)}</p>
              </div>
              {productDetails?.pricing?.comparePrice && (
                <div>
                  <label className="text-sm text-gray-500">Compare Price</label>
                  <p className="text-sm font-medium text-gray-500 line-through">
                    {formatCurrency(productDetails.pricing.comparePrice)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Analytics Cards */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiEye className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Page Views</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatNumber(productDetails?.analytics?.pageViews || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiShoppingCart className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Sales</p>
              <p className="text-2xl font-bold text-green-900">
                {formatNumber(productDetails?.analytics?.totalSales || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiDollarSign className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Revenue</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(productDetails?.analytics?.totalRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiStar className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-900">
                {(productDetails?.analytics?.averageRating || 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {((productDetails?.analytics?.addToCartRate || 0) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Add to Cart Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {((productDetails?.analytics?.conversionRate || 0) * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Conversion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(productDetails?.analytics?.reviewCount || 0)}
            </p>
            <p className="text-sm text-gray-500">Reviews</p>
          </div>
        </div>
      </div>

      {/* Placeholder for charts */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <FiTrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Sales trend chart coming soon</p>
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="p-6 space-y-6">
      {/* Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiBox className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(product?.stockQuantity || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiAlertTriangle className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock Alert</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(productDetails?.inventory?.lowStockThreshold || 10)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <FiRefreshCw className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Track Quantity</p>
              <p className="text-sm font-medium text-gray-900">
                {productDetails?.inventory?.trackQuantity ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Main Product</p>
              <p className="text-sm text-gray-500">SKU: {product?.sku || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{product?.stockQuantity || 0} units</p>
              <p className={`text-sm ${
                (product?.stockQuantity || 0) <= (productDetails?.inventory?.lowStockThreshold || 10)
                  ? 'text-red-600' : 'text-green-600'
              }`}>
                {(product?.stockQuantity || 0) <= (productDetails?.inventory?.lowStockThreshold || 10)
                  ? 'Low Stock' : 'In Stock'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Variants (if any) */}
      {productDetails?.inventory?.variants && productDetails.inventory.variants.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
          <div className="space-y-3">
            {productDetails.inventory.variants.map((variant, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{variant.name}</p>
                  <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{variant.stock} units</p>
                  <p className="text-sm text-gray-500">{formatCurrency(variant.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reorder Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Reorder Recommendations</h3>
        <p className="text-blue-700 mb-4">
          Based on sales velocity, we recommend reordering when stock drops below {
            Math.ceil((productDetails?.inventory?.lowStockThreshold || 10) * 1.5)
          } units.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
          Set Reorder Alert
        </button>
      </div>
    </div>
  );

  const renderActionsTab = () => (
    <div className="p-6 space-y-6">
      {/* Quick Edit Section */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Quick Edit</h3>
          <button
            onClick={() => setIsQuickEditing(!isQuickEditing)}
            className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {isQuickEditing ? (
              <>
                <FiX className="h-4 w-4 mr-1" />
                Cancel
              </>
            ) : (
              <>
                <FiEdit3 className="h-4 w-4 mr-1" />
                Edit
              </>
            )}
          </button>
        </div>
        
        <div className="p-6">
          {isQuickEditing ? (
            <QuickEditForm
              product={product}
              productDetails={productDetails}
              vendorId={vendorId}
              onSave={(updatedProduct) => {
                onProductUpdate?.(updatedProduct);
                setIsQuickEditing(false);
              }}
              onCancel={() => setIsQuickEditing(false)}
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Price</label>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(product?.price)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Stock</label>
                  <p className="text-lg font-bold text-gray-900">{product?.stockQuantity || 0} units</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-500">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product?.status === 'active' ? 'bg-green-100 text-green-800' :
                    product?.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product?.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Export Product Data</span>
              <span className="text-sm text-gray-500">CSV</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Download product information and statistics</p>
          </button>
          
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Generate Report</span>
              <span className="text-sm text-gray-500">PDF</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Create detailed product performance report</p>
          </button>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600 rounded border-gray-300"
              defaultChecked={productDetails?.inventory?.trackQuantity}
            />
            <span className="ml-2 text-sm text-gray-700">Track inventory quantity</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600 rounded border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Allow backorders</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600 rounded border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Send low stock alerts</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'inventory':
        return renderInventoryTab();
      case 'actions':
        return renderActionsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-96">
      {renderTabContent()}
    </div>
  );
};

export default ProductInfoTabs; 