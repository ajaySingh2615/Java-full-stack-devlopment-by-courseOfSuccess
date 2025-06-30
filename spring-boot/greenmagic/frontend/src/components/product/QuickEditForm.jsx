import React, { useState, useEffect } from 'react';
import { FiSave, FiX, FiDollarSign, FiPackage, FiToggleLeft } from 'react-icons/fi';
import vendorService from '../../services/vendorService';

const QuickEditForm = ({
  product,
  productDetails,
  vendorId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    price: '',
    stockQuantity: '',
    status: 'active',
    lowStockThreshold: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        price: product.price || '',
        stockQuantity: product.stockQuantity || '',
        status: product.status || 'active',
        lowStockThreshold: productDetails?.inventory?.lowStockThreshold || ''
      });
    }
  }, [product, productDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }

    if (!formData.stockQuantity || isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Please enter a valid stock quantity (0 or greater)';
    }

    if (formData.lowStockThreshold && (isNaN(parseInt(formData.lowStockThreshold)) || parseInt(formData.lowStockThreshold) < 0)) {
      newErrors.lowStockThreshold = 'Please enter a valid low stock threshold';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const updateData = {
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        status: formData.status
      };

      // If lowStockThreshold is provided, include it
      if (formData.lowStockThreshold) {
        updateData.lowStockThreshold = parseInt(formData.lowStockThreshold);
      }

      const response = await vendorService.quickUpdateProduct(vendorId, product.productId, updateData);
      
      if (response.success) {
        const updatedProduct = {
          ...product,
          ...updateData
        };
        onSave(updatedProduct);
      } else {
        throw new Error(response.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.message || 'Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Price Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            <FiDollarSign className="inline h-4 w-4 mr-1" />
            Selling Price (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className={`block w-full px-3 py-2 border rounded-md text-sm focus:ring-green-500 focus:border-green-500 ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
          {formData.price && !errors.price && (
            <p className="mt-1 text-sm text-gray-500">
              Display: {formatCurrency(formData.price)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
            <FiPackage className="inline h-4 w-4 mr-1" />
            Stock Quantity
          </label>
          <input
            type="number"
            id="stockQuantity"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            min="0"
            className={`block w-full px-3 py-2 border rounded-md text-sm focus:ring-green-500 focus:border-green-500 ${
              errors.stockQuantity ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.stockQuantity && (
            <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
          )}
        </div>
      </div>

      {/* Status and Low Stock Threshold */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            <FiToggleLeft className="inline h-4 w-4 mr-1" />
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div>
          <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
            Low Stock Alert Threshold
          </label>
          <input
            type="number"
            id="lowStockThreshold"
            name="lowStockThreshold"
            value={formData.lowStockThreshold}
            onChange={handleInputChange}
            min="0"
            className={`block w-full px-3 py-2 border rounded-md text-sm focus:ring-green-500 focus:border-green-500 ${
              errors.lowStockThreshold ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="10"
          />
          {errors.lowStockThreshold && (
            <p className="mt-1 text-sm text-red-600">{errors.lowStockThreshold}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Alert when stock falls below this number
          </p>
        </div>
      </div>

      {/* Quick Stats Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Preview Changes</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formData.price ? formatCurrency(formData.price) : '₹0.00'}
            </p>
            <p className="text-xs text-gray-500">New Price</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formData.stockQuantity || 0} units
            </p>
            <p className="text-xs text-gray-500">Stock Level</p>
          </div>
          <div>
            <p className={`text-lg font-bold ${
              formData.status === 'active' ? 'text-green-600' :
              formData.status === 'draft' ? 'text-gray-600' :
              'text-yellow-600'
            }`}>
              {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
            </p>
            <p className="text-xs text-gray-500">Status</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={loading}
        >
          <FiX className="h-4 w-4 mr-1.5 inline" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="h-4 w-4 mr-1.5 inline" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default QuickEditForm; 