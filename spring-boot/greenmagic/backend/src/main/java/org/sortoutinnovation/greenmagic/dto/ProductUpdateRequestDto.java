package org.sortoutinnovation.greenmagic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO for updating existing products via vendor dashboard
 * Based on product-form-structure.json specifications
 * Most fields are optional for partial updates
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequestDto {

    // Basic Information
    @Size(min = 10, max = 100, message = "Product title must be between 10 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-\\.\\(\\)]+$", message = "Product title contains invalid characters")
    private String productTitle;

    private Integer categoryId;
    private String subcategory;

    @Size(max = 50, message = "Brand name cannot exceed 50 characters")
    private String brandName;

    private String customBrandName;

    @Pattern(regexp = "^GM[A-Z]{2}[0-9]{3}[0-9]{4}$", message = "Invalid SKU format")
    private String skuCode;

    @Pattern(regexp = "^(SIMPLE|VARIABLE)$", message = "Product type must be 'SIMPLE' or 'VARIABLE'")
    private String productType;

    // Pricing Strategy
    @DecimalMin(value = "1.0", message = "MRP must be at least ₹1")
    @DecimalMax(value = "100000.0", message = "MRP cannot exceed ₹100,000")
    private BigDecimal mrp;

    @DecimalMin(value = "1.0", message = "Selling price must be at least ₹1")
    private BigDecimal sellingPrice;

    @DecimalMin(value = "0.0", message = "Cost price cannot be negative")
    private BigDecimal costPrice;

    private LocalDateTime offerStartDate;
    private LocalDateTime offerEndDate;

    // Bulk pricing tiers
    private List<BulkPricingTier> bulkPricing;

    // Inventory Management
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private String unitOfMeasurement;

    @Min(value = 1, message = "Minimum order quantity must be at least 1")
    private Integer minimumOrderQuantity;

    private Integer maximumOrderQuantity;

    @Min(value = 1, message = "Low stock alert must be at least 1")
    private Integer lowStockAlert;

    private Boolean trackQuantity;

    private java.time.LocalDate restockDate;

    // Product Variants (for variable products)
    private Boolean hasVariants;
    private List<String> variantAttributes;
    private List<ProductVariantDto> variants;

    // Media Gallery
    @Size(max = 255, message = "Main image URL must not exceed 255 characters")
    private String mainImageUrl;

    private List<String> imageUrls;
    
    @Size(max = 255, message = "Video URL must not exceed 255 characters")
    private String videoUrl;
    
    private List<String> imageAltTags;

    // Shipping & Logistics
    private BigDecimal weightForShipping;
    private ProductDimensions dimensions;
    private String deliveryTimeEstimate;
    private String shippingClass;
    private Boolean coldStorageRequired;
    private Boolean specialPackaging;
    private Boolean insuranceRequired;
    private Boolean freeShipping;
    private BigDecimal freeShippingThreshold;
    private Boolean isReturnable;
    private String returnWindow;
    private Boolean isCodAvailable;

    // Product Descriptions
    @Size(max = 200, message = "Short description cannot exceed 200 characters")
    private String shortDescription;

    @Size(max = 2000, message = "Full description cannot exceed 2000 characters")
    private String detailedDescription;

    private List<String> keyFeatures;

    // Certifications & Compliance
    private List<String> certifications;
    private String hsnCode;
    private BigDecimal gstRate;
    private String fssaiLicense;

    // SEO Optimization
    @Size(max = 60, message = "Meta title cannot exceed 60 characters")
    private String metaTitle;

    @Size(max = 160, message = "Meta description cannot exceed 160 characters")
    private String metaDescription;

    private List<String> keywords;
    private String urlSlug;

    // Product Settings
    @Pattern(regexp = "^(DRAFT|ACTIVE|INACTIVE)$", message = "Invalid status")
    private String status;

    private Boolean featured;
    private Boolean returnable;
    private Boolean codAvailable;

    // Nested DTOs (same as in ProductCreateRequestDto)
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkPricingTier {
        @NotNull(message = "Minimum quantity is required")
        @Min(value = 1, message = "Minimum quantity must be at least 1")
        private Integer minQuantity;

        @NotNull(message = "Discount type is required")
        @Pattern(regexp = "^(percentage|fixed_amount|fixed_price)$", message = "Invalid discount type")
        private String discountType;

        @NotNull(message = "Discount value is required")
        @DecimalMin(value = "0.0", message = "Discount value cannot be negative")
        private BigDecimal discountValue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductDimensions {
        private BigDecimal length;
        private BigDecimal width;
        private BigDecimal height;
        private String unit = "cm";
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductVariantDto {
        private String variantName;
        private Map<String, String> attributes; // e.g., {"size": "1kg", "color": "red"}
        private BigDecimal price;
        private Integer stockQuantity;
        private String sku;
        private Boolean isDefault = false;
    }
} 