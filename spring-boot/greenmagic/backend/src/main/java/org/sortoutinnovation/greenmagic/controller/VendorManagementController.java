package org.sortoutinnovation.greenmagic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.dto.ProductCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.ProductPerformanceDto;
import org.sortoutinnovation.greenmagic.dto.ProductUpdateRequestDto;
import org.sortoutinnovation.greenmagic.dto.ProductResponseDto;
import org.sortoutinnovation.greenmagic.model.*;
import org.sortoutinnovation.greenmagic.service.ProductService;
import org.sortoutinnovation.greenmagic.service.VendorManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Vendor Management operations
 * Provides APIs for vendor dashboard, product management, orders, analytics, and customer management
 */
@RestController
@RequestMapping("/api/vendor")
@Validated
@CrossOrigin(origins = "*")
// @PreAuthorize("hasRole('VENDOR') or hasAuthority('VENDOR')")
public class VendorManagementController {

    @Autowired
    private VendorManagementService vendorManagementService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ObjectMapper objectMapper;

    // ===========================
    // VENDOR DASHBOARD ANALYTICS
    // ===========================

    /**
     * Get vendor dashboard overview
     * GET /api/vendor/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getDashboardOverview(
            @RequestParam Integer vendorId,
            @RequestParam(defaultValue = "30") int days) {
        try {
            Map<String, Object> dashboard = vendorManagementService.getDashboardOverview(vendorId, days);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Dashboard data retrieved successfully", dashboard));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve dashboard data: " + e.getMessage(), null));
        }
    }

    /**
     * Get vendor analytics for date range
     * GET /api/vendor/analytics
     */
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getAnalytics(
            @RequestParam Integer vendorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> analytics = vendorManagementService.getAnalytics(vendorId, startDate, endDate);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Analytics retrieved successfully", analytics));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve analytics: " + e.getMessage(), null));
        }
    }

    /**
     * Get sales trend data
     * GET /api/vendor/analytics/sales-trend
     */
    @GetMapping("/analytics/sales-trend")
    public ResponseEntity<ApiResponseDto<List<Object[]>>> getSalesTrend(
            @RequestParam Integer vendorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Object[]> trend = vendorManagementService.getSalesTrend(vendorId, startDate, endDate);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Sales trend retrieved successfully", trend));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve sales trend: " + e.getMessage(), null));
        }
    }

    // ===========================
    // PRODUCT MANAGEMENT
    // ===========================

    /**
     * Test endpoint to check if vendor controller is accessible
     * GET /api/vendor/test
     */
    @GetMapping("/test")
    public ResponseEntity<ApiResponseDto<String>> testEndpoint() {
        return ResponseEntity.ok(new ApiResponseDto<>(true, "Vendor controller is working!", "success"));
    }

    /**
     * Get vendor products with filtering and pagination
     * GET /api/vendor/products
     */
    @GetMapping("/products")
    public ResponseEntity<ApiResponseDto<Page<ProductResponseDto>>> getVendorProducts(
            @RequestParam Integer vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        try {
            Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<ProductResponseDto> products = vendorManagementService.getVendorProducts(vendorId, pageable, status, category, search);
            
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products retrieved successfully", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve products: " + e.getMessage(), null));
        }
    }

    /**
     * Get product statistics for vendor
     * GET /api/vendor/products/stats
     */
    @GetMapping("/products/stats")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getProductStats(@RequestParam Integer vendorId) {
        try {
            Map<String, Object> stats = vendorManagementService.getProductStats(vendorId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product statistics: " + e.getMessage(), null));
        }
    }

    /**
     * Get product performance data for a vendor
     * GET /api/vendor/products/performance
     * 
     * @param vendorId The ID of the vendor
     * @return List of product performance data
     */
    @GetMapping("/products/performance")
    public ResponseEntity<ApiResponseDto<List<ProductPerformanceDto>>> getProductPerformance(
            @RequestParam Integer vendorId) {
        
        try {
            List<ProductPerformanceDto> performanceData = productService.getProductPerformanceByVendor(vendorId);
            
            ApiResponseDto<List<ProductPerformanceDto>> response = new ApiResponseDto<>();
            response.setSuccess(true);
            response.setData(performanceData);
            response.setMessage("Product performance data retrieved successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ApiResponseDto<List<ProductPerformanceDto>> response = new ApiResponseDto<>();
            response.setSuccess(false);
            response.setMessage("Error retrieving product performance data: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Create new product
     * POST /api/vendor/products
     */
    @PostMapping("/products")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> createProduct(
            @RequestParam Integer vendorId,
            @RequestBody Map<String, Object> rawRequest) {
        try {
            System.out.println("=== DEBUG: Creating product for vendorId: " + vendorId);
            System.out.println("=== DEBUG: Raw request received, preprocessing...");
            
            // Preprocess the request to handle LinkedHashMap issues
            ProductCreateRequestDto productRequest = preprocessProductRequest(rawRequest);
            
            System.out.println("=== DEBUG: Product request data: " + productRequest.getProductTitle());
            System.out.println("=== DEBUG: Category ID: " + productRequest.getCategoryId());
            System.out.println("=== DEBUG: SKU Code: " + productRequest.getSkuCode());
            
            ProductResponseDto createdProduct = vendorManagementService.createProductFromDto(vendorId, productRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Product created successfully", createdProduct));
        } catch (IllegalArgumentException e) {
            // Handle URL slug conflict specifically
            System.err.println("=== DEBUG: Validation error in createProduct: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (RuntimeException e) {
            System.err.println("=== DEBUG: RuntimeException in createProduct: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("=== DEBUG: Exception in createProduct: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create product: " + e.getMessage(), null));
        }
    }
    
    /**
     * Preprocess raw request to handle LinkedHashMap deserialization issues
     */
    private ProductCreateRequestDto preprocessProductRequest(Map<String, Object> rawRequest) {
        try {
            System.out.println("=== DEBUG: Preprocessing request with ObjectMapper");
            
            // Convert the raw request to JSON string and then back to DTO
            // This ensures proper type conversion and eliminates LinkedHashMap issues
            String jsonString = objectMapper.writeValueAsString(rawRequest);
            System.out.println("=== DEBUG: JSON String: " + jsonString);
            
            ProductCreateRequestDto dto = objectMapper.readValue(jsonString, ProductCreateRequestDto.class);
            System.out.println("=== DEBUG: Successfully converted to DTO");
            
            return dto;
        } catch (Exception e) {
            System.err.println("=== ERROR: Failed to preprocess request: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to process product request: " + e.getMessage(), e);
        }
    }

    /**
     * Get single product by ID
     * GET /api/vendor/products/{productId}
     */
    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> getProductById(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId) {
        try {
            ProductResponseDto product = vendorManagementService.getVendorProductById(vendorId, productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product retrieved successfully", product));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product: " + e.getMessage(), null));
        }
    }

    /**
     * Update product
     * PUT /api/vendor/products/{productId}
     */
    @PutMapping("/products/{productId}")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> updateProduct(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @Valid @RequestBody ProductUpdateRequestDto productRequest) {
        try {
            ProductResponseDto updatedProduct = vendorManagementService.updateProductFromDto(vendorId, productId, productRequest);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product updated successfully", updatedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product: " + e.getMessage(), null));
        }
    }

    /**
     * Delete product
     * DELETE /api/vendor/products/{productId}
     */
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<ApiResponseDto<Void>> deleteProduct(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId) {
        try {
            vendorManagementService.deleteProduct(vendorId, productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to delete product: " + e.getMessage(), null));
        }
    }

    /**
     * Bulk update product status
     * POST /api/vendor/products/bulk-status
     */
    @PostMapping("/products/bulk-status")
    public ResponseEntity<ApiResponseDto<String>> bulkUpdateProductStatus(
            @RequestParam Integer vendorId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Integer> productIds = (List<Integer>) request.get("productIds");
            String status = (String) request.get("status");
            
            vendorManagementService.bulkUpdateProductStatus(vendorId, productIds, status);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products status updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product status: " + e.getMessage(), null));
        }
    }

    /**
     * Bulk update product prices
     * POST /api/vendor/products/bulk-price
     */
    @PostMapping("/products/bulk-price")
    public ResponseEntity<ApiResponseDto<String>> bulkUpdateProductPrices(
            @RequestParam Integer vendorId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Integer> productIds = (List<Integer>) request.get("productIds");
            String updateType = (String) request.get("updateType"); // "percentage" or "fixed"
            BigDecimal value = new BigDecimal(request.get("value").toString());
            
            vendorManagementService.bulkUpdateProductPrices(vendorId, productIds, updateType, value);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product prices updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product prices: " + e.getMessage(), null));
        }
    }

    /**
     * Duplicate product
     * POST /api/vendor/products/{productId}/duplicate
     */
    @PostMapping("/products/{productId}/duplicate")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> duplicateProduct(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @RequestBody(required = false) Map<String, String> customizations) {
        try {
            String newTitle = customizations != null ? customizations.get("title") : null;
            ProductResponseDto duplicatedProduct = vendorManagementService.duplicateProduct(vendorId, productId, newTitle);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Product duplicated successfully", duplicatedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to duplicate product: " + e.getMessage(), null));
        }
    }

    /**
     * Get detailed product information for modal
     * GET /api/vendor/products/{productId}/details
     */
    @GetMapping("/products/{productId}/details")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getProductDetails(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId) {
        try {
            Map<String, Object> productDetails = vendorManagementService.getProductDetails(vendorId, productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product details retrieved successfully", productDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product details: " + e.getMessage(), null));
        }
    }

    /**
     * Get product analytics data
     * GET /api/vendor/products/{productId}/analytics
     */
    @GetMapping("/products/{productId}/analytics")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getProductAnalytics(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId) {
        try {
            Map<String, Object> analytics = vendorManagementService.getProductAnalytics(vendorId, productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product analytics retrieved successfully", analytics));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product analytics: " + e.getMessage(), null));
        }
    }

    /**
     * Quick update product fields
     * PUT /api/vendor/products/{productId}/quick-update
     */
    @PutMapping("/products/{productId}/quick-update")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> quickUpdateProduct(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @RequestBody Map<String, Object> updateFields) {
        try {
            ProductResponseDto updatedProduct = vendorManagementService.quickUpdateProduct(vendorId, productId, updateFields);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product updated successfully", updatedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product: " + e.getMessage(), null));
        }
    }

    /**
     * Update product status
     * PUT /api/vendor/products/{productId}/status
     */
    @PutMapping("/products/{productId}/status")
    public ResponseEntity<ApiResponseDto<ProductResponseDto>> updateProductStatus(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            String status = statusUpdate.get("status");
            if (status == null || status.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponseDto<>(false, "Status is required", null));
            }
            
            ProductResponseDto updatedProduct = vendorManagementService.updateProductStatus(vendorId, productId, status);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product status updated successfully", updatedProduct));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product status: " + e.getMessage(), null));
        }
    }

    /**
     * Bulk update product stock
     * POST /api/vendor/products/bulk-stock
     */
    @PostMapping("/products/bulk-stock")
    public ResponseEntity<ApiResponseDto<String>> bulkUpdateProductStock(
            @RequestParam Integer vendorId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Integer> productIds = (List<Integer>) request.get("productIds");
            String updateType = (String) request.get("updateType"); // "set", "increase", "decrease"
            Integer value = Integer.parseInt(request.get("value").toString());
            
            vendorManagementService.bulkUpdateProductStock(vendorId, productIds, updateType, value);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product stock updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product stock: " + e.getMessage(), null));
        }
    }

    /**
     * Export products to CSV/Excel
     * GET /api/vendor/products/export
     */
    @GetMapping("/products/export")
    public ResponseEntity<ApiResponseDto<Map<String, String>>> exportProducts(
            @RequestParam Integer vendorId,
            @RequestParam(defaultValue = "csv") String format,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<Integer> productIds) {
        try {
            Map<String, String> exportResult = vendorManagementService.exportProducts(vendorId, format, status, category, productIds);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Products exported successfully", exportResult));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to export products: " + e.getMessage(), null));
        }
    }

    /**
     * Get product categories for vendor
     * GET /api/vendor/products/categories
     */
    @GetMapping("/products/categories")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getProductCategories() {
        try {
            Map<String, Object> categories = vendorManagementService.getProductCategories();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product categories: " + e.getMessage(), null));
        }
    }

    /**
     * Generate SKU code
     * POST /api/vendor/products/generate-sku
     */
    @PostMapping("/products/generate-sku")
    public ResponseEntity<ApiResponseDto<Map<String, String>>> generateSku(
            @RequestParam Integer vendorId,
            @RequestBody Map<String, String> request) {
        try {
            String category = request.get("category");
            // No subcategory support - admin controls categories only
            
            String sku = vendorManagementService.generateSku(vendorId, category, null);
            Map<String, String> result = Map.of("sku", sku);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "SKU generated successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to generate SKU: " + e.getMessage(), null));
        }
    }

    // ===========================
    // PRODUCT VARIANTS
    // ===========================

    /**
     * Get product variants
     * GET /api/vendor/products/{productId}/variants
     */
    @GetMapping("/products/{productId}/variants")
    public ResponseEntity<ApiResponseDto<List<ProductVariant>>> getProductVariants(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId) {
        try {
            List<ProductVariant> variants = vendorManagementService.getProductVariants(vendorId, productId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product variants retrieved successfully", variants));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve product variants: " + e.getMessage(), null));
        }
    }

    /**
     * Create product variant
     * POST /api/vendor/products/{productId}/variants
     */
    @PostMapping("/products/{productId}/variants")
    public ResponseEntity<ApiResponseDto<ProductVariant>> createProductVariant(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @Valid @RequestBody ProductVariant variant) {
        try {
            ProductVariant createdVariant = vendorManagementService.createProductVariant(vendorId, productId, variant);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Product variant created successfully", createdVariant));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create product variant: " + e.getMessage(), null));
        }
    }

    /**
     * Update product variant
     * PUT /api/vendor/products/{productId}/variants/{variantId}
     */
    @PutMapping("/products/{productId}/variants/{variantId}")
    public ResponseEntity<ApiResponseDto<ProductVariant>> updateProductVariant(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @PathVariable Long variantId,
            @Valid @RequestBody ProductVariant variant) {
        try {
            ProductVariant updatedVariant = vendorManagementService.updateProductVariant(vendorId, productId, variantId, variant);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product variant updated successfully", updatedVariant));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update product variant: " + e.getMessage(), null));
        }
    }

    /**
     * Delete product variant
     * DELETE /api/vendor/products/{productId}/variants/{variantId}
     */
    @DeleteMapping("/products/{productId}/variants/{variantId}")
    public ResponseEntity<ApiResponseDto<Void>> deleteProductVariant(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @PathVariable Long variantId) {
        try {
            vendorManagementService.deleteProductVariant(vendorId, productId, variantId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Product variant deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to delete product variant: " + e.getMessage(), null));
        }
    }

    /**
     * Bulk update variant prices
     * POST /api/vendor/products/{productId}/variants/bulk-price
     */
    @PostMapping("/products/{productId}/variants/bulk-price")
    public ResponseEntity<ApiResponseDto<String>> bulkUpdateVariantPrices(
            @RequestParam Integer vendorId,
            @PathVariable Integer productId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Long> variantIds = (List<Long>) request.get("variantIds");
            String updateType = (String) request.get("updateType");
            BigDecimal value = new BigDecimal(request.get("value").toString());
            
            vendorManagementService.bulkUpdateVariantPrices(vendorId, productId, variantIds, updateType, value);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Variant prices updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update variant prices: " + e.getMessage(), null));
        }
    }

    // ===========================
    // ORDER MANAGEMENT
    // ===========================

    /**
     * Get vendor orders with filtering and pagination
     * GET /api/vendor/orders
     */
    @GetMapping("/orders")
    public ResponseEntity<ApiResponseDto<Page<Order>>> getVendorOrders(
            @RequestParam Integer vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        try {
            Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<Order> orders = vendorManagementService.getVendorOrders(vendorId, pageable, status, search);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Orders retrieved successfully", orders));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve orders: " + e.getMessage(), null));
        }
    }

    /**
     * Get order statistics for vendor
     * GET /api/vendor/orders/stats
     */
    @GetMapping("/orders/stats")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getOrderStats(@RequestParam Integer vendorId) {
        try {
            Map<String, Object> stats = vendorManagementService.getOrderStats(vendorId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Order statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve order statistics: " + e.getMessage(), null));
        }
    }

    /**
     * Update order status
     * PUT /api/vendor/orders/{orderId}/status
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponseDto<Order>> updateOrderStatus(
            @RequestParam Integer vendorId,
            @PathVariable Integer orderId,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            String notes = request.get("notes");
            
            Order updatedOrder = vendorManagementService.updateOrderStatus(vendorId, orderId, status, notes);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Order status updated successfully", updatedOrder));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update order status: " + e.getMessage(), null));
        }
    }

    // ===========================
    // CUSTOMER MANAGEMENT
    // ===========================

    /**
     * Get vendor customers with filtering and pagination
     * GET /api/vendor/customers
     */
    @GetMapping("/customers")
    public ResponseEntity<ApiResponseDto<Page<VendorCustomer>>> getVendorCustomers(
            @RequestParam Integer vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "lastOrderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String segment,
            @RequestParam(required = false) String search) {
        try {
            Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);
            
            Page<VendorCustomer> customers = vendorManagementService.getVendorCustomers(vendorId, pageable, segment, search);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Customers retrieved successfully", customers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve customers: " + e.getMessage(), null));
        }
    }

    /**
     * Get customer statistics for vendor
     * GET /api/vendor/customers/stats
     */
    @GetMapping("/customers/stats")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getCustomerStats(@RequestParam Integer vendorId) {
        try {
            Map<String, Object> stats = vendorManagementService.getCustomerStats(vendorId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Customer statistics retrieved successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve customer statistics: " + e.getMessage(), null));
        }
    }

    /**
     * Get customer segmentation data
     * GET /api/vendor/customers/segmentation
     */
    @GetMapping("/customers/segmentation")
    public ResponseEntity<ApiResponseDto<List<Object[]>>> getCustomerSegmentation(@RequestParam Integer vendorId) {
        try {
            List<Object[]> segmentation = vendorManagementService.getCustomerSegmentation(vendorId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Customer segmentation retrieved successfully", segmentation));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve customer segmentation: " + e.getMessage(), null));
        }
    }

    // ===========================
    // VENDOR SETTINGS
    // ===========================

    /**
     * Get vendor settings
     * GET /api/vendor/settings
     */
    @GetMapping("/settings")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getVendorSettings(@RequestParam Integer vendorId) {
        try {
            Map<String, Object> settings = vendorManagementService.getVendorSettings(vendorId);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Vendor settings retrieved successfully", settings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve vendor settings: " + e.getMessage(), null));
        }
    }

    /**
     * Update vendor settings
     * PUT /api/vendor/settings
     */
    @PutMapping("/settings")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> updateVendorSettings(
            @RequestParam Integer vendorId,
            @RequestBody Map<String, Object> settings) {
        try {
            Map<String, Object> updatedSettings = vendorManagementService.updateVendorSettings(vendorId, settings);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Vendor settings updated successfully", updatedSettings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update vendor settings: " + e.getMessage(), null));
        }
    }
} 