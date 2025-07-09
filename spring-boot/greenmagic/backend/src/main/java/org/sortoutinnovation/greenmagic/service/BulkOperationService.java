package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.dto.BulkOperationRequestDto;
import org.sortoutinnovation.greenmagic.dto.BulkOperationResponseDto;
import org.sortoutinnovation.greenmagic.model.Category;
import org.sortoutinnovation.greenmagic.model.Product;
import org.sortoutinnovation.greenmagic.model.ProductVariant;
import org.sortoutinnovation.greenmagic.repository.CategoryRepository;
import org.sortoutinnovation.greenmagic.repository.ProductRepository;
import org.sortoutinnovation.greenmagic.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Service for handling bulk operations on products
 */
@Service
@Transactional
public class BulkOperationService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    // In-memory storage for operation progress (in production, use Redis or database)
    private final Map<String, BulkOperationResponseDto> operations = new ConcurrentHashMap<>();
    
    private static final int BATCH_SIZE = 50;
    
    /**
     * Execute bulk operation asynchronously
     */
    public BulkOperationResponseDto executeBulkOperation(Integer vendorId, BulkOperationRequestDto request) {
        String operationId = UUID.randomUUID().toString();
        
        BulkOperationResponseDto response = new BulkOperationResponseDto();
        response.setOperationId(operationId);
        response.setStatus("pending");
        response.setStartTime(LocalDateTime.now());
        response.setProgress(new BulkOperationResponseDto.ProgressInfo(
            request.getProductIds().size(), 0, 0, 0, "Starting", 0.0
        ));
        response.setResults(new BulkOperationResponseDto.OperationResults(
            new ArrayList<>(), new ArrayList<>(), ""
        ));
        
        operations.put(operationId, response);
        
        // Process asynchronously (in production, use @Async or message queue)
        new Thread(() -> processBulkOperation(vendorId, request, response)).start();
        
        return response;
    }
    
    /**
     * Get operation status
     */
    public BulkOperationResponseDto getOperationStatus(String operationId) {
        return operations.get(operationId);
    }
    
    /**
     * Process bulk operation
     */
    private void processBulkOperation(Integer vendorId, BulkOperationRequestDto request, BulkOperationResponseDto response) {
        try {
            response.setStatus("processing");
            response.getProgress().setCurrentPhase("Processing products");
            
            List<Integer> productIds = request.getProductIds();
            List<Product> products = productRepository.findByIdInAndCreatedByUserId(productIds, vendorId);
            
            // Validate products exist and belong to vendor
            if (products.size() != productIds.size()) {
                handleOperationFailure(response, "Some products not found or don't belong to vendor");
                return;
            }
            
            switch (request.getOperation().toLowerCase()) {
                case "status_change":
                    processStatusChange(products, request.getParameters().getStatusChange(), response);
                    break;
                case "price_update":
                    processPriceUpdate(products, request.getParameters().getPriceUpdate(), response);
                    break;
                case "stock_update":
                    processStockUpdate(products, request.getParameters().getStockUpdate(), response);
                    break;
                case "category_assignment":
                    processCategoryAssignment(products, request.getParameters().getCategoryAssignment(), response);
                    break;
                case "tag_management":
                    processTagManagement(products, request.getParameters().getTagManagement(), response);
                    break;
                case "export":
                    processExport(products, request.getParameters().getExport(), response);
                    break;
                case "delete":
                    processDelete(products, response);
                    break;
                default:
                    handleOperationFailure(response, "Unknown operation type: " + request.getOperation());
                    return;
            }
            
            response.setStatus("completed");
            response.setEndTime(LocalDateTime.now());
            response.getProgress().setCurrentPhase("Completed");
            response.getProgress().setPercentage(100.0);
            
        } catch (Exception e) {
            handleOperationFailure(response, "Operation failed: " + e.getMessage());
        }
    }
    
    /**
     * Process status change operation
     */
    private void processStatusChange(List<Product> products, 
                                   BulkOperationRequestDto.BulkOperationParameters.StatusChangeParams params,
                                   BulkOperationResponseDto response) {
        if (params == null || params.getNewStatus() == null) {
            handleOperationFailure(response, "Status change parameters are required");
            return;
        }
        
        Product.ProductStatus newStatus;
        try {
            newStatus = Product.ProductStatus.valueOf(params.getNewStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            handleOperationFailure(response, "Invalid status: " + params.getNewStatus());
            return;
        }
        
        AtomicInteger processed = new AtomicInteger(0);
        AtomicInteger successful = new AtomicInteger(0);
        List<BulkOperationResponseDto.OperationResults.FailedItem> failedItems = new ArrayList<>();
        
        processBatch(products, BATCH_SIZE, (product) -> {
            try {
                product.setStatus(newStatus);
                productRepository.save(product);
                
                response.getResults().getSuccessfulIds().add(product.getProductId());
                successful.incrementAndGet();
                
            } catch (Exception e) {
                failedItems.add(new BulkOperationResponseDto.OperationResults.FailedItem(
                    product.getProductId(), product.getName(), e.getMessage(), "STATUS_UPDATE_FAILED"
                ));
            }
            
            int processedCount = processed.incrementAndGet();
            updateProgress(response, processedCount, successful.get(), failedItems.size());
        });
        
        response.getResults().setFailedItems(failedItems);
        response.getResults().setSummary(String.format(
            "Status updated for %d products. %d successful, %d failed.", 
            products.size(), successful.get(), failedItems.size()
        ));
    }
    
    /**
     * Process price update operation
     */
    private void processPriceUpdate(List<Product> products,
                                  BulkOperationRequestDto.BulkOperationParameters.PriceUpdateParams params,
                                  BulkOperationResponseDto response) {
        if (params == null || params.getMethod() == null || params.getValue() == null) {
            handleOperationFailure(response, "Price update parameters are required");
            return;
        }
        
        AtomicInteger processed = new AtomicInteger(0);
        AtomicInteger successful = new AtomicInteger(0);
        List<BulkOperationResponseDto.OperationResults.FailedItem> failedItems = new ArrayList<>();
        
        processBatch(products, BATCH_SIZE, (product) -> {
            try {
                BigDecimal newPrice = calculateNewPrice(product.getPrice(), params.getMethod(), params.getValue());
                product.setPrice(newPrice);
                productRepository.save(product);
                
                // Update variants if requested
                if (params.getApplyToVariants() && product.getVariants() != null) {
                    for (ProductVariant variant : product.getVariants()) {
                        BigDecimal newVariantPrice = calculateNewPrice(variant.getPrice(), params.getMethod(), params.getValue());
                        variant.setPrice(newVariantPrice);
                        productVariantRepository.save(variant);
                    }
                }
                
                response.getResults().getSuccessfulIds().add(product.getProductId());
                successful.incrementAndGet();
                
            } catch (Exception e) {
                failedItems.add(new BulkOperationResponseDto.OperationResults.FailedItem(
                    product.getProductId(), product.getName(), e.getMessage(), "PRICE_UPDATE_FAILED"
                ));
            }
            
            int processedCount = processed.incrementAndGet();
            updateProgress(response, processedCount, successful.get(), failedItems.size());
        });
        
        response.getResults().setFailedItems(failedItems);
        response.getResults().setSummary(String.format(
            "Price updated for %d products. %d successful, %d failed.", 
            products.size(), successful.get(), failedItems.size()
        ));
    }
    
    /**
     * Process stock update operation
     */
    private void processStockUpdate(List<Product> products,
                                  BulkOperationRequestDto.BulkOperationParameters.StockUpdateParams params,
                                  BulkOperationResponseDto response) {
        if (params == null || params.getMethod() == null || params.getValue() == null) {
            handleOperationFailure(response, "Stock update parameters are required");
            return;
        }
        
        AtomicInteger processed = new AtomicInteger(0);
        AtomicInteger successful = new AtomicInteger(0);
        List<BulkOperationResponseDto.OperationResults.FailedItem> failedItems = new ArrayList<>();
        
        processBatch(products, BATCH_SIZE, (product) -> {
            try {
                Integer newStock = calculateNewStock(product.getQuantity(), params.getMethod(), params.getValue());
                product.setQuantity(newStock);
                productRepository.save(product);
                
                // Update variants if requested
                if (params.getApplyToVariants() && product.getVariants() != null) {
                    for (ProductVariant variant : product.getVariants()) {
                        Integer newVariantStock = calculateNewStock(variant.getStockQuantity(), params.getMethod(), params.getValue());
                        variant.setStockQuantity(newVariantStock);
                        productVariantRepository.save(variant);
                    }
                }
                
                response.getResults().getSuccessfulIds().add(product.getProductId());
                successful.incrementAndGet();
                
            } catch (Exception e) {
                failedItems.add(new BulkOperationResponseDto.OperationResults.FailedItem(
                    product.getProductId(), product.getName(), e.getMessage(), "STOCK_UPDATE_FAILED"
                ));
            }
            
            int processedCount = processed.incrementAndGet();
            updateProgress(response, processedCount, successful.get(), failedItems.size());
        });
        
        response.getResults().setFailedItems(failedItems);
        response.getResults().setSummary(String.format(
            "Stock updated for %d products. %d successful, %d failed.", 
            products.size(), successful.get(), failedItems.size()
        ));
    }
    
    /**
     * Process category assignment operation
     */
    private void processCategoryAssignment(List<Product> products,
                                         BulkOperationRequestDto.BulkOperationParameters.CategoryAssignmentParams params,
                                         BulkOperationResponseDto response) {
        if (params == null || params.getCategoryId() == null) {
            handleOperationFailure(response, "Category assignment parameters are required");
            return;
        }
        
        Category category = categoryRepository.findById(params.getCategoryId()).orElse(null);
        if (category == null) {
            handleOperationFailure(response, "Category not found: " + params.getCategoryId());
            return;
        }
        
        AtomicInteger processed = new AtomicInteger(0);
        AtomicInteger successful = new AtomicInteger(0);
        List<BulkOperationResponseDto.OperationResults.FailedItem> failedItems = new ArrayList<>();
        
        processBatch(products, BATCH_SIZE, (product) -> {
            try {
                product.setCategory(category);
                productRepository.save(product);
                
                response.getResults().getSuccessfulIds().add(product.getProductId());
                successful.incrementAndGet();
                
            } catch (Exception e) {
                failedItems.add(new BulkOperationResponseDto.OperationResults.FailedItem(
                    product.getProductId(), product.getName(), e.getMessage(), "CATEGORY_ASSIGNMENT_FAILED"
                ));
            }
            
            int processedCount = processed.incrementAndGet();
            updateProgress(response, processedCount, successful.get(), failedItems.size());
        });
        
        response.getResults().setFailedItems(failedItems);
        response.getResults().setSummary(String.format(
            "Category assigned for %d products. %d successful, %d failed.", 
            products.size(), successful.get(), failedItems.size()
        ));
    }
    
    /**
     * Process tag management operation
     */
    private void processTagManagement(List<Product> products,
                                    BulkOperationRequestDto.BulkOperationParameters.TagManagementParams params,
                                    BulkOperationResponseDto response) {
        if (params == null || params.getMethod() == null || params.getTags() == null) {
            handleOperationFailure(response, "Tag management parameters are required");
            return;
        }
        
        AtomicInteger processed = new AtomicInteger(0);
        AtomicInteger successful = new AtomicInteger(0);
        List<BulkOperationResponseDto.OperationResults.FailedItem> failedItems = new ArrayList<>();
        
        processBatch(products, BATCH_SIZE, (product) -> {
            try {
                // Since Product model doesn't have tags field, use searchKeywords for tags
                List<String> currentTags = product.getSearchKeywords() != null ? product.getSearchKeywords() : new ArrayList<>();
                Set<String> tagSet = new HashSet<>(currentTags);
                
                switch (params.getMethod().toLowerCase()) {
                    case "add_tags":
                        tagSet.addAll(params.getTags());
                        break;
                    case "remove_tags":
                        tagSet.removeAll(params.getTags());
                        break;
                    case "replace_tags":
                        tagSet.clear();
                        tagSet.addAll(params.getTags());
                        break;
                }
                
                product.setSearchKeywords(new ArrayList<>(tagSet));
                productRepository.save(product);
                
                response.getResults().getSuccessfulIds().add(product.getProductId());
                successful.incrementAndGet();
                
            } catch (Exception e) {
                failedItems.add(new BulkOperationResponseDto.OperationResults.FailedItem(
                    product.getProductId(), product.getName(), e.getMessage(), "TAG_MANAGEMENT_FAILED"
                ));
            }
            
            int processedCount = processed.incrementAndGet();
            updateProgress(response, processedCount, successful.get(), failedItems.size());
        });
        
        response.getResults().setFailedItems(failedItems);
        response.getResults().setSummary(String.format(
            "Tags updated for %d products. %d successful, %d failed.", 
            products.size(), successful.get(), failedItems.size()
        ));
    }
    
    /**
     * Process export operation
     */
    private void processExport(List<Product> products,
                             BulkOperationRequestDto.BulkOperationParameters.ExportParams params,
                             BulkOperationResponseDto response) {
        if (params == null || params.getFormat() == null) {
            handleOperationFailure(response, "Export parameters are required");
            return;
        }
        
        try {
            response.getProgress().setCurrentPhase("Generating export file");
            
            // Generate export file (simplified implementation)
            String exportUrl = generateExportFile(products, params);
            response.setDownloadUrl(exportUrl);
            
            response.getResults().setSuccessfulIds(
                products.stream().map(Product::getProductId).collect(Collectors.toList())
            );
            response.getResults().setSummary(String.format(
                "Export generated for %d products in %s format.", 
                products.size(), params.getFormat().toUpperCase()
            ));
            
            updateProgress(response, products.size(), products.size(), 0);
            
        } catch (Exception e) {
            handleOperationFailure(response, "Export failed: " + e.getMessage());
        }
    }
    
    /**
     * Process delete operation
     */
    private void processDelete(List<Product> products, BulkOperationResponseDto response) {
        AtomicInteger processed = new AtomicInteger(0);
        AtomicInteger successful = new AtomicInteger(0);
        List<BulkOperationResponseDto.OperationResults.FailedItem> failedItems = new ArrayList<>();
        
        processBatch(products, BATCH_SIZE, (product) -> {
            try {
                productRepository.delete(product);
                
                response.getResults().getSuccessfulIds().add(product.getProductId());
                successful.incrementAndGet();
                
            } catch (Exception e) {
                failedItems.add(new BulkOperationResponseDto.OperationResults.FailedItem(
                    product.getProductId(), product.getName(), e.getMessage(), "DELETE_FAILED"
                ));
            }
            
            int processedCount = processed.incrementAndGet();
            updateProgress(response, processedCount, successful.get(), failedItems.size());
        });
        
        response.getResults().setFailedItems(failedItems);
        response.getResults().setSummary(String.format(
            "Deleted %d products. %d successful, %d failed.", 
            products.size(), successful.get(), failedItems.size()
        ));
    }
    
    /**
     * Process items in batches
     */
    private void processBatch(List<Product> products, int batchSize, java.util.function.Consumer<Product> processor) {
        for (int i = 0; i < products.size(); i += batchSize) {
            int endIndex = Math.min(i + batchSize, products.size());
            List<Product> batch = products.subList(i, endIndex);
            
            batch.forEach(processor);
            
            // Add small delay to prevent overwhelming the system
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    
    /**
     * Calculate new price based on method and value
     */
    private BigDecimal calculateNewPrice(BigDecimal currentPrice, String method, BigDecimal value) {
        switch (method.toLowerCase()) {
            case "percentage":
                return currentPrice.multiply(BigDecimal.ONE.add(value.divide(BigDecimal.valueOf(100))))
                    .setScale(2, RoundingMode.HALF_UP);
            case "fixed_amount":
                return currentPrice.add(value).setScale(2, RoundingMode.HALF_UP);
            case "set_price":
                return value.setScale(2, RoundingMode.HALF_UP);
            default:
                throw new IllegalArgumentException("Unknown price update method: " + method);
        }
    }
    
    /**
     * Calculate new stock based on method and value
     */
    private Integer calculateNewStock(Integer currentStock, String method, Integer value) {
        switch (method.toLowerCase()) {
            case "increase":
                return currentStock + value;
            case "decrease":
                return Math.max(0, currentStock - value);
            case "set_quantity":
                return Math.max(0, value);
            default:
                throw new IllegalArgumentException("Unknown stock update method: " + method);
        }
    }
    
    /**
     * Update progress information
     */
    private void updateProgress(BulkOperationResponseDto response, int processed, int successful, int failed) {
        BulkOperationResponseDto.ProgressInfo progress = response.getProgress();
        progress.setProcessed(processed);
        progress.setSuccessful(successful);
        progress.setFailed(failed);
        progress.setPercentage((double) processed / progress.getTotal() * 100.0);
    }
    
    /**
     * Handle operation failure
     */
    private void handleOperationFailure(BulkOperationResponseDto response, String message) {
        response.setStatus("failed");
        response.setEndTime(LocalDateTime.now());
        response.getResults().setSummary(message);
        response.getProgress().setCurrentPhase("Failed");
    }
    
    /**
     * Generate export file (simplified implementation)
     */
    private String generateExportFile(List<Product> products, BulkOperationRequestDto.BulkOperationParameters.ExportParams params) {
        // This is a simplified implementation - in production, generate actual files
        String fileName = "products_export_" + System.currentTimeMillis() + "." + params.getFormat().toLowerCase();
        return "/api/vendor/exports/" + fileName;
    }
} 