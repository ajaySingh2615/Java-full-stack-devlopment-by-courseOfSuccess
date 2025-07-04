import React from 'react';
import { 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiCopy, 
  FiToggleLeft, 
  FiPackage 
} from 'react-icons/fi';

/**
 * QuickActionMenu Component
 * 
 * Displays a menu of quick actions when hovering over a product card
 */
const QuickActionMenu = ({ 
  product, 
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onManageVariants,
  loading = false,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg ${className}`}>
      <div className="flex flex-wrap justify-center gap-2 p-2">
        {/* View Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView?.(product);
          }}
          disabled={loading}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="View details"
        >
          <FiEye className="h-5 w-5 text-blue-600" />
        </button>

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.(product);
          }}
          disabled={loading}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Edit product"
        >
          <FiEdit className="h-5 w-5 text-blue-600" />
        </button>

        {/* Toggle Status Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus?.(product);
          }}
          disabled={loading}
          className={`p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={product.status === 'ACTIVE' ? 'Deactivate product' : 'Activate product'}
        >
          <FiToggleLeft 
            className={`h-5 w-5 ${product.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'} ${
              product.status === 'ACTIVE' ? 'transform rotate-180' : ''
            }`} 
          />
        </button>

        {/* Duplicate Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate?.(product);
          }}
          disabled={loading}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Duplicate product"
        >
          <FiCopy className="h-5 w-5 text-gray-600" />
        </button>

        {/* Delete Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(product);
          }}
          disabled={loading}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Delete product"
        >
          <FiTrash2 className="h-5 w-5 text-red-600" />
        </button>

        {/* Manage Variants Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onManageVariants?.(product);
          }}
          disabled={loading}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Manage variants"
        >
          <FiPackage className="h-5 w-5 text-purple-600" />
        </button>
      </div>
    </div>
  );
};

export default QuickActionMenu; 