import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiAlertTriangle,
  FiCheck,
  FiLoader,
  FiToggleLeft,
  FiDollarSign,
  FiPackage,
  FiTag,
  FiFolder,
  FiDownload,
  FiTrash2
} from 'react-icons/fi';
import vendorService from '../../services/vendorService';

/**
 * Modal for bulk operations with dynamic forms based on operation type
 */
const BulkOperationModal = ({
  operation,
  selectedCount,
  onClose,
  onExecute,
  categories = []
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);

  // Reset form when operation changes
  useEffect(() => {
    setFormData({});
    setErrors({});
    setConfirmationStep(0);
  }, [operation]);

  const operationConfig = {
    status_change: {
      title: 'Change Product Status',
      icon: FiToggleLeft,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      confirmations: 1,
      description: 'Update the status of selected products'
    },
    price_update: {
      title: 'Update Product Prices',
      icon: FiDollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      confirmations: 1,
      description: 'Modify prices for selected products'
    },
    stock_update: {
      title: 'Update Stock Levels',
      icon: FiPackage,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      confirmations: 1,
      description: 'Update inventory levels for selected products'
    },
    category_assignment: {
      title: 'Assign Category',
      icon: FiFolder,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      confirmations: 1,
      description: 'Assign products to a category'
    },
    delete: {
      title: 'Delete Products',
      icon: FiTrash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      confirmations: 2,
      description: 'Permanently delete selected products'
    }
  };

  const config = operationConfig[operation] || operationConfig.status_change;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    switch (operation) {
      case 'status_change':
        if (!formData.newStatus) {
          newErrors.newStatus = 'Status is required';
        }
        break;
      
      case 'price_update':
        if (!formData.method) {
          newErrors.method = 'Update method is required';
        }
        if (!formData.value || formData.value <= 0) {
          newErrors.value = 'Value must be greater than 0';
        }
        break;
      
      case 'stock_update':
        if (!formData.method) {
          newErrors.method = 'Update method is required';
        }
        if (formData.value === undefined || formData.value < 0) {
          newErrors.value = 'Value must be 0 or greater';
        }
        break;
      
      case 'category_assignment':
        if (!formData.categoryId) {
          newErrors.categoryId = 'Category is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Handle confirmation steps for destructive operations
    if (operation === 'delete' && confirmationStep < config.confirmations) {
      setConfirmationStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform frontend form data to backend DTO format
      const transformedData = transformFormDataToBackendFormat(formData);
      await onExecute(transformedData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transform frontend form data to match backend DTO structure
const transformFormDataToBackendFormat = (formData) => {
  const parameters = {};
  
  switch (operation) {
    case 'status_change':
      parameters.statusChange = {
        newStatus: formData.newStatus?.toUpperCase()
      };
      break;
    
    case 'price_update':
      parameters.priceUpdate = {
        method: formData.method,
        value: parseFloat(formData.value),
        applyToVariants: formData.applyToVariants || false
      };
      break;
    
    case 'stock_update':
      parameters.stockUpdate = {
        method: formData.method,
        value: parseInt(formData.value, 10),
        applyToVariants: formData.applyToVariants || false
      };
      break;
    
    case 'category_assignment':
      parameters.categoryAssignment = {
        categoryId: parseInt(formData.categoryId, 10)
      };
      break;
    
    case 'delete':
      // No parameters needed for delete operation
      break;
  }
  
  return parameters;
};

  const renderFormFields = () => {
    switch (operation) {
      case 'status_change':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={formData.newStatus || ''}
                onChange={(e) => handleInputChange('newStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select status...</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              {errors.newStatus && (
                <p className="mt-1 text-sm text-red-600">{errors.newStatus}</p>
              )}
            </div>
          </div>
        );
      
      case 'price_update':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Method
              </label>
              <select
                value={formData.method || ''}
                onChange={(e) => handleInputChange('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select method...</option>
                <option value="percentage">Percentage Change</option>
                <option value="fixed_amount">Fixed Amount Change</option>
                <option value="set_price">Set Exact Price</option>
              </select>
              {errors.method && (
                <p className="mt-1 text-sm text-red-600">{errors.method}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.method === 'percentage' ? 'Percentage (%)' : 
                 formData.method === 'set_price' ? 'New Price ($)' : 'Amount ($)'}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.value || ''}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter value..."
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="applyToVariants"
                checked={formData.applyToVariants || false}
                onChange={(e) => handleInputChange('applyToVariants', e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="applyToVariants" className="ml-2 block text-sm text-gray-700">
                Apply to product variants
              </label>
            </div>
          </div>
        );
      
      case 'stock_update':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Method
              </label>
              <select
                value={formData.method || ''}
                onChange={(e) => handleInputChange('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select method...</option>
                <option value="increase">Increase Stock</option>
                <option value="decrease">Decrease Stock</option>
                <option value="set_quantity">Set Exact Quantity</option>
              </select>
              {errors.method && (
                <p className="mt-1 text-sm text-red-600">{errors.method}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.method === 'set_quantity' ? 'New Quantity' : 'Amount'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.value || ''}
                onChange={(e) => handleInputChange('value', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter quantity..."
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="applyToVariants"
                checked={formData.applyToVariants || false}
                onChange={(e) => handleInputChange('applyToVariants', e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="applyToVariants" className="ml-2 block text-sm text-gray-700">
                Apply to product variants
              </label>
            </div>
          </div>
        );
      
      case 'category_assignment':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>
          </div>
        );
      
      case 'delete':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <FiAlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-800">
                  Warning: This action cannot be undone
                </h3>
              </div>
              <p className="mt-2 text-sm text-red-700">
                You are about to permanently delete {selectedCount} product{selectedCount !== 1 ? 's' : ''}. 
                This will remove all associated data including variants, images, and order history.
              </p>
            </div>
            
            {confirmationStep >= 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Please type "DELETE" to confirm:
                </p>
                <input
                  type="text"
                  value={formData.confirmText || ''}
                  onChange={(e) => handleInputChange('confirmText', e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Type DELETE to confirm"
                />
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const getActionButtonText = () => {
    if (operation === 'delete') {
      if (confirmationStep === 0) return 'Continue';
      if (confirmationStep === 1 && formData.confirmText !== 'DELETE') return 'Type DELETE to confirm';
      return 'Delete Products';
    }
    return isSubmitting ? 'Processing...' : `${config.title}`;
  };

  const isActionDisabled = () => {
    if (isSubmitting) return true;
    if (operation === 'delete') {
      if (confirmationStep === 0) return false;
      if (confirmationStep === 1) return formData.confirmText !== 'DELETE';
    }
    return false;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* Header */}
            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${config.bgColor}`}>
              <div className="sm:flex sm:items-start">
                <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${config.bgColor} sm:mx-0 sm:h-10 sm:w-10`}>
                  <config.icon className={`h-6 w-6 ${config.color}`} />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {config.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {config.description} ({selectedCount} product{selectedCount !== 1 ? 's' : ''} selected)
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="px-4 py-3 sm:px-6">
                {renderFormFields()}
                
                            {errors.submit && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center">
                  <FiAlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <p className="text-sm text-red-600 font-medium">Operation Failed</p>
                </div>
                <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
              </div>
            )}
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  disabled={isActionDisabled()}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    operation === 'delete' 
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  } ${isActionDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting && <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                  {getActionButtonText()}
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  };
  
  export default BulkOperationModal; 