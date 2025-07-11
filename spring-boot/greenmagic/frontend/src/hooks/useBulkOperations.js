import { useState, useEffect, useCallback } from 'react';
import vendorService from '../services/vendorService';

/**
 * Custom hook for managing bulk operations on products
 * Handles selection state, operation execution, and progress tracking
 */
export const useBulkOperations = () => {
    // Selection state
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [bulkToolbarVisible, setBulkToolbarVisible] = useState(false);
    
    // Operation state
    const [activeOperation, setActiveOperation] = useState(null);
    const [operationProgress, setOperationProgress] = useState(null);
    const [operationHistory, setOperationHistory] = useState([]);
    
    // Progress polling
    const [pollInterval, setPollInterval] = useState(null);
    
    // Update toolbar visibility based on selection
    useEffect(() => {
        setBulkToolbarVisible(selectedProducts.size > 0);
    }, [selectedProducts]);
    
    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [pollInterval]);
    
    /**
     * Select/deselect a product
     */
    const selectProduct = useCallback((productId) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    }, []);
    
    /**
     * Select all products from a list
     */
    const selectAllProducts = useCallback((productIds) => {
        if (selectAll) {
            setSelectedProducts(new Set());
            setSelectAll(false);
        } else {
            setSelectedProducts(new Set(productIds));
            setSelectAll(true);
        }
    }, [selectAll]);
    
    /**
     * Select only filtered products
     */
    const selectFilteredProducts = useCallback((filteredProductIds) => {
        setSelectedProducts(new Set(filteredProductIds));
        setSelectAll(false);
    }, []);
    
    /**
     * Clear all selections
     */
    const clearSelection = useCallback(() => {
        setSelectedProducts(new Set());
        setSelectAll(false);
    }, []);
    
    /**
     * Check if a product is selected
     */
    const isProductSelected = useCallback((productId) => {
        return selectedProducts.has(productId);
    }, [selectedProducts]);
    
    /**
     * Get selected product count
     */
    const getSelectedCount = useCallback(() => {
        return selectedProducts.size;
    }, [selectedProducts]);
    
    /**
     * Get array of selected product IDs
     */
    const getSelectedProductIds = useCallback(() => {
        return Array.from(selectedProducts);
    }, [selectedProducts]);
    
    /**
     * Validate bulk operation
     */
    const validateBulkOperation = useCallback((operation, parameters) => {
        console.log('🔍 Validating bulk operation:', { operation, parameters });
        
        const selectedCount = selectedProducts.size;
        
        if (selectedCount === 0) {
            return { valid: false, message: 'No products selected' };
        }
        
        if (selectedCount > 100) {
            return { valid: false, message: 'Too many products selected (maximum 100)' };
        }
        
        switch (operation) {
            case 'price_update':
                // Check the nested structure for price updates
                const priceParams = parameters?.priceUpdate;
                console.log('💰 Price update params:', priceParams);
                
                if (!priceParams?.method) {
                    return { valid: false, message: 'Price update method is required' };
                }
                
                if (priceParams.value === undefined || priceParams.value === null || isNaN(priceParams.value)) {
                    return { valid: false, message: 'Price value must be a valid number' };
                }
                
                // For "set_price" method, value must be positive
                if (priceParams.method === 'set_price' && priceParams.value <= 0) {
                    return { valid: false, message: 'Price must be greater than 0 when setting exact price' };
                }
                break;
            case 'stock_update':
                const stockParams = parameters?.stockUpdate;
                if (stockParams && stockParams.value < 0) {
                    return { valid: false, message: 'Stock value cannot be negative' };
                }
                break;
            case 'category_assignment':
                if (!parameters?.categoryAssignment?.categoryId) {
                    return { valid: false, message: 'Category must be selected' };
                }
                break;
        }
        
        return { valid: true };
    }, [selectedProducts]);
    
        /**
     * Start progress polling
     */
    const startProgressPolling = useCallback((operationId, onComplete) => {
        if (pollInterval) {
            clearInterval(pollInterval);
        }
        
        let pollCount = 0;
        const maxPolls = 150; // 5 minutes with 2-second intervals
        
        const interval = setInterval(async () => {
            pollCount++;
            
            try {
                const response = await vendorService.getBulkOperationStatus(operationId);
                
                if (response.success) {
                    const progressData = response.data;
                    console.log('📊 Progress update:', progressData.status, progressData.progress?.percentage + '%');
                    setOperationProgress(progressData);
                    
                    // Stop polling if operation is completed or failed
                    if (progressData.status === 'completed' || progressData.status === 'failed') {
                        clearInterval(interval);
                        setPollInterval(null);
                        
                        // Add to history
                        setOperationHistory(prev => [...prev, {
                            ...activeOperation,
                            endTime: new Date(),
                            result: progressData
                        }]);
                        
                        // Call completion callback if provided
                        if (onComplete) {
                            onComplete(progressData);
                        }
                        
                        // Clear operation after a brief delay
                        setTimeout(() => {
                            setActiveOperation(null);
                            setOperationProgress(null);
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('Error polling operation status:', error);
                
                // Stop polling after too many failures or timeout
                if (pollCount >= maxPolls) {
                    clearInterval(interval);
                    setPollInterval(null);
                    
                    // Set error state
                    setOperationProgress(prev => ({
                        ...prev,
                        status: 'failed',
                        progress: {
                            ...prev?.progress,
                            currentPhase: 'Connection timeout - operation may still be running'
                        }
                    }));
                    
                    // Call completion callback with error
                    if (onComplete) {
                        onComplete({ status: 'failed', error: 'Connection timeout' });
                    }
                    
                    setTimeout(() => {
                        setActiveOperation(null);
                        setOperationProgress(null);
                    }, 5000);
                }
            }
        }, 2000);
        
        setPollInterval(interval);
    }, [activeOperation, pollInterval]);

    /**
     * Start bulk operation
     */
    const startBulkOperation = useCallback(async (vendorId, operation, parameters, onComplete) => {
        const validation = validateBulkOperation(operation, parameters);
        if (!validation.valid) {
            throw new Error(validation.message);
        }
        
        const productIds = Array.from(selectedProducts);
        
        try {
            // Start the operation
            const requestData = {
                operation,
                productIds,
                parameters
            };
            
            const response = await vendorService.executeBulkOperation(vendorId, requestData);
            
            if (response.success) {
                const operationData = response.data;
                setActiveOperation({
                    id: operationData.operationId,
                    type: operation,
                    parameters,
                    productIds,
                    startTime: new Date()
                });
                setOperationProgress(operationData);
                
                // Start polling for progress
                startProgressPolling(operationData.operationId, onComplete);
                
                return { success: true, operationId: operationData.operationId };
            } else {
                throw new Error(response.error || 'Failed to start bulk operation');
            }
        } catch (error) {
            throw new Error(`Failed to start bulk operation: ${error.message}`);
        }
    }, [selectedProducts, validateBulkOperation, startProgressPolling]);
    
    /**
     * Cancel bulk operation
     */
    const cancelBulkOperation = useCallback(() => {
        if (pollInterval) {
            clearInterval(pollInterval);
            setPollInterval(null);
        }
        setActiveOperation(null);
        setOperationProgress(null);
    }, [pollInterval]);
    
    /**
     * Get progress percentage
     */
    const getProgressPercentage = useCallback(() => {
        if (!operationProgress || !operationProgress.progress) return 0;
        return operationProgress.progress.percentage || 0;
    }, [operationProgress]);
    
    /**
     * Check if operation is in progress
     */
    const isOperationInProgress = useCallback(() => {
        return activeOperation && operationProgress && 
               (operationProgress.status === 'pending' || operationProgress.status === 'processing');
    }, [activeOperation, operationProgress]);
    
    /**
     * Get operation status text
     */
    const getOperationStatusText = useCallback(() => {
        if (!operationProgress) return '';
        
        const progress = operationProgress.progress;
        if (!progress) return operationProgress.status;
        
        return `${progress.currentPhase} - ${progress.processed || 0}/${progress.total || 0} processed`;
    }, [operationProgress]);
    
    return {
        // Selection state
        selectedProducts,
        selectAll,
        bulkToolbarVisible,
        
        // Operation state
        activeOperation,
        operationProgress,
        operationHistory,
        
        // Selection actions
        selectProduct,
        selectAllProducts,
        selectFilteredProducts,
        clearSelection,
        isProductSelected,
        getSelectedCount,
        getSelectedProductIds,
        
        // Operation actions
        startBulkOperation,
        cancelBulkOperation,
        validateBulkOperation,
        
        // Progress tracking
        getProgressPercentage,
        isOperationInProgress,
        getOperationStatusText
    };
}; 