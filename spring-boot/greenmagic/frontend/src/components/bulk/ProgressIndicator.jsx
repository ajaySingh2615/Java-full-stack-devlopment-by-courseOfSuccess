import React from 'react';
import {
  FiLoader,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';

/**
 * Progress indicator for bulk operations
 * Shows real-time progress with status-based styling
 */
const ProgressIndicator = ({
  isVisible,
  operationProgress,
  operationStatusText,
  onClose,
  onCancel
}) => {
  if (!isVisible || !operationProgress) return null;

  const { status, progress } = operationProgress;
  const progressPercentage = progress?.percentage || 0;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <FiLoader className="animate-spin h-4 w-4 text-blue-600" />;
      case 'processing':
        return <FiLoader className="animate-spin h-4 w-4 text-blue-600" />;
      case 'completed':
        return <FiCheck className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <FiX className="h-4 w-4 text-red-600" />;
      default:
        return <FiInfo className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'processing':
        return 'border-blue-200 bg-blue-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-blue-600';
      case 'processing':
        return 'bg-blue-600';
      case 'completed':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusText = () => {
    if (operationStatusText) return operationStatusText;
    
    switch (status) {
      case 'pending':
        return 'Starting operation...';
      case 'processing':
        return `Processing ${progress?.processed || 0} of ${progress?.total || 0} items`;
      case 'completed':
        return `Completed successfully - ${progress?.successful || 0} items processed`;
      case 'failed':
        return `Operation failed - ${progress?.failed || 0} items failed`;
      default:
        return 'Processing...';
    }
  };

  const showResults = status === 'completed' || status === 'failed';
  const canCancel = status === 'pending' || status === 'processing';

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full bg-white rounded-lg shadow-lg border-2 ${getStatusColor()} z-50 transition-all duration-300`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <h3 className="text-sm font-medium text-gray-900">
              Bulk Operation Progress
            </h3>
          </div>
          
          {/* Close button for completed/failed operations */}
          {!canCancel && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{getStatusText()}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
        </div>

        {/* Progress Details */}
        {progress && (
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium">{progress.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processed:</span>
              <span className="font-medium">{progress.processed || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Successful:</span>
              <span className="font-medium text-green-600">{progress.successful || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Failed:</span>
              <span className="font-medium text-red-600">{progress.failed || 0}</span>
            </div>
          </div>
        )}

        {/* Current Phase */}
        {progress?.currentPhase && (
          <div className="mb-3">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Current phase:</span> {progress.currentPhase}
            </p>
          </div>
        )}

        {/* Results Summary */}
        {showResults && operationProgress.results && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              {operationProgress.results.summary || 'Operation completed.'}
            </p>
            
            {/* Failed Items */}
            {operationProgress.results.failedItems && operationProgress.results.failedItems.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-red-600 mb-1">
                  Failed items ({operationProgress.results.failedItems.length}):
                </p>
                <div className="max-h-24 overflow-y-auto">
                  {operationProgress.results.failedItems.slice(0, 5).map((item, index) => (
                    <div key={index} className="text-xs text-red-600 mb-1">
                      • {item.productName || `Product ${item.productId}`}: {item.errorMessage}
                    </div>
                  ))}
                  {operationProgress.results.failedItems.length > 5 && (
                    <div className="text-xs text-red-600">
                      ... and {operationProgress.results.failedItems.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Download URL for exports */}
            {operationProgress.downloadUrl && (
              <div className="mt-2">
                <a
                  href={operationProgress.downloadUrl}
                  download
                  className="text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  Download export file
                </a>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-3">
          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
          
          {showResults && (
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator; 