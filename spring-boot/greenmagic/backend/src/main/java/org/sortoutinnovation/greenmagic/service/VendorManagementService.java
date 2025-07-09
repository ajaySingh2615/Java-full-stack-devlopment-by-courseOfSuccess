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
        Page<Product> products;
        
        try {
            // Parse status if provided
            Product.ProductStatus productStatus = null;
            if (status != null && !status.isEmpty()) {
                try {
                    productStatus = Product.ProductStatus.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid status value, ignore and continue
                }
            }
            
            // Parse category if provided
            Integer categoryId = null;
            if (category != null && !category.isEmpty()) {
                try {
                    categoryId = Integer.valueOf(category);
                } catch (NumberFormatException e) {
                    // Invalid category ID, ignore and continue
                }
            }
            
            // Use appropriate repository method based on provided filters
            if (search != null && !search.isEmpty()) {
                products = productRepository.findByVendorIdWithSearch(vendorId, search, pageable);
            } else if (productStatus != null || categoryId != null) {
                products = productRepository.findByVendorIdWithFilters(vendorId, productStatus, categoryId, pageable);
            } else {
                products = productRepository.findByCreatedByUserId(vendorId, pageable);
            }
            
            // Convert entities to DTOs to avoid serialization issues
            return products.map(product -> productMapper.toDto(product));
            
        } catch (Exception e) {
            // Return empty page on error
            return Page.empty(pageable);
        }
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
        User vendor = userRepository.findById(vendorId)
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
        Product existingProduct = productRepository.findById(productId)
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
        Product product = productRepository.findById(productId)
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
        List<Product> products = productRepository.findAllById(productIds);
        
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
        List<Product> products = productRepository.findAllById(productIds);
        
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
        Product product = productRepository.findById(productId)
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
        Product product = productRepository.findById(productId)
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
        
        User vendor = userRepository.findById(vendorId)
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
        User vendor = userRepository.findById(vendorId)
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
        // Implementation would return top-selling products
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

    /**
     * Generate SKU in format GM[XX][000][0000]
     * XX = 2 letters from category name (e.g., FR for Fruits)
     * 000 = 3-digit vendor ID
     * 0000 = 4-digit sequential product number
     */
    private String generateSKU(Integer vendorId, Product product) {
        // Get category code (2 letters)
        String categoryCode = "GM"; // Default if no category
        if (product.getCategory() != null && product.getCategory().getName() != null) {
            String categoryName = product.getCategory().getName().toUpperCase();
            // Remove any non-alphabetic characters
            categoryName = categoryName.replaceAll("[^A-Z]", "");
            // Take first two letters, or pad with 'X' if needed
            if (categoryName.length() >= 2) {
                categoryCode = categoryName.substring(0, 2);
            } else if (categoryName.length() == 1) {
                categoryCode = categoryName + "X";
            }
        }
        
        // Format vendor ID to 3 digits
        String vendorCode = String.format("%03d", vendorId);
        
        // Get sequential number based on existing products count
        long sequence = getProductCount(vendorId) + 1;
        String productNumber = String.format("%04d", sequence);
        
        return "GM" + categoryCode + vendorCode + productNumber;
    }

    /**
     * Generate SKU from DTO
     */
    private String generateSkuFromDto(Integer vendorId, String productTitle, Integer categoryId) {
        // Get category code (2 letters)
        String categoryCode = "GM"; // Default if no category
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElse(null);
            if (category != null && category.getName() != null) {
                String categoryName = category.getName().toUpperCase();
                // Remove any non-alphabetic characters
                categoryName = categoryName.replaceAll("[^A-Z]", "");
                // Take first two letters, or pad with 'X' if needed
                if (categoryName.length() >= 2) {
                    categoryCode = categoryName.substring(0, 2);
                } else if (categoryName.length() == 1) {
                    categoryCode = categoryName + "X";
                }
            }
        }
        
        // Format vendor ID to 3 digits
        String vendorCode = String.format("%03d", vendorId);
        
        // Get sequential number based on existing products count
        long sequence = getProductCount(vendorId) + 1;
        String productNumber = String.format("%04d", sequence);
        
        return "GM" + categoryCode + vendorCode + productNumber;
    }

    /**
     * Generate SKU for public API
     */
    public String generateSku(Integer vendorId, String category, String subcategory) {
        // Get category code (2 letters)
        String categoryCode = "GM"; // Default if no category
        if (category != null && !category.isEmpty()) {
            String categoryName = category.toUpperCase();
            // Remove any non-alphabetic characters
            categoryName = categoryName.replaceAll("[^A-Z]", "");
            // Take first two letters, or pad with 'X' if needed
            if (categoryName.length() >= 2) {
                categoryCode = categoryName.substring(0, 2);
            } else if (categoryName.length() == 1) {
                categoryCode = categoryName + "X";
            }
        }
        
        // Format vendor ID to 3 digits
        String vendorCode = String.format("%03d", vendorId);
        
        // Get sequential number based on existing products count
        long sequence = getProductCount(vendorId) + 1;
        String productNumber = String.format("%04d", sequence);
        
        return "GM" + categoryCode + vendorCode + productNumber;
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
            User vendor = userRepository.findById(vendorId)
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

            // Create new product and set vendor first
            Product product = new Product();
            product.setCreatedBy(vendor);
            product.setCreatedAt(LocalDateTime.now());
            
            // Map DTO to Product using our fixed method
            mapDtoToProduct(request, product);
            
            // Set system fields
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

        // Certifications - OPTIONAL validation
        if (request.getFssaiLicense() != null && !request.getFssaiLicense().trim().isEmpty() 
            && !request.getFssaiLicense().matches("^[0-9]{14}$")) {
            errors.add("FSSAI license must be exactly 14 digits when provided");
        }

        return errors;
    }

    /**
     * Get vendor product by ID as DTO
     */
    public ProductResponseDto getVendorProductById(Integer vendorId, Integer productId) {
        Product product = productRepository.findById(productId)
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
    public ProductResponseDto updateProductFromDto(Integer vendorId, Integer productId, ProductUpdateRequestDto dto) {
        Product existingProduct = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!existingProduct.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to update this product");
        }
        
        // Handle SKU - Generate if not provided
        if (dto.getSkuCode() == null || dto.getSkuCode().trim().isEmpty()) {
            // Generate new SKU using existing product data
            String newSku = generateSkuFromProduct(vendorId, existingProduct);
            dto.setSkuCode(newSku);
            System.out.println("=== DEBUG: Generated new SKU for update: " + newSku);
        }
        
        mapUpdateDtoToProduct(dto, existingProduct);
        Product savedProduct = productRepository.save(existingProduct);
        return productMapper.toDto(savedProduct);
    }

    /**
     * Duplicate product
     */
    public ProductResponseDto duplicateProduct(Integer vendorId, Integer productId, String newTitle) {
        System.out.println("=== DEBUG: Starting duplicateProduct - vendorId: " + vendorId + ", productId: " + productId + ", newTitle: " + newTitle);
        
        Product originalProduct = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        System.out.println("=== DEBUG: Found original product: " + originalProduct.getName());
        
        // Verify ownership
        if (!originalProduct.getCreatedBy().getUserId().equals(vendorId)) {
            System.out.println("=== DEBUG: Unauthorized access - original product created by: " + originalProduct.getCreatedBy().getUserId() + ", current vendor: " + vendorId);
            throw new RuntimeException("Unauthorized to duplicate this product");
        }
        
        System.out.println("=== DEBUG: Ownership verified");
        
        // Get the current vendor/user
        User vendor = userRepository.findById(vendorId)
            .orElseThrow(() -> new RuntimeException("Vendor not found"));
        
        System.out.println("=== DEBUG: Found vendor: " + vendor.getName());
        
        Product duplicatedProduct = new Product();
        copyProductFields(originalProduct, duplicatedProduct);
        
        System.out.println("=== DEBUG: Copied product fields");
        
        // Set new title and SKU
        duplicatedProduct.setName(newTitle != null ? newTitle : originalProduct.getName() + " - Copy");
        duplicatedProduct.setSku(generateSkuFromProduct(vendorId, duplicatedProduct));
        duplicatedProduct.setCreatedAt(LocalDateTime.now());
        
        System.out.println("=== DEBUG: Set new title and SKU: " + duplicatedProduct.getName() + ", " + duplicatedProduct.getSku());
        
        // IMPORTANT: Set the createdBy to the current vendor, not the original product's creator
        duplicatedProduct.setCreatedBy(vendor);
        
        System.out.println("=== DEBUG: Set createdBy to vendor: " + vendor.getName());
        
        try {
            Product savedProduct = productRepository.save(duplicatedProduct);
            System.out.println("=== DEBUG: Product saved successfully with ID: " + savedProduct.getProductId());
            return productMapper.toDto(savedProduct);
        } catch (Exception e) {
            System.err.println("=== ERROR: Failed to save product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to save duplicated product: " + e.getMessage());
        }
    }

    /**
     * Get detailed product information for comprehensive editing
     */
    public Map<String, Object> getProductDetails(Integer vendorId, Integer productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to access this product");
        }
        
        Map<String, Object> details = new HashMap<>();
        
        // ===========================
        // BASIC INFORMATION
        // ===========================
        Map<String, Object> basic = new HashMap<>();
        basic.put("productId", product.getProductId());
        basic.put("name", product.getName());
        basic.put("description", product.getDescription());
        basic.put("shortDescription", product.getShortDescription());
        basic.put("sku", product.getSku());
        basic.put("categoryId", product.getCategory() != null ? product.getCategory().getCategoryId() : null);
        basic.put("categoryName", product.getCategory() != null ? product.getCategory().getName() : "Uncategorized");
        basic.put("subcategoryId", product.getSubcategoryId());
        basic.put("brand", product.getBrand());
        basic.put("productType", product.getProductType() != null ? product.getProductType().toString() : "SIMPLE");
        basic.put("status", product.getStatus() != null ? product.getStatus().toString() : "ACTIVE");
        basic.put("createdAt", product.getCreatedAt());
        basic.put("updatedAt", product.getCreatedAt()); // Using createdAt since updatedAt doesn't exist
        details.put("basic", basic);
        
        // ===========================
        // PRICING STRATEGY
        // ===========================
        Map<String, Object> pricing = new HashMap<>();
        pricing.put("price", product.getPrice());
        pricing.put("mrp", product.getMrp());
        pricing.put("costPrice", product.getCostPrice());
        pricing.put("offerStartDate", product.getOfferStartDate());
        pricing.put("offerEndDate", product.getOfferEndDate());
        pricing.put("bulkPricingTiers", product.getBulkPricingTiers());
        pricing.put("comparePrice", product.getMrp()); // Use MRP as compare price
        pricing.put("margin", calculateMargin(product.getPrice(), product.getCostPrice()));
        details.put("pricing", pricing);
        
        // ===========================
        // INVENTORY MANAGEMENT
        // ===========================
        Map<String, Object> inventory = new HashMap<>();
        inventory.put("stockQuantity", product.getQuantity());
        inventory.put("unitOfMeasurement", product.getUnitOfMeasurement());
        inventory.put("minimumOrderQuantity", product.getMinimumOrderQuantity());
        inventory.put("maximumOrderQuantity", product.getMaximumOrderQuantity());
        inventory.put("minStockAlert", product.getMinStockAlert() != null ? product.getMinStockAlert() : 10);
        inventory.put("trackQuantity", product.getTrackQuantity());
        inventory.put("restockDate", product.getRestockDate());
        inventory.put("variants", getProductVariants(vendorId, productId));
        details.put("inventory", inventory);
        
        // ===========================
        // MEDIA GALLERY
        // ===========================
        Map<String, Object> media = new HashMap<>();
        List<String> images = new ArrayList<>();
        if (product.getImageUrl() != null && !product.getImageUrl().isEmpty()) {
            images.add(product.getImageUrl());
        }
        // Add gallery images if available
        if (product.getGalleryImages() != null && !product.getGalleryImages().isEmpty()) {
            // Parse gallery images JSON string
            try {
                String[] galleryImages = product.getGalleryImages().split(",");
                for (String img : galleryImages) {
                    if (!img.trim().isEmpty()) {
                        images.add(img.trim());
                    }
                }
            } catch (Exception e) {
                // Fallback if parsing fails
            }
        }
        media.put("images", images);
        media.put("mainImageUrl", product.getImageUrl());
        media.put("galleryImages", images.size() > 1 ? images.subList(1, images.size()) : new ArrayList<>());
        media.put("videoUrl", product.getVideoUrl());
        media.put("imageAltTags", product.getImageAltTags() != null ? product.getImageAltTags() : new ArrayList<>());
        media.put("videos", new ArrayList<>());
        media.put("documents", new ArrayList<>());
        details.put("media", media);
        
        // ===========================
        // SHIPPING & LOGISTICS
        // ===========================
        Map<String, Object> shipping = new HashMap<>();
        shipping.put("weightForShipping", product.getWeightForShipping());
        shipping.put("dimensions", product.getDimensions());
        shipping.put("deliveryTimeEstimate", product.getDeliveryTimeEstimate());
        shipping.put("shippingClass", product.getShippingClass() != null ? product.getShippingClass().toString() : "STANDARD");
        shipping.put("coldStorageRequired", product.getColdStorageRequired());
        shipping.put("specialPackaging", product.getSpecialPackaging());
        shipping.put("insuranceRequired", product.getInsuranceRequired());
        shipping.put("freeShipping", product.getFreeShipping());
        shipping.put("freeShippingThreshold", product.getFreeShippingThreshold());
        shipping.put("isReturnable", product.getIsReturnable());
        shipping.put("returnWindow", product.getReturnWindow() != null ? product.getReturnWindow().toString() : "SEVEN_DAYS");
        shipping.put("returnConditions", product.getReturnConditions() != null ? product.getReturnConditions() : new ArrayList<>());
        shipping.put("isCodAvailable", product.getIsCodAvailable());
        details.put("shipping", shipping);
        
        // ===========================
        // PRODUCT DESCRIPTIONS
        // ===========================
        Map<String, Object> descriptions = new HashMap<>();
        descriptions.put("shortDescription", product.getShortDescription());
        descriptions.put("detailedDescription", product.getDescription());
        descriptions.put("keyFeatures", product.getKeyFeatures() != null ? product.getKeyFeatures() : new ArrayList<>());
        descriptions.put("productHighlights", product.getProductHighlights());
        descriptions.put("usageInstructions", ""); // Not in current model
        descriptions.put("storageInstructions", ""); // Not in current model
        descriptions.put("ingredients", ""); // Not in current model
        descriptions.put("nutritionalInfo", ""); // Not in current model
        descriptions.put("shelfLife", ""); // Not in current model
        descriptions.put("origin", ""); // Not in current model
        details.put("descriptions", descriptions);
        
        // ===========================
        // CERTIFICATIONS & COMPLIANCE
        // ===========================
        Map<String, Object> certifications = new HashMap<>();
        certifications.put("fssaiLicense", product.getFssaiLicense());
        certifications.put("organicCertification", ""); // Not in current model
        certifications.put("isoCertification", ""); // Not in current model
        certifications.put("qualityCertifications", product.getQualityCertifications());
        details.put("certifications", certifications);
        
        // ===========================
        // SEO & MARKETING
        // ===========================
        Map<String, Object> seo = new HashMap<>();
        seo.put("metaTitle", product.getMetaTitle());
        seo.put("metaDescription", product.getMetaDescription());
        seo.put("searchKeywords", product.getSearchKeywords() != null ? product.getSearchKeywords() : new ArrayList<>());
        seo.put("urlSlug", product.getUrlSlug());
        seo.put("structuredData", product.getStructuredData());
        seo.put("socialMediaText", ""); // Not in current model
        details.put("seo", seo);
        
        // Analytics placeholder
        details.put("analytics", getProductAnalytics(vendorId, productId));
        
        return details;
    }

    /**
     * Get product analytics data
     */
    public Map<String, Object> getProductAnalytics(Integer vendorId, Integer productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to access this product");
        }
        
        Map<String, Object> analytics = new HashMap<>();
        
        // Mock analytics data - In real implementation, these would come from order/analytics tables
        analytics.put("totalSales", getProductSalesCount(productId));
        analytics.put("totalRevenue", getProductRevenue(productId));
        analytics.put("pageViews", Math.random() * 1000); // Mock data
        analytics.put("addToCartRate", Math.random() * 0.3); // Mock conversion rate
        analytics.put("conversionRate", Math.random() * 0.15); // Mock conversion rate
        analytics.put("averageRating", 4.2 + (Math.random() * 0.8)); // Mock rating 4.2-5.0
        analytics.put("reviewCount", (int)(Math.random() * 50)); // Mock review count
        
        return analytics;
    }

    /**
     * Quick update product fields
     */
    public ProductResponseDto quickUpdateProduct(Integer vendorId, Integer productId, Map<String, Object> updateFields) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to update this product");
        }
        
        // Update allowed fields
        if (updateFields.containsKey("price")) {
            BigDecimal price = new BigDecimal(updateFields.get("price").toString());
            product.setPrice(price);
        }
        
        if (updateFields.containsKey("stockQuantity")) {
            Integer stock = Integer.valueOf(updateFields.get("stockQuantity").toString());
            product.setQuantity(stock);
        }
        
        if (updateFields.containsKey("status")) {
            String status = updateFields.get("status").toString();
            try {
                product.setStatus(Product.ProductStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + status);
            }
        }
        
        if (updateFields.containsKey("minStockAlert")) {
            Integer threshold = Integer.valueOf(updateFields.get("minStockAlert").toString());
            product.setMinStockAlert(threshold);
        }
        
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }

    /**
     * Update product status
     */
    public ProductResponseDto updateProductStatus(Integer vendorId, Integer productId, String status) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Verify ownership
        if (!product.getCreatedBy().getUserId().equals(vendorId)) {
            throw new RuntimeException("Unauthorized to update this product");
        }
        
        try {
            product.setStatus(Product.ProductStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }

    // Helper methods for analytics
    private Integer getProductSalesCount(Integer productId) {
        // In real implementation, query from order_items table
        return (int)(Math.random() * 100); // Mock data
    }

    private BigDecimal getProductRevenue(Integer productId) {
        // In real implementation, sum revenue from order_items table
        return BigDecimal.valueOf(Math.random() * 10000); // Mock data
    }

    private BigDecimal calculateMargin(BigDecimal sellingPrice, BigDecimal costPrice) {
        if (costPrice == null || costPrice.equals(BigDecimal.ZERO)) {
            return BigDecimal.ZERO;
        }
        return sellingPrice.subtract(costPrice).divide(sellingPrice, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
    }

    /**
     * Bulk update product stock
     */
    public void bulkUpdateProductStock(Integer vendorId, List<Integer> productIds, String updateType, Integer value) {
        List<Product> products = productRepository.findAllById(productIds);
        
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
     * Get product categories from database
     * SIMPLIFIED: Returns only categories (no subcategories)
     */
    public Map<String, Object> getProductCategories() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Get real categories from database
            List<Category> dbCategories = categoryRepository.findAll();
            
            for (Category category : dbCategories) {
                Map<String, Object> categoryData = new HashMap<>();
                categoryData.put("id", category.getCategoryId());
                categoryData.put("name", category.getName());
                // No subcategories - admin controls categories only
                
                result.put(String.valueOf(category.getCategoryId()), categoryData);
            }
            
            // If no categories found in database, return default ones
            if (result.isEmpty()) {
                System.out.println("=== WARNING: No categories found in database, returning defaults");
                return getDefaultCategories();
            }
            
            System.out.println("=== DEBUG: Retrieved " + result.size() + " categories from database");
            return result;
            
        } catch (Exception e) {
            System.err.println("=== ERROR: Failed to retrieve categories from database: " + e.getMessage());
            e.printStackTrace();
            // Fallback to default categories
            return getDefaultCategories();
        }
    }
    
    /**
     * Fallback method for default categories (no subcategories)
     */
    private Map<String, Object> getDefaultCategories() {
        Map<String, Object> categories = new HashMap<>();
        
        Map<String, Object> vegetables = new HashMap<>();
        vegetables.put("name", "Vegetables");
        vegetables.put("id", 1);
        
        Map<String, Object> fruits = new HashMap<>();
        fruits.put("name", "Fruits");
        fruits.put("id", 2);
        
        Map<String, Object> grains = new HashMap<>();
        grains.put("name", "Grains");
        grains.put("id", 3);
        
        categories.put("1", vegetables);
        categories.put("2", fruits);
        categories.put("3", grains);
        
        return categories;
    }

    // Helper methods for DTO mapping
    private void mapDtoToProduct(ProductCreateRequestDto dto, Product product) {
        try {
            // BASIC INFORMATION
            // ===========================
            product.setName(dto.getProductTitle());
            
            // Handle SKU - Generate if not provided
            String sku = dto.getSkuCode();
            if (sku == null || sku.trim().isEmpty()) {
                // Get vendor ID from the context
                User vendor = product.getCreatedBy();
                if (vendor == null || vendor.getUserId() == null) {
                    throw new RuntimeException("Vendor information is required to generate SKU");
                }
                
                // Generate SKU using category if available
                Integer categoryId = dto.getCategoryId();
                sku = generateSkuFromDto(vendor.getUserId().intValue(), dto.getProductTitle(), categoryId);
                System.out.println("=== DEBUG: Generated SKU: " + sku);
            }
            product.setSku(sku);
            
            product.setBrand(dto.getBrandName());
            product.setProductType(Product.ProductType.valueOf(dto.getProductType().toUpperCase()));
            
            // CATEGORY MAPPING - FIX MISSING IMPLEMENTATION
            // ===========================
            if (dto.getCategoryId() != null) {
                try {
                    Category category = categoryRepository.findById(dto.getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found with ID: " + dto.getCategoryId()));
                    product.setCategory(category);
                    System.out.println("=== DEBUG: Category set successfully: " + category.getName());
                } catch (Exception e) {
                    System.err.println("=== ERROR: Failed to set category: " + e.getMessage());
                    throw new RuntimeException("Invalid category ID: " + dto.getCategoryId(), e);
                }
            }
            
            // SUBCATEGORY - Store as integer for now (no Subcategory entity exists)
            if (dto.getSubcategoryId() != null) {
                product.setSubcategoryId(dto.getSubcategoryId());
            }
            
            // PRICING STRATEGY
            // ===========================
            product.setMrp(dto.getMrp());
            product.setPrice(dto.getSellingPrice());
            product.setCostPrice(dto.getCostPrice());
            product.setOfferStartDate(dto.getOfferStartDate());
            product.setOfferEndDate(dto.getOfferEndDate());
            
            // Handle bulk pricing tiers - ROBUST CONVERSION
            product.setBulkPricingTiers(convertBulkPricingTiers(dto.getBulkPricingTiers()));

            // INVENTORY MANAGEMENT
            // ===========================
            product.setQuantity(dto.getStockQuantity());
            product.setUnitOfMeasurement(dto.getUnitOfMeasurement());
            product.setMinimumOrderQuantity(dto.getMinimumOrderQuantity());
            product.setMaximumOrderQuantity(dto.getMaximumOrderQuantity());
            product.setMinStockAlert(dto.getLowStockAlert());
            product.setTrackQuantity(dto.getTrackQuantity());
            product.setRestockDate(dto.getRestockDate());

            // MEDIA GALLERY
            // ===========================
            // Map mainImageUrl to imageUrl
            product.setImageUrl(dto.getMainImageUrl());
            product.setVideoUrl(dto.getVideoUrl());
            product.setImageAltTags(dto.getImageAltTags());
            
            // Handle gallery images - ROBUST CONVERSION
            product.setGalleryImages(convertGalleryImages(dto.getGalleryImages()));

            // SHIPPING & LOGISTICS
            // ===========================
            product.setWeightForShipping(dto.getWeightForShipping());
            product.setDimensions(objectMapper.writeValueAsString(dto.getDimensions()));
            product.setDeliveryTimeEstimate(dto.getDeliveryTimeEstimate());
            product.setShippingClass(Product.ShippingClass.valueOf(dto.getShippingClass().toUpperCase()));
            product.setColdStorageRequired(dto.getColdStorageRequired());
            product.setSpecialPackaging(dto.getSpecialPackaging());
            product.setInsuranceRequired(dto.getInsuranceRequired());
            product.setFreeShipping(dto.getFreeShipping());
            product.setFreeShippingThreshold(dto.getFreeShippingThreshold());
            product.setIsReturnable(dto.getIsReturnable());
            product.setReturnWindow(Product.ReturnWindow.valueOf(dto.getReturnWindow().toUpperCase()));
            product.setReturnConditions(dto.getReturnConditions());
            product.setIsCodAvailable(dto.getIsCodAvailable());

            // PRODUCT DESCRIPTIONS
            // ===========================
            product.setShortDescription(dto.getShortDescription());
            product.setDescription(dto.getDetailedDescription());
            product.setKeyFeatures(dto.getKeyFeatures());
            
            // Handle product highlights - ROBUST CONVERSION
            product.setProductHighlights(convertProductHighlights(dto.getProductHighlights()));

            // CERTIFICATIONS & COMPLIANCE
            // ===========================
            product.setFssaiLicense(dto.getFssaiLicense());
            
            // Handle quality certifications - ROBUST CONVERSION
            product.setQualityCertifications(convertQualityCertifications(dto.getQualityCertifications()));

            // SEO OPTIMIZATION
            // ===========================
            product.setMetaTitle(dto.getMetaTitle());
            product.setMetaDescription(dto.getMetaDescription());
            product.setSearchKeywords(dto.getSearchKeywords());
            product.setUrlSlug(dto.getUrlSlug());
            
            // Handle structured data - ROBUST CONVERSION
            product.setStructuredData(convertStructuredData(dto.getStructuredData()));

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
        if (dto.getDetailedDescription() != null) product.setDescription(dto.getDetailedDescription());
        if (dto.getShortDescription() != null) product.setShortDescription(dto.getShortDescription());
        if (dto.getMrp() != null) product.setMrp(dto.getMrp());
        if (dto.getSellingPrice() != null) product.setPrice(dto.getSellingPrice());
        if (dto.getCostPrice() != null) product.setCostPrice(dto.getCostPrice());
        
        // Inventory Management fields
        if (dto.getStockQuantity() != null) product.setQuantity(dto.getStockQuantity());
        if (dto.getUnitOfMeasurement() != null) product.setUnitOfMeasurement(dto.getUnitOfMeasurement());
        if (dto.getMinimumOrderQuantity() != null) product.setMinimumOrderQuantity(dto.getMinimumOrderQuantity());
        if (dto.getMaximumOrderQuantity() != null) product.setMaximumOrderQuantity(dto.getMaximumOrderQuantity());
        if (dto.getLowStockAlert() != null) product.setMinStockAlert(dto.getLowStockAlert());
        if (dto.getTrackQuantity() != null) product.setTrackQuantity(dto.getTrackQuantity());
        if (dto.getRestockDate() != null) product.setRestockDate(dto.getRestockDate());
        
        if (dto.getBrandName() != null) product.setBrand(dto.getBrandName());
        
        // Shipping & Logistics fields
        if (dto.getWeightForShipping() != null) product.setWeightForShipping(dto.getWeightForShipping());
        if (dto.getDimensions() != null) {
            try {
                String dimensionsJson = objectMapper.writeValueAsString(dto.getDimensions());
                product.setDimensions(dimensionsJson);
            } catch (Exception e) {
                System.err.println("Error converting dimensions to JSON: " + e.getMessage());
            }
        }
        if (dto.getDeliveryTimeEstimate() != null) product.setDeliveryTimeEstimate(dto.getDeliveryTimeEstimate());
        if (dto.getShippingClass() != null) {
            try {
                product.setShippingClass(Product.ShippingClass.valueOf(dto.getShippingClass().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep existing shipping class if invalid
            }
        }
        if (dto.getColdStorageRequired() != null) product.setColdStorageRequired(dto.getColdStorageRequired());
        if (dto.getSpecialPackaging() != null) product.setSpecialPackaging(dto.getSpecialPackaging());
        if (dto.getInsuranceRequired() != null) product.setInsuranceRequired(dto.getInsuranceRequired());
        if (dto.getFreeShipping() != null) product.setFreeShipping(dto.getFreeShipping());
        if (dto.getFreeShippingThreshold() != null) product.setFreeShippingThreshold(dto.getFreeShippingThreshold());
        if (dto.getIsReturnable() != null) product.setIsReturnable(dto.getIsReturnable());
        if (dto.getReturnWindow() != null) {
            try {
                product.setReturnWindow(Product.ReturnWindow.valueOf(dto.getReturnWindow().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep existing return window if invalid
            }
        }
        if (dto.getIsCodAvailable() != null) product.setIsCodAvailable(dto.getIsCodAvailable());
        
        if (dto.getUrlSlug() != null) product.setUrlSlug(dto.getUrlSlug());
        if (dto.getMetaTitle() != null) product.setMetaTitle(dto.getMetaTitle());
        if (dto.getMetaDescription() != null) product.setMetaDescription(dto.getMetaDescription());
        
        // Handle offer dates
        if (dto.getOfferStartDate() != null) {
            System.out.println("=== DEBUG: Setting offer start date: " + dto.getOfferStartDate());
            product.setOfferStartDate(dto.getOfferStartDate());
        }
        if (dto.getOfferEndDate() != null) {
            System.out.println("=== DEBUG: Setting offer end date: " + dto.getOfferEndDate());
            product.setOfferEndDate(dto.getOfferEndDate());
        }
        
        // Handle product type
        if (dto.getProductType() != null) {
            try {
                product.setProductType(Product.ProductType.valueOf(dto.getProductType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep existing product type if invalid value is provided
            }
        }
        
        // Handle media fields
        if (dto.getMainImageUrl() != null) product.setImageUrl(dto.getMainImageUrl());
        if (dto.getVideoUrl() != null) product.setVideoUrl(dto.getVideoUrl());
        if (dto.getImageAltTags() != null) product.setImageAltTags(dto.getImageAltTags());
        
        // Handle gallery images
        if (dto.getImageUrls() != null) {
            try {
                System.out.println("Received imageUrls: " + dto.getImageUrls());
                List<String> cleanUrls = new ArrayList<>();
                
                // Clean up each URL in the list
                for (String url : dto.getImageUrls()) {
                    try {
                        // If the URL is a JSON string, parse it
                        if (url.startsWith("[")) {
                            List<String> parsed = objectMapper.readValue(url, List.class);
                            cleanUrls.addAll(parsed);
                        } else {
                            cleanUrls.add(url);
                        }
                    } catch (Exception e) {
                        cleanUrls.add(url);
                    }
                }
                
                System.out.println("Cleaned URLs: " + cleanUrls);
                String galleryImagesJson = objectMapper.writeValueAsString(cleanUrls);
                System.out.println("Final gallery JSON: " + galleryImagesJson);
                product.setGalleryImages(galleryImagesJson);
            } catch (Exception e) {
                // Keep existing gallery images if JSON conversion fails
                System.err.println("Error converting gallery images to JSON: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        // Update category if provided - FIXED IMPLEMENTATION
        if (dto.getCategoryId() != null) {
            try {
                Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + dto.getCategoryId()));
            product.setCategory(category);
                System.out.println("=== DEBUG: Category updated successfully: " + category.getName());
            } catch (Exception e) {
                System.err.println("=== ERROR: Failed to update category: " + e.getMessage());
                // Keep existing category if invalid
            }
        }
        
        // NOTE: Subcategory support removed - admin controls categories only
        
        // Update status
        if (dto.getStatus() != null) {
            try {
                product.setStatus(Product.ProductStatus.valueOf(dto.getStatus()));
            } catch (IllegalArgumentException e) {
                // Keep existing status if invalid
            }
        }
        
        // Handle bulk pricing tiers
        if (dto.getBulkPricing() != null) {
            try {
                String bulkPricingJson = objectMapper.writeValueAsString(dto.getBulkPricing());
                System.out.println("=== DEBUG: Setting bulk pricing tiers: " + bulkPricingJson);
                product.setBulkPricingTiers(bulkPricingJson);
            } catch (Exception e) {
                System.err.println("=== ERROR: Failed to update bulk pricing tiers: " + e.getMessage());
                e.printStackTrace();
            }
        }

        // Handle key features
        if (dto.getKeyFeatures() != null) {
            product.setKeyFeatures(dto.getKeyFeatures());
        }

        // Handle product highlights
        if (dto.getProductHighlights() != null) {
            try {
                List<Map<String, String>> highlights = dto.getProductHighlights().stream()
                    .map(highlight -> {
                        Map<String, String> map = new HashMap<>();
                        map.put("title", highlight.getTitle());
                        map.put("description", highlight.getDescription());
                        map.put("icon", highlight.getIcon());
                        return map;
                    })
                    .collect(Collectors.toList());
                product.setProductHighlights(highlights);
            } catch (Exception e) {
                System.err.println("Error converting product highlights: " + e.getMessage());
            }
        }

        // Handle search keywords
        if (dto.getKeywords() != null) {
            product.setSearchKeywords(dto.getKeywords());
        }
        
        // Handle certification fields - MISSING MAPPINGS ADDED
        if (dto.getFssaiLicense() != null) {
            product.setFssaiLicense(dto.getFssaiLicense());
        }
        
        if (dto.getQualityCertifications() != null) {
            // Convert qualityCertifications to JSON string
            try {
                String certificationsJson = objectMapper.writeValueAsString(dto.getQualityCertifications());
                product.setQualityCertifications(certificationsJson);
            } catch (Exception e) {
                System.err.println("Error converting quality certifications to JSON: " + e.getMessage());
                // Keep existing certifications if conversion fails
            }
        }
    }

    private void copyProductFields(Product source, Product target) {
        // Basic information
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setShortDescription(source.getShortDescription());
        target.setBrand(source.getBrand());
        target.setCategory(source.getCategory());
        target.setSubcategoryId(source.getSubcategoryId());
        target.setProductType(source.getProductType());
        
        // Pricing
        target.setMrp(source.getMrp());
        target.setPrice(source.getPrice());
        target.setCostPrice(source.getCostPrice());
        target.setOfferStartDate(source.getOfferStartDate());
        target.setOfferEndDate(source.getOfferEndDate());
        target.setBulkPricingTiers(source.getBulkPricingTiers());
        
        // Inventory
        target.setQuantity(source.getQuantity());
        target.setUnitOfMeasurement(source.getUnitOfMeasurement());
        target.setMinimumOrderQuantity(source.getMinimumOrderQuantity());
        target.setMaximumOrderQuantity(source.getMaximumOrderQuantity());
        target.setMinStockAlert(source.getMinStockAlert());
        target.setTrackQuantity(source.getTrackQuantity());
        target.setRestockDate(source.getRestockDate());
        
        // Media
        target.setImageUrl(source.getImageUrl());
        target.setVideoUrl(source.getVideoUrl());
        target.setGalleryImages(source.getGalleryImages());
        target.setImageAltTags(source.getImageAltTags());
        
        // Shipping
        target.setWeightForShipping(source.getWeightForShipping());
        target.setDimensions(source.getDimensions());
        target.setDeliveryTimeEstimate(source.getDeliveryTimeEstimate());
        target.setShippingClass(source.getShippingClass());
        target.setColdStorageRequired(source.getColdStorageRequired());
        target.setSpecialPackaging(source.getSpecialPackaging());
        target.setInsuranceRequired(source.getInsuranceRequired());
        target.setFreeShipping(source.getFreeShipping());
        target.setFreeShippingThreshold(source.getFreeShippingThreshold());
        target.setIsReturnable(source.getIsReturnable());
        target.setReturnWindow(source.getReturnWindow());
        target.setReturnConditions(source.getReturnConditions());
        target.setIsCodAvailable(source.getIsCodAvailable());
        
        // Features and Descriptions
        target.setKeyFeatures(source.getKeyFeatures());
        target.setProductHighlights(source.getProductHighlights());
        
        // SEO
        target.setMetaTitle(source.getMetaTitle());
        target.setMetaDescription(source.getMetaDescription());
        target.setSearchKeywords(source.getSearchKeywords());
        
        // Certifications
        target.setFssaiLicense(source.getFssaiLicense());
        target.setQualityCertifications(source.getQualityCertifications());
        
        // Status
        target.setStatus(Product.ProductStatus.DRAFT); // New product starts as draft
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

    private List<Map<String, String>> convertProductHighlights(List<ProductCreateRequestDto.ProductHighlight> highlights) {
        if (highlights == null || highlights.isEmpty()) {
            return null;
        }
        
        try {
            return highlights.stream()
                .map(highlight -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("title", highlight.getTitle());
                    map.put("description", highlight.getDescription());
                    map.put("icon", highlight.getIcon());
                    return map;
                })
                .collect(Collectors.toList());
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