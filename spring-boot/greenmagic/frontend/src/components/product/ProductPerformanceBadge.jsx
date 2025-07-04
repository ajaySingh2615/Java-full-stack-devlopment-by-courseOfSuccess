import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

/**
 * ProductPerformanceBadge Component
 * 
 * Displays performance indicators for products such as sales performance and trends
 */
const ProductPerformanceBadge = ({ 
  type, 
  value, 
  avgValue, 
  trend,
  showLabel = false,
  className = ''
}) => {
  // Handle undefined or null values
  const safeValue = value !== undefined && value !== null ? value : 0;
  const safeAvgValue = avgValue !== undefined && avgValue !== null ? avgValue : 0;
  const safeTrend = trend || 'stable';
  
  // Determine sales performance level
  const getSalesPerformanceLevel = () => {
    if (!safeValue || !safeAvgValue) return 'medium';
    if (safeValue > safeAvgValue * 1.5) return 'high';
    if (safeValue > safeAvgValue * 0.5) return 'medium';
    return 'low';
  };

  // Get appropriate badge colors based on performance level
  const getBadgeClasses = () => {
    const level = getSalesPerformanceLevel();
    
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get trend icon and color
  const getTrendDisplay = () => {
    switch (safeTrend) {
      case 'up':
        return { 
          icon: <FiTrendingUp className="h-3.5 w-3.5" />, 
          color: 'text-green-600' 
        };
      case 'down':
        return { 
          icon: <FiTrendingDown className="h-3.5 w-3.5" />, 
          color: 'text-red-600' 
        };
      default:
        return { 
          icon: <FiMinus className="h-3.5 w-3.5" />, 
          color: 'text-gray-600' 
        };
    }
  };

  // Render sales performance badge
  if (type === 'sales') {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeClasses()} ${className}`}>
        {showLabel && <span className="mr-1">Sales:</span>}
        <span>{safeValue}</span>
      </div>
    );
  }

  // Render trend indicator
  if (type === 'trend') {
    const { icon, color } = getTrendDisplay();
    return (
      <div className={`inline-flex items-center ${color} ${className}`} title={`Trend: ${safeTrend}`}>
        {icon}
      </div>
    );
  }

  // Default empty badge
  return null;
};

export default ProductPerformanceBadge; 