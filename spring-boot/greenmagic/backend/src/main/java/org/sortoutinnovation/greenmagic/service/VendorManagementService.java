package org.sortoutinnovation.greenmagic.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.sortoutinnovation.greenmagic.dto.ProductCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.ProductUpdateRequestDto;
import org.sortoutinnovation.greenmagic.dto.ProductResponseDto;
import org.sortoutinnovation.greenmagic.mapper.ProductMapper;
import org.sortoutinnovation.greenmagic.model.*;
import org.sortoutinnovation.greenmagic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service class for Vendor Management operations
 * Handles business logic for vendor dashboard, products, orders, analytics, and customers
 */
@Service
@Transactional
public class VendorManagementService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private VendorAnalyticsRepository vendorAnalyticsRepository;
    
    @Autowired
    private VendorCustomerRepository vendorCustomerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VendorProfileRepository vendorProfileRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ObjectMapper objectMapper;

    // ===========================
    // DASHBOARD METHODS
    // ===========================

    /**
     * Get comprehensive dashboard overview for vendor
     */
    public Map<String, Object> getDashboardOverview(Integer vendorId, int days) {
        Map<String, Object> dashboard = new HashMap<>();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);
        
        // Get basic statistics
        dashboard.put("totalProducts", getProductCount(vendorId));
        dashboard.put("activeProducts", getActiveProductCount(vendorId));
        dashboard.put("totalOrders", getOrderCount(vendorId, startDate, endDate));
        dashboard.put("totalRevenue", getTotalRevenue(vendorId, startDate, endDate));
        dashboard.put("totalCustomers", getCustomerCount(vendorId));
        dashboard.put("avgOrderValue", getAverageOrderValue(vendorId, startDate, endDate));
        
        // Get recent orders
        dashboard.put("recentOrders", getRecentOrders(vendorId, 5));
        
        // Get product status breakdown
        dashboard.put("productStats", getProductStatsBreakdown(vendorId));
        
        // Get order status breakdown
        dashboard.put("orderStats", getOrderStatsBreakdown(vendorId));
        
        // Get low stock alerts
        dashboard.put("lowStockProducts", getLowStockProducts(vendorId));
        
        // Get growth metrics
        dashboard.put("growthMetrics", getGrowthMetrics(vendorId, days));
        
        return dashboard;
    }

    /**
     * Get analytics data for date range
     */
    public Map<String, Object> getAnalytics(Integer vendorId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Get analytics summary
        Object[] summary = vendorAnalyticsRepository.getAnalyticsSummary(vendorId, startDate, endDate);
        if (summary != null && summary.length > 0) {
            analytics.put("totalRevenue", summary[0] != null ? summary[0] : BigDecimal.ZERO);
            analytics.put("totalOrders", summary[1] != null ? summary[1] : 0);
            analytics.put("totalCustomers", summary[2] != null ? summary[2] : 0);
            analytics.put("avgOrderValue", summary[3] != null ? summary[3] : BigDecimal.ZERO);
            analytics.put("conversionRate", summary[4] != null ? summary[4] : BigDecimal.ZERO);
        }
        
        // Get revenue trend
        analytics.put("revenueTrend", vendorAnalyticsRepository.getRevenueTrend(vendorId, startDate, endDate));
        
        // Get top products
        analytics.put("topProducts", getTopProducts(vendorId, startDate, endDate));
        
        // Get customer acquisition trend
        analytics.put("customerTrend", getCustomerAcquisitionTrend(vendorId, startDate, endDate));
        
        return analytics;
    }

    /**
     * Get sales trend data
     */
    public List<Object[]> getSalesTrend(Integer vendorId, LocalDate startDate, LocalDate endDate) {
        return vendorAnalyticsRepository.getRevenueTrend(vendorId, startDate, endDate);
    }

    // ===========================
    // PRODUCT MANAGEMENT METHODS
    // ===========================

    /**
     * Get vendor products with filtering
     */
    public Page<ProductResponseDto> getVendorProducts(Integer vendorId, Pageable pageable, String status, String category, String search) {
        // Implementation would use custom query or specification pattern
        // For now, basic implementation
        Page<Product> products = productRepository.findByCreatedByUserId(vendorId, pageable);
        
        // Convert entities to DTOs to avoid serialization issues
        return products.map(product -> productMapper.toDto(product));
    }

    /**
     * Get product statistics for vendor
     */
    public Map<String, Object> getProductStats(Integer vendorId) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalProducts", getProductCount(vendorId));
        stats.put("activeProducts", getActiveProductCount(vendorId));
        stats.put("inactiveProducts", getInactiveProductCount(vendorId));
        stats.put("outOfStockProducts", getOutOfStockProductCount(vendorId));
        stats.put("lowStockProducts", getLowStockProductCount(vendorId));
        stats.put("totalVariants", getTotalVariantCount(vendorId));
        
        return stats;
    }

    /**
     * Create new product
     */
    public Product createProduct(Integer vendorId, Product product) {
        User vendor = userRepository.findById(vendorId.longValue())
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        product.setCreatedBy(vendor);
        product.setCreatedAt(LocalDateTime.now());
        
        // Generate SKU if not provided
        if (product.getSku() == null || product.getSku().isEmpty()) {
            product.setSku(generateSKU(vendorId, product));
        }
        
        // Set default values
        if (product.getStatus() == null) {
            product.setStatus(Product.ProductStatus.ACTIVE);
        }
        
        return productRepository.save(product);
    }

    /**
     * Update product
     */
    public Product updateProduct(Integer vendorId, Integer productId, Product productData) {
        Product existingProduct = productRepository.findById(productId.longValue())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!existingProduct.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to update this product");
        }
        
        // Update fields
        existingProduct.setName(productData.getName());
        existingProduct.setDescription(productData.getDescription());
        existingProduct.setShortDescription(productData.getShortDescription());
        existingProduct.setPrice(productData.getPrice());
        existingProduct.setMrp(productData.getMrp());
        existingProduct.setQuantity(productData.getQuantity());
        existingProduct.setStatus(productData.getStatus());
        existingProduct.setCategory(productData.getCategory());
        existingProduct.setBrand(productData.getBrand());
        existingProduct.setImageUrl(productData.getImageUrl());
        existingProduct.setMetaTitle(productData.getMetaTitle());
        existingProduct.setMetaDescription(productData.getMetaDescription());
        
        return productRepository.save(existingProduct);
    }

    /**
     * Delete product
     */
    public void deleteProduct(Integer vendorId, Integer productId) {
        Product product = productRepository.findById(productId.longValue())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to delete this product");
        }
        
        // Check if product has orders
        boolean hasOrders = orderRepository.existsByOrderItemsProductProductId(productId);
        if (hasOrders) {
            // Soft delete by setting status to INACTIVE
            product.setStatus(Product.ProductStatus.INACTIVE);
            productRepository.save(product);
        } else {
            // Hard delete
            productRepository.delete(product);
        }
    }

    /**
     * Bulk update product status
     */
    public void bulkUpdateProductStatus(Integer vendorId, List<Integer> productIds, String status) {
        List<Product> products = productRepository.findAllById(
            productIds.stream().map(Long::valueOf).collect(Collectors.toList())
        );
        
        Product.ProductStatus newStatus = Product.ProductStatus.valueOf(status.toUpperCase());
        
        for (Product product : products) {
            // Verify ownership
            if (product.getCreatedBy().getUserId().equals(vendorId)) {
                product.setStatus(newStatus);
            }
        }
        
        productRepository.saveAll(products);
    }

    /**
     * Bulk update product prices
     */
    public void bulkUpdateProductPrices(Integer vendorId, List<Integer> productIds, String updateType, BigDecimal value) {
        List<Product> products = productRepository.findAllById(
            productIds.stream().map(Long::valueOf).collect(Collectors.toList())
        );
        
        for (Product product : products) {
            // Verify ownership
            if (product.getCreatedBy().getUserId().equals(vendorId)) {
                BigDecimal currentPrice = product.getPrice();
                BigDecimal newPrice;
                
                if ("percentage".equals(updateType)) {
                    newPrice = currentPrice.multiply(BigDecimal.ONE.add(value.divide(BigDecimal.valueOf(100))));
                } else {
                    newPrice = currentPrice.add(value);
                }
                
                // Ensure price is not negative
                if (newPrice.compareTo(BigDecimal.ZERO) < 0) {
                    newPrice = BigDecimal.ZERO;
                }
                
                product.setPrice(newPrice.setScale(2, RoundingMode.HALF_UP));
            }
        }
        
        productRepository.saveAll(products);
    }

    // ===========================
    // PRODUCT VARIANT METHODS
    // ===========================

    /**
     * Get product variants
     */
    public List<ProductVariant> getProductVariants(Integer vendorId, Integer productId) {
        Product product = productRepository.findById(productId.longValue())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to access this product");
        }
        
        return productVariantRepository.findByProductProductIdOrderBySortOrderAsc(productId);
    }

    /**
     * Create product variant
     */
    public ProductVariant createProductVariant(Integer vendorId, Integer productId, ProductVariant variant) {
        Product product = productRepository.findById(productId.longValue())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to modify this product");
        }
        
        variant.setProduct(product);
        variant.setCreatedAt(LocalDateTime.now());
        
        // Generate variant SKU if not provided
        if (variant.getVariantSku() == null || variant.getVariantSku().isEmpty()) {
            variant.setVariantSku(generateVariantSKU(product, variant));
        }
        
        return productVariantRepository.save(variant);
    }

    /**
     * Update product variant
     */
    public ProductVariant updateProductVariant(Integer vendorId, Integer productId, Long variantId, ProductVariant variantData) {
        ProductVariant existingVariant = productVariantRepository.findById(variantId)
            .orElseThrow(() -> new RuntimeException("Variant not found"));
        
        // Verify ownership
        if (!existingVariant.getProduct().getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to update this variant");
        }
        
        // Update fields
        existingVariant.setVariantName(variantData.getVariantName());
        existingVariant.setSize(variantData.getSize());
        existingVariant.setColor(variantData.getColor());
        existingVariant.setWeight(variantData.getWeight());
        existingVariant.setFlavor(variantData.getFlavor());
        existingVariant.setPackSize(variantData.getPackSize());
        existingVariant.setPrice(variantData.getPrice());
        existingVariant.setRegularPrice(variantData.getRegularPrice());
        existingVariant.setStockQuantity(variantData.getStockQuantity());
        existingVariant.setStatus(variantData.getStatus());
        existingVariant.setUpdatedAt(LocalDateTime.now());
        
        return productVariantRepository.save(existingVariant);
    }

    /**
     * Delete product variant
     */
    public void deleteProductVariant(Integer vendorId, Integer productId, Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
            .orElseThrow(() -> new RuntimeException("Variant not found"));
        
        // Verify ownership
        if (!variant.getProduct().getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to delete this variant");
        }
        
        productVariantRepository.delete(variant);
    }

    /**
     * Bulk update variant prices
     */
    public void bulkUpdateVariantPrices(Integer vendorId, Integer productId, List<Long> variantIds, String updateType, BigDecimal value) {
        List<ProductVariant> variants = productVariantRepository.findAllById(variantIds);
        
        for (ProductVariant variant : variants) {
            // Verify ownership
            if (variant.getProduct().getCreatedBy().getUserId().equals(vendorId)) {
                BigDecimal currentPrice = variant.getPrice();
                BigDecimal newPrice;
                
                if ("percentage".equals(updateType)) {
                    newPrice = currentPrice.multiply(BigDecimal.ONE.add(value.divide(BigDecimal.valueOf(100))));
                } else {
                    newPrice = currentPrice.add(value);
                }
                
                // Ensure price is not negative
                if (newPrice.compareTo(BigDecimal.ZERO) < 0) {
                    newPrice = BigDecimal.ZERO;
                }
                
                variant.setPrice(newPrice.setScale(2, RoundingMode.HALF_UP));
                variant.setUpdatedAt(LocalDateTime.now());
            }
        }
        
        productVariantRepository.saveAll(variants);
    }

    // ===========================
    // ORDER MANAGEMENT METHODS
    // ===========================

    /**
     * Get vendor orders with filtering
     */
    public Page<Order> getVendorOrders(Integer vendorId, Pageable pageable, String status, String search) {
        // Implementation would use custom query to filter orders containing vendor's products
        // For now, basic implementation
        return orderRepository.findAll(pageable);
    }

    /**
     * Get order statistics for vendor
     */
    public Map<String, Object> getOrderStats(Integer vendorId) {
        Map<String, Object> stats = new HashMap<>();
        
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        
        stats.put("totalOrders", getOrderCount(vendorId, monthStart, today));
        stats.put("pendingOrders", getPendingOrderCount(vendorId));
        stats.put("processingOrders", getProcessingOrderCount(vendorId));
        stats.put("shippedOrders", getShippedOrderCount(vendorId));
        stats.put("deliveredOrders", getDeliveredOrderCount(vendorId));
        stats.put("cancelledOrders", getCancelledOrderCount(vendorId));
        stats.put("totalRevenue", getTotalRevenue(vendorId, monthStart, today));
        
        return stats;
    }

    /**
     * Update order status
     */
    public Order updateOrderStatus(Integer vendorId, Integer orderId, String status, String notes) {
        Order order = orderRepository.findById(orderId.longValue())
            .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Verify vendor has products in this order
        // This would require checking if any order items belong to vendor's products
        
        order.setStatus(status);
        // Would also create an order status history entry
        
        return orderRepository.save(order);
    }

    // ===========================
    // CUSTOMER MANAGEMENT METHODS
    // ===========================

    /**
     * Get vendor customers with filtering
     */
    public Page<VendorCustomer> getVendorCustomers(Integer vendorId, Pageable pageable, String segment, String search) {
        if (search != null && !search.isEmpty()) {
            return vendorCustomerRepository.searchCustomers(vendorId, search, pageable);
        } else if (segment != null && !segment.isEmpty()) {
            VendorCustomer.CustomerSegment customerSegment = VendorCustomer.CustomerSegment.valueOf(segment.toUpperCase());
            List<VendorCustomer> customers = vendorCustomerRepository.findByVendorIdAndSegment(vendorId, customerSegment);
            // Convert to Page - would need proper implementation
            return vendorCustomerRepository.findByVendorId(vendorId, pageable);
        } else {
            return vendorCustomerRepository.findByVendorId(vendorId, pageable);
        }
    }

    /**
     * Get customer statistics for vendor
     */
    public Map<String, Object> getCustomerStats(Integer vendorId) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalCustomers", vendorCustomerRepository.countByVendorId(vendorId));
        stats.put("activeCustomers", vendorCustomerRepository.countActiveCustomersByVendor(vendorId));
        stats.put("vipCustomers", vendorCustomerRepository.countVipCustomersByVendor(vendorId));
        stats.put("newCustomers", vendorCustomerRepository.countByVendorIdAndSegment(vendorId, VendorCustomer.CustomerSegment.NEW));
        stats.put("regularCustomers", vendorCustomerRepository.countByVendorIdAndSegment(vendorId, VendorCustomer.CustomerSegment.REGULAR));
        stats.put("inactiveCustomers", vendorCustomerRepository.countByVendorIdAndSegment(vendorId, VendorCustomer.CustomerSegment.INACTIVE));
        
        // Customer lifetime value stats
        Object[] clvStats = vendorCustomerRepository.getCustomerLifetimeValueStats(vendorId);
        if (clvStats != null && clvStats.length > 0) {
            stats.put("avgLifetimeValue", clvStats[0]);
            stats.put("maxLifetimeValue", clvStats[1]);
            stats.put("minLifetimeValue", clvStats[2]);
        }
        
        return stats;
    }

    /**
     * Get customer segmentation data
     */
    public List<Object[]> getCustomerSegmentation(Integer vendorId) {
        return vendorCustomerRepository.getCustomerSegmentationSummary(vendorId);
    }

    // ===========================
    // VENDOR SETTINGS METHODS
    // ===========================

    /**
     * Get vendor settings
     */
    public Map<String, Object> getVendorSettings(Integer vendorId) {
        // Implementation would fetch from VendorProfile and User entities
        Map<String, Object> settings = new HashMap<>();
        
        User vendor = userRepository.findById(vendorId.longValue())
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        Optional<VendorProfile> profileOpt = vendorProfileRepository.findByUser(vendor);
        if (profileOpt.isPresent()) {
            VendorProfile profile = profileOpt.get();
            settings.put("businessName", profile.getBusinessName());
            settings.put("businessType", profile.getBusinessType());
            settings.put("gstNumber", profile.getGstNumber());
            settings.put("panNumber", profile.getPanNumber());
            settings.put("businessEmail", profile.getBusinessEmail());
        }
        
        // Add other settings
        settings.put("email", vendor.getEmail());
        
        return settings;
    }

    /**
     * Update vendor settings
     */
    public Map<String, Object> updateVendorSettings(Integer vendorId, Map<String, Object> settings) {
        User vendor = userRepository.findById(vendorId.longValue())
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        // Update user fields (only email and username are available)
        if (settings.containsKey("email")) {
            vendor.setEmail((String) settings.get("email"));
        }
        
        userRepository.save(vendor);
        
        // Update vendor profile
        Optional<VendorProfile> profileOpt = vendorProfileRepository.findByUser(vendor);
        if (profileOpt.isPresent()) {
            VendorProfile profile = profileOpt.get();
            
            if (settings.containsKey("businessName")) {
                profile.setBusinessName((String) settings.get("businessName"));
            }
            if (settings.containsKey("businessEmail")) {
                profile.setBusinessEmail((String) settings.get("businessEmail"));
            }
            
            vendorProfileRepository.save(profile);
        }
        
        return getVendorSettings(vendorId);
    }

    // ===========================
    // HELPER METHODS
    // ===========================

    private long getProductCount(Integer vendorId) {
        return productRepository.countByCreatedByUserId(vendorId);
    }

    private long getActiveProductCount(Integer vendorId) {
        return productRepository.countByCreatedByUserIdAndStatus(vendorId, Product.ProductStatus.ACTIVE);
    }

    private long getInactiveProductCount(Integer vendorId) {
        return productRepository.countByCreatedByUserIdAndStatus(vendorId, Product.ProductStatus.INACTIVE);
    }

    private long getOutOfStockProductCount(Integer vendorId) {
        // Implementation would count products with quantity = 0
        return 0;
    }

    private long getLowStockProductCount(Integer vendorId) {
        // Implementation would count products with quantity <= minStockAlert
        return 0;
    }

    private long getTotalVariantCount(Integer vendorId) {
        return productVariantRepository.countByVendorId(vendorId);
    }

    private int getOrderCount(Integer vendorId, LocalDate startDate, LocalDate endDate) {
        return vendorAnalyticsRepository.getTotalOrdersByVendorAndDateRange(vendorId, startDate, endDate);
    }

    private BigDecimal getTotalRevenue(Integer vendorId, LocalDate startDate, LocalDate endDate) {
        return vendorAnalyticsRepository.getTotalRevenueByVendorAndDateRange(vendorId, startDate, endDate);
    }

    private long getCustomerCount(Integer vendorId) {
        return vendorCustomerRepository.countByVendorId(vendorId);
    }

    private BigDecimal getAverageOrderValue(Integer vendorId, LocalDate startDate, LocalDate endDate) {
        return vendorAnalyticsRepository.getAverageOrderValueByVendorAndDateRange(vendorId, startDate, endDate);
    }

    private List<Order> getRecentOrders(Integer vendorId, int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "orderDate"));
        return orderRepository.findAll(pageable).getContent();
    }

    private Map<String, Long> getProductStatsBreakdown(Integer vendorId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("active", getActiveProductCount(vendorId));
        stats.put("inactive", getInactiveProductCount(vendorId));
        stats.put("outOfStock", getOutOfStockProductCount(vendorId));
        stats.put("lowStock", getLowStockProductCount(vendorId));
        return stats;
    }

    private Map<String, Integer> getOrderStatsBreakdown(Integer vendorId) {
        Map<String, Integer> stats = new HashMap<>();
        stats.put("pending", getPendingOrderCount(vendorId));
        stats.put("processing", getProcessingOrderCount(vendorId));
        stats.put("shipped", getShippedOrderCount(vendorId));
        stats.put("delivered", getDeliveredOrderCount(vendorId));
        stats.put("cancelled", getCancelledOrderCount(vendorId));
        return stats;
    }

    private List<Product> getLowStockProducts(Integer vendorId) {
        // Implementation would return products with low stock
        return new ArrayList<>();
    }

    private Map<String, Object> getGrowthMetrics(Integer vendorId, int days) {
        // Implementation would calculate growth compared to previous period
        Map<String, Object> growth = new HashMap<>();
        growth.put("revenueGrowth", BigDecimal.ZERO);
        growth.put("orderGrowth", BigDecimal.ZERO);
        growth.put("customerGrowth", BigDecimal.ZERO);
        return growth;
    }

    private List<Object[]> getTopProducts(Integer vendorId, LocalDate startDate, LocalDate endDate) {
        // Implementation would return top selling products
        return new ArrayList<>();
    }

    private List<Object[]> getCustomerAcquisitionTrend(Integer vendorId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.plusDays(1).atStartOfDay();
        return vendorCustomerRepository.getCustomerAcquisitionTrend(vendorId, start, end);
    }

    private int getPendingOrderCount(Integer vendorId) {
        // Implementation would count pending orders
        return 0;
    }

    private int getProcessingOrderCount(Integer vendorId) {
        // Implementation would count processing orders
        return 0;
    }

    private int getShippedOrderCount(Integer vendorId) {
        // Implementation would count shipped orders
        return 0;
    }

    private int getDeliveredOrderCount(Integer vendorId) {
        // Implementation would count delivered orders
        return 0;
    }

    private int getCancelledOrderCount(Integer vendorId) {
        // Implementation would count cancelled orders
        return 0;
    }

    private String generateSKU(Integer vendorId, Product product) {
        // Generate SKU in format: GM-V{vendorId}-{categoryCode}-{sequence}
        String categoryCode = product.getCategory() != null ? 
            product.getCategory().getName().substring(0, Math.min(3, product.getCategory().getName().length())).toUpperCase() : "GEN";
        long sequence = getProductCount(vendorId) + 1;
        return String.format("GM-V%d-%s-%04d", vendorId, categoryCode, sequence);
    }

    private String generateVariantSKU(Product product, ProductVariant variant) {
        String baseSku = product.getSku();
        String variantCode = "";
        
        if (variant.getSize() != null) variantCode += variant.getSize().substring(0, 1);
        if (variant.getColor() != null) variantCode += variant.getColor().substring(0, 1);
        if (variant.getWeight() != null) variantCode += variant.getWeight().replaceAll("[^0-9]", "");
        
        return baseSku + "-" + variantCode.toUpperCase();
    }

    // ===========================
    // NEW DTO-BASED METHODS
    // ===========================

    /**
     * Create product from DTO
     */
    public ProductResponseDto createProductFromDto(Integer vendorId, ProductCreateRequestDto request) {
        try {
            System.out.println("=== DEBUG: Starting createProductFromDto");
            System.out.println("=== DEBUG: VendorId: " + vendorId);
            System.out.println("=== DEBUG: Product Title: " + request.getProductTitle());
            
            // Find vendor
            User vendor = userRepository.findById(vendorId.longValue())
                .orElseThrow(() -> new RuntimeException("Vendor not found with ID: " + vendorId));
            System.out.println("=== DEBUG: Vendor found: " + vendor.getName());

            // Additional validations for ACTIVE status
            if ("ACTIVE".equals(request.getStatus())) {
                List<String> errors = validateProductForPublishing(request);
                if (!errors.isEmpty()) {
                    throw new IllegalArgumentException("Please fix the following issues before publishing:\n" + String.join("\n", errors));
                }
            }

            // Generate URL slug if not provided
            String urlSlug = request.getUrlSlug();
            if (urlSlug == null || urlSlug.isEmpty()) {
                urlSlug = generateUrlSlug(request.getProductTitle());
            }

            // Check if URL slug already exists
            if (productRepository.existsByUrlSlug(urlSlug)) {
                throw new IllegalArgumentException("A product with URL slug '" + urlSlug + "' already exists. Please provide a different product title or custom URL slug.");
            }

            // Create new product
            Product product = new Product();
            
            // Map DTO to Product using our fixed method
            mapDtoToProduct(request, product);
            
            // Set system fields
            product.setCreatedBy(vendor);
            product.setUrlSlug(urlSlug);
            
            System.out.println("=== DEBUG: About to save product");
            
            // Save product to database
            Product savedProduct = productRepository.save(product);
            
            System.out.println("=== DEBUG: Product saved successfully with ID: " + savedProduct.getProductId());
            
            // Return a simple response without using ProductMapper to avoid LinkedHashMap issues
            ProductResponseDto response = new ProductResponseDto();
            response.setProductId(savedProduct.getProductId());
            response.setSku(savedProduct.getSku());
            response.setName(savedProduct.getName());
            response.setPrice(savedProduct.getPrice());
            response.setMrp(savedProduct.getMrp());
            response.setQuantity(savedProduct.getQuantity());
            response.setImageUrl(savedProduct.getImageUrl());
            response.setStatus(savedProduct.getStatus());
            response.setCreatedAt(savedProduct.getCreatedAt());
            
            // Set simple fields only to avoid JSON conversion issues
            if (savedProduct.getCategory() != null) {
                response.setCategoryName(savedProduct.getCategory().getName());
            }
            if (savedProduct.getCreatedBy() != null) {
                response.setCreatedByName(savedProduct.getCreatedBy().getName());
            }
            
            System.out.println("=== DEBUG: Response created successfully");
            return response;
            
        } catch (IllegalArgumentException e) {
            System.err.println("=== ERROR in createProductFromDto: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("=== ERROR in createProductFromDto: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create product: " + e.getMessage(), e);
        }
    }

    /**
     * Validate all required fields for publishing a product
     */
    private List<String> validateProductForPublishing(ProductCreateRequestDto request) {
        List<String> errors = new ArrayList<>();

        // Basic Information
        if (request.getProductTitle() == null || request.getProductTitle().trim().length() < 10) {
            errors.add("Product title must be at least 10 characters long");
        }
        if (request.getCategoryId() == null) {
            errors.add("Category is required");
        }
        if (request.getBrandName() == null || request.getBrandName().trim().isEmpty()) {
            errors.add("Brand name is required");
        }

        // Pricing
        if (request.getMrp() == null || request.getMrp().compareTo(BigDecimal.ONE) < 0) {
            errors.add("MRP must be at least ₹1");
        }
        if (request.getSellingPrice() == null || request.getSellingPrice().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Selling price must be greater than 0");
        }
        if (request.getMrp() != null && request.getSellingPrice() != null 
            && request.getSellingPrice().compareTo(request.getMrp()) > 0) {
            errors.add("Selling price cannot be greater than MRP");
        }

        // Inventory
        if (request.getStockQuantity() == null || request.getStockQuantity() < 0) {
            errors.add("Stock quantity cannot be negative");
        }
        if (request.getUnitOfMeasurement() == null || request.getUnitOfMeasurement().trim().isEmpty()) {
            errors.add("Unit of measurement is required");
        }

        // Media
        if (request.getMainImageUrl() == null || request.getMainImageUrl().trim().isEmpty()) {
            errors.add("Main product image is required");
        }

        // Shipping
        if (request.getWeightForShipping() == null || request.getWeightForShipping().compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Shipping weight must be greater than 0");
        }
        if (request.getDeliveryTimeEstimate() == null || request.getDeliveryTimeEstimate().trim().isEmpty()) {
            errors.add("Delivery time estimate is required");
        }

        // Descriptions
        if (request.getShortDescription() == null || request.getShortDescription().trim().length() < 50) {
            errors.add("Short description must be at least 50 characters");
        }
        if (request.getDetailedDescription() == null || request.getDetailedDescription().trim().length() < 200) {
            errors.add("Detailed description must be at least 200 characters");
        }

        // Certifications
        if (request.getFssaiLicense() == null || !request.getFssaiLicense().matches("^[0-9]{14}$")) {
            errors.add("Valid 14-digit FSSAI license is required");
        }

        return errors;
    }

    /**
     * Get vendor product by ID as DTO
     */
    public ProductResponseDto getVendorProductById(Integer vendorId, Integer productId) {
        Product product = productRepository.findById(productId.longValue())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to access this product");
        }
        
        return productMapper.toDto(product);
    }

    /**
     * Update product from DTO
     */
    public ProductResponseDto updateProductFromDto(Integer vendorId, Integer productId, ProductUpdateRequestDto request) {
        Product existingProduct = productRepository.findById(productId.longValue())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!existingProduct.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to update this product");
        }
        
        mapUpdateDtoToProduct(request, existingProduct);
        // Note: Product model doesn't have updatedAt field, relying on JPA @LastModifiedDate if needed
        
        Product savedProduct = productRepository.save(existingProduct);
        return productMapper.toDto(savedProduct);
    }

    /**
     * Duplicate product
     */
    public ProductResponseDto duplicateProduct(Integer vendorId, Integer productId, String newTitle) {
        Product originalProduct = productRepository.findById(productId.longValue())
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!originalProduct.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to duplicate this product");
        }
        
        Product duplicatedProduct = new Product();
        copyProductFields(originalProduct, duplicatedProduct);
        
        // Set new title and SKU
        duplicatedProduct.setName(newTitle != null ? newTitle : originalProduct.getName() + " - Copy");
        duplicatedProduct.setSku(generateSkuFromProduct(vendorId, duplicatedProduct));
        duplicatedProduct.setCreatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(duplicatedProduct);
        return productMapper.toDto(savedProduct);
    }

    /**
     * Bulk update product stock
     */
    public void bulkUpdateProductStock(Integer vendorId, List<Integer> productIds, String updateType, Integer value) {
        List<Product> products = productRepository.findAllById(productIds.stream().map(Long::valueOf).collect(Collectors.toList()));
        
        for (Product product : products) {
            // Verify ownership
            if (product.getCreatedBy().getUserId().equals(vendorId)) {
                Integer currentStock = product.getQuantity();
                Integer newStock;
                
                switch (updateType) {
                    case "set":
                        newStock = value;
                        break;
                    case "increase":
                        newStock = currentStock + value;
                        break;
                    case "decrease":
                        newStock = Math.max(0, currentStock - value);
                        break;
                    default:
                        throw new RuntimeException("Invalid update type: " + updateType);
                }
                
                product.setQuantity(newStock);
            }
        }
        
        productRepository.saveAll(products);
    }

    /**
     * Export products
     */
    public Map<String, String> exportProducts(Integer vendorId, String format, String status, String category, List<Integer> productIds) {
        // This would generate CSV/Excel file and return download URL
        // For now, return mock response
        Map<String, String> result = new HashMap<>();
        result.put("downloadUrl", "/api/vendor/products/download/export_" + System.currentTimeMillis() + "." + format);
        result.put("fileName", "products_export_" + System.currentTimeMillis() + "." + format);
        result.put("format", format);
        result.put("recordCount", String.valueOf(getProductCount(vendorId)));
        return result;
    }

    /**
     * Get product categories
     */
    public Map<String, Object> getProductCategories() {
        // This would return the product categories structure from product-categories.json
        Map<String, Object> categories = new HashMap<>();
        
        Map<String, Object> organicGrains = new HashMap<>();
        organicGrains.put("name", "Organic Grains & Cereals");
        organicGrains.put("id", 1);
        Map<String, Object> subcategories = new HashMap<>();
        subcategories.put("101", Map.of("name", "Wheat & Wheat Products", "hsn", "1001", "gst", 0, "id", 101));
        subcategories.put("102", Map.of("name", "Rice & Rice Products", "hsn", "1006", "gst", 0, "id", 102));
        subcategories.put("103", Map.of("name", "Corn & Corn Products", "hsn", "1005", "gst", 0, "id", 103));
        organicGrains.put("subcategories", subcategories);
        
        Map<String, Object> pulses = new HashMap<>();
        pulses.put("name", "Pulses & Legumes");
        pulses.put("id", 2);
        Map<String, Object> pulseSubcategories = new HashMap<>();
        pulseSubcategories.put("201", Map.of("name", "Lentils (Dal)", "hsn", "0713", "gst", 0, "id", 201));
        pulseSubcategories.put("202", Map.of("name", "Whole Pulses", "hsn", "0713", "gst", 0, "id", 202));
        pulses.put("subcategories", pulseSubcategories);
        
        Map<String, Object> dairy = new HashMap<>();
        dairy.put("name", "Dairy & Milk Products");
        dairy.put("id", 3);
        Map<String, Object> dairySubcategories = new HashMap<>();
        dairySubcategories.put("301", Map.of("name", "Fresh Milk", "hsn", "0401", "gst", 0, "id", 301));
        dairySubcategories.put("302", Map.of("name", "Yogurt & Curd", "hsn", "0403", "gst", 5, "id", 302));
        dairySubcategories.put("303", Map.of("name", "Cheese & Paneer", "hsn", "0406", "gst", 12, "id", 303));
        dairy.put("subcategories", dairySubcategories);
        
        categories.put("1", organicGrains);
        categories.put("2", pulses);
        categories.put("3", dairy);
        
        return categories;
    }

    /**
     * Generate SKU
     */
    public String generateSku(Integer vendorId, String category, String subcategory) {
        String categoryCode = category != null ? category.substring(0, Math.min(2, category.length())).toUpperCase() : "GM";
        String vendorCode = String.format("%03d", vendorId);
        String productNumber = String.format("%04d", (int) (Math.random() * 9999) + 1);
        
        return "GM" + categoryCode + vendorCode + productNumber;
    }

    // Helper methods for DTO mapping
    private void mapDtoToProduct(ProductCreateRequestDto dto, Product product) {
        try {
            System.out.println("=== DEBUG: Starting mapDtoToProduct with ROBUST conversion");
            
            // ===========================
            // BASIC INFORMATION
            // ===========================
            product.setName(dto.getProductTitle());
            product.setSku(dto.getSkuCode());
            product.setBrand(dto.getBrandName() != null ? dto.getBrandName() : dto.getCustomBrandName());
            product.setSubcategoryId(dto.getSubcategoryId());
            
            // Set category if provided
            if (dto.getCategoryId() != null) {
                Category category = categoryRepository.findById(dto.getCategoryId().longValue()).orElse(null);
                product.setCategory(category);
            }
            
            // Set product type
            if (dto.getProductType() != null) {
                try {
                    product.setProductType(Product.ProductType.valueOf(dto.getProductType()));
                } catch (IllegalArgumentException e) {
                    product.setProductType(Product.ProductType.SIMPLE);
                }
            }

            // ===========================
            // PRICING STRATEGY
            // ===========================
            product.setMrp(dto.getMrp());
            product.setPrice(dto.getSellingPrice());
            product.setCostPrice(dto.getCostPrice());
            product.setOfferStartDate(dto.getOfferStartDate());
            product.setOfferEndDate(dto.getOfferEndDate());

            // Handle bulk pricing tiers - ROBUST CONVERSION
            product.setBulkPricingTiers(convertBulkPricingTiers(dto.getBulkPricingTiers()));

            // ===========================
            // INVENTORY MANAGEMENT
            // ===========================
            product.setQuantity(dto.getStockQuantity());
            product.setUnitOfMeasurement(dto.getUnitOfMeasurement());
            product.setMinimumOrderQuantity(dto.getMinimumOrderQuantity());
            product.setMaximumOrderQuantity(dto.getMaximumOrderQuantity());
            product.setMinStockAlert(dto.getLowStockAlert());
            product.setTrackQuantity(dto.getTrackQuantity());
            product.setRestockDate(dto.getRestockDate());

            // ===========================
            // MEDIA GALLERY
            // ===========================
            product.setImageUrl(dto.getMainImageUrl());
            
            // Handle gallery images - ROBUST CONVERSION
            product.setGalleryImages(convertGalleryImages(dto.getGalleryImages()));
            
            product.setVideoUrl(dto.getVideoUrl());
            product.setImageAltTags(dto.getImageAltTags());

            // ===========================
            // SHIPPING & LOGISTICS
            // ===========================
            product.setWeightForShipping(dto.getWeightForShipping());
            if (dto.getDimensions() != null) {
                try {
                    String dimensionsJson = objectMapper.writeValueAsString(dto.getDimensions());
                    product.setDimensions(dimensionsJson);
                } catch (Exception e) {
                    product.setDimensions(null);
                }
            }
            product.setDeliveryTimeEstimate(dto.getDeliveryTimeEstimate());
            
            // Set shipping class enum
            if (dto.getShippingClass() != null) {
                try {
                    product.setShippingClass(Product.ShippingClass.valueOf(dto.getShippingClass()));
                } catch (IllegalArgumentException e) {
                    product.setShippingClass(Product.ShippingClass.STANDARD);
                }
            }
            
            product.setColdStorageRequired(dto.getColdStorageRequired());
            product.setSpecialPackaging(dto.getSpecialPackaging());
            product.setInsuranceRequired(dto.getInsuranceRequired());
            product.setFreeShipping(dto.getFreeShipping());
            product.setFreeShippingThreshold(dto.getFreeShippingThreshold());
            product.setIsReturnable(dto.getIsReturnable());
            
            // Set return window enum
            if (dto.getReturnWindow() != null) {
                try {
                    product.setReturnWindow(Product.ReturnWindow.valueOf(dto.getReturnWindow()));
                } catch (IllegalArgumentException e) {
                    product.setReturnWindow(Product.ReturnWindow.SEVEN_DAYS);
                }
            }
            
            product.setReturnConditions(dto.getReturnConditions());
            product.setIsCodAvailable(dto.getIsCodAvailable());

            // ===========================
            // PRODUCT DESCRIPTIONS
            // ===========================
            product.setShortDescription(dto.getShortDescription());
            product.setDescription(dto.getDetailedDescription());
            product.setKeyFeatures(dto.getKeyFeatures());
            
            // Handle product highlights - ROBUST CONVERSION
            product.setProductHighlights(convertProductHighlights(dto.getProductHighlights()));

            // ===========================
            // CERTIFICATIONS & COMPLIANCE
            // ===========================
            product.setFssaiLicense(dto.getFssaiLicense());
            
            // Handle quality certifications - ROBUST CONVERSION
            product.setQualityCertifications(convertQualityCertifications(dto.getQualityCertifications()));

            // ===========================
            // SEO OPTIMIZATION
            // ===========================
            product.setMetaTitle(dto.getMetaTitle());
            product.setMetaDescription(dto.getMetaDescription());
            product.setSearchKeywords(dto.getSearchKeywords());
            product.setUrlSlug(dto.getUrlSlug());
            
            // Handle structured data - ROBUST CONVERSION
            product.setStructuredData(convertStructuredData(dto.getStructuredData()));

            // ===========================
            // STATUS
            // ===========================
            if (dto.getStatus() != null) {
                try {
                    product.setStatus(Product.ProductStatus.valueOf(dto.getStatus()));
                } catch (IllegalArgumentException e) {
                    product.setStatus(Product.ProductStatus.DRAFT);
                }
            } else {
                product.setStatus(Product.ProductStatus.DRAFT);
            }
            
            System.out.println("=== DEBUG: Successfully completed mapDtoToProduct with ROBUST conversion");
            
        } catch (Exception e) {
            System.err.println("=== ERROR in mapDtoToProduct: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to map DTO to Product: " + e.getMessage(), e);
        }
    }

    private void mapUpdateDtoToProduct(ProductUpdateRequestDto dto, Product product) {
        if (dto.getProductTitle() != null) product.setName(dto.getProductTitle());
        if (dto.getSkuCode() != null) product.setSku(dto.getSkuCode());
        if (dto.getFullDescription() != null) product.setDescription(dto.getFullDescription());
        if (dto.getShortDescription() != null) product.setShortDescription(dto.getShortDescription());
        if (dto.getMrp() != null) product.setMrp(dto.getMrp());
        if (dto.getSellingPrice() != null) product.setPrice(dto.getSellingPrice());
        if (dto.getCostPrice() != null) product.setCostPrice(dto.getCostPrice());
        if (dto.getStockQuantity() != null) product.setQuantity(dto.getStockQuantity());
        if (dto.getBrandName() != null) product.setBrand(dto.getBrandName());
        if (dto.getWeight() != null) product.setWeightForShipping(dto.getWeight());
        if (dto.getDeliveryTimeEstimate() != null) product.setDeliveryTimeEstimate(dto.getDeliveryTimeEstimate());
        if (dto.getUrlSlug() != null) product.setUrlSlug(dto.getUrlSlug());
        if (dto.getMetaTitle() != null) product.setMetaTitle(dto.getMetaTitle());
        if (dto.getMetaDescription() != null) product.setMetaDescription(dto.getMetaDescription());
        
        // Update category if provided
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId().longValue()).orElse(null);
            product.setCategory(category);
        }
        
        // Update status
        if (dto.getStatus() != null) {
            try {
                product.setStatus(Product.ProductStatus.valueOf(dto.getStatus()));
            } catch (IllegalArgumentException e) {
                // Keep existing status if invalid
            }
        }
    }

    private void copyProductFields(Product source, Product target) {
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setShortDescription(source.getShortDescription());
        target.setMrp(source.getMrp());
        target.setPrice(source.getPrice());
        target.setCostPrice(source.getCostPrice());
        target.setQuantity(source.getQuantity());
        target.setBrand(source.getBrand());
        target.setWeightForShipping(source.getWeightForShipping());
        target.setDeliveryTimeEstimate(source.getDeliveryTimeEstimate());
        target.setImageUrl(source.getImageUrl());
        target.setVideoUrl(source.getVideoUrl());
        target.setMetaTitle(source.getMetaTitle());
        target.setMetaDescription(source.getMetaDescription());
        target.setCategory(source.getCategory());
        target.setCreatedBy(source.getCreatedBy());
        target.setStatus(Product.ProductStatus.DRAFT); // New product starts as draft
    }

    private String generateSkuFromDto(Integer vendorId, String productTitle, Integer categoryId) {
        String categoryCode = "GM";
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId.longValue()).orElse(null);
            if (category != null && category.getName() != null) {
                categoryCode = category.getName().substring(0, Math.min(2, category.getName().length())).toUpperCase();
            }
        }
        
        String vendorCode = String.format("%03d", vendorId);
        String productNumber = String.format("%04d", (int) (Math.random() * 9999) + 1);
        
        return "GM" + categoryCode + vendorCode + productNumber;
    }

    private String generateSkuFromProduct(Integer vendorId, Product product) {
        String categoryCode = "GM";
        if (product.getCategory() != null && product.getCategory().getName() != null) {
            categoryCode = product.getCategory().getName().substring(0, Math.min(2, product.getCategory().getName().length())).toUpperCase();
        }
        
        String vendorCode = String.format("%03d", vendorId);
        String productNumber = String.format("%04d", (int) (Math.random() * 9999) + 1);
        
        return "GM" + categoryCode + vendorCode + productNumber;
    }

    private String generateUrlSlug(String title) {
        return title.toLowerCase()
            .replaceAll("[^a-zA-Z0-9\\s-]", "") // Remove special characters except spaces and hyphens
            .replaceAll("\\s+", "-") // Replace spaces with hyphens
            .replaceAll("-+", "-") // Replace multiple hyphens with single hyphen
            .replaceAll("^-|-$", ""); // Remove leading/trailing hyphens
    }

    // ===========================
    // ROBUST CONVERSION METHODS
    // ===========================

    private String convertBulkPricingTiers(List<ProductCreateRequestDto.BulkPricingTier> tiers) {
        if (tiers == null || tiers.isEmpty()) {
            return null;
        }
        
        try {
            // Convert directly to JSON string for Hibernate
            String json = objectMapper.writeValueAsString(tiers);
            System.out.println("=== DEBUG: Successfully converted bulk pricing tiers to JSON: " + json);
            return json;
        } catch (Exception e) {
            System.err.println("Error converting bulk pricing tiers: " + e.getMessage());
            return null;
        }
    }

    private String convertGalleryImages(List<String> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        
        try {
            // Convert directly to JSON string for Hibernate
            String json = objectMapper.writeValueAsString(images);
            System.out.println("=== DEBUG: Successfully converted gallery images to JSON: " + json);
            return json;
        } catch (Exception e) {
            System.err.println("Error converting gallery images: " + e.getMessage());
            return null;
        }
    }

    private String convertProductHighlights(List<ProductCreateRequestDto.ProductHighlight> highlights) {
        if (highlights == null || highlights.isEmpty()) {
            return null;
        }
        
        try {
            // Convert directly to JSON string for Hibernate
            String json = objectMapper.writeValueAsString(highlights);
            System.out.println("=== DEBUG: Successfully converted product highlights to JSON: " + json);
            return json;
        } catch (Exception e) {
            System.err.println("Error converting product highlights: " + e.getMessage());
            return null;
        }
    }

    private String convertQualityCertifications(List<ProductCreateRequestDto.QualityCertification> certifications) {
        if (certifications == null || certifications.isEmpty()) {
            return null;
        }
        
        try {
            // Convert directly to JSON string for Hibernate
            String json = objectMapper.writeValueAsString(certifications);
            System.out.println("=== DEBUG: Successfully converted quality certifications to JSON: " + json);
            return json;
        } catch (Exception e) {
            System.err.println("Error converting quality certifications: " + e.getMessage());
            return null;
        }
    }

    private String convertStructuredData(Object structuredData) {
        if (structuredData == null) {
            return null;
        }
        
        try {
            // Convert directly to JSON string for Hibernate
            String json = objectMapper.writeValueAsString(structuredData);
            System.out.println("=== DEBUG: Successfully converted structured data to JSON: " + json);
            return json;
        } catch (Exception e) {
            System.err.println("Error converting structured data: " + e.getMessage());
            return null;
        }
    }
} 