import React from 'react';

/**
 * StockLevelIndicator Component
 * 
 * Displays a visual indicator of product stock levels with color coding
 */
const StockLevelIndicator = ({ 
  stock, 
  lowStockThreshold = 10,
  showQuantity = true,
  className = ''
}) => {
  // Determine stock level
  const getStockLevel = () => {
    if (stock <= 0) return 'out';
    if (stock <= lowStockThreshold) return 'low';
    if (stock <= lowStockThreshold * 2) return 'medium';
    return 'high';
  };

  // Get appropriate colors based on stock level
  const getStockClasses = () => {
    const level = getStockLevel();
    
    switch (level) {
      case 'high':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-red-500';
      case 'out':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  // Get appropriate text based on stock level
  const getStockText = () => {
    const level = getStockLevel();
    
    switch (level) {
      case 'high':
        return 'In Stock';
      case 'medium':
        return 'Good Stock';
      case 'low':
        return 'Low Stock';
      case 'out':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getStockClasses()}`} />
      <div className="text-xs font-medium text-gray-700">
        {showQuantity ? (
          <>
            <span className="font-semibold">{stock}</span> units
          </>
        ) : (
          getStockText()
        )}
      </div>
    </div>
  );
};

export default StockLevelIndicator; 