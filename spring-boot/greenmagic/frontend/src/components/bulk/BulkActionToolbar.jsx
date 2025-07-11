import React from 'react';
import {
  FiToggleLeft,
  FiDollarSign,
  FiPackage,
  FiFolder,
  FiTrash2,
  FiX
} from 'react-icons/fi';

/**
 * Floating toolbar for bulk actions
 * Appears when products are selected and provides quick access to all bulk operations
 */
const BulkActionToolbar = ({
  selectedCount,
  onBulkAction,
  onClearSelection,
  isOperationInProgress,
  visible
}) => {
  const bulkActions = [
    {
      id: 'status_change',
      label: 'Status',
      icon: FiToggleLeft,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Change product status'
    },
    {
      id: 'price_update',
      label: 'Price',
      icon: FiDollarSign,
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Update product prices'
    },
    {
      id: 'stock_update',
      label: 'Stock',
      icon: FiPackage,
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Update stock levels'
    },
    {
      id: 'category_assignment',
      label: 'Category',
      icon: FiFolder,
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Assign categories'
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: FiTrash2,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Delete selected products'
    }
  ];

  if (!visible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transform transition-transform duration-300 ${
      visible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Selection Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              disabled={isOperationInProgress}
            >
              Clear selection
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {bulkActions.map((action) => (
              <button
                key={action.id}
                onClick={() => onBulkAction(action.id)}
                disabled={isOperationInProgress}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-white font-medium
                  transition-all duration-200
                  ${isOperationInProgress ? 'opacity-50 cursor-not-allowed' : action.color}
                  ${action.id === 'delete' ? 'border-2 border-red-200' : ''}
                `}
                title={action.description}
              >
                <action.icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">{action.label}</span>
              </button>
            ))}
            
            {/* Close Button */}
            <button
              onClick={onClearSelection}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isOperationInProgress}
              title="Close toolbar"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionToolbar; 