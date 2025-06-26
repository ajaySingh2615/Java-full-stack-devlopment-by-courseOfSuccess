package org.sortoutinnovation.greenmagic.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for Product entity
 * Used for API requests and responses with comprehensive product information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Integer productId;

    // Basic Information
    @NotBlank(message = "Product title is required")
    @Size(min = 10, max = 100, message = "Product title must be between 10 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-\\.\\(\\)]+$", message = "Invalid characters in product title")
    private String name;

    @NotNull(message = "Category is required")
    private CategoryDTO category;

    private Integer subcategoryId;

    @NotBlank(message = "Brand name is required")
    @Size(max = 50, message = "Brand name must not exceed 50 characters")
    private String brand;

    @Size(max = 50, message = "SKU must not exceed 50 characters")
    private String sku;

    private String barcode;
    private String slug;

    @NotNull(message = "Product type is required")
    private String productType; // SIMPLE, VARIABLE

    // Pricing Strategy
    @NotNull(message = "MRP is required")
    @DecimalMin(value = "0.01", message = "MRP must be greater than 0")
    @DecimalMax(value = "100000.00", message = "MRP must not exceed 100,000")
    private BigDecimal mrp;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Selling price must be greater than 0")
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Cost price must be greater than or equal to 0")
    private BigDecimal costPrice;

    private BigDecimal regularPrice;
    private LocalDateTime offerStartDate;
    private LocalDateTime offerEndDate;
    private List<BulkPricingTierDTO> bulkPricingTiers;

    // Inventory Management
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    @Max(value = 10000, message = "Stock quantity must not exceed 10,000")
    private Integer quantity;

    @NotBlank(message = "Unit of measurement is required")
    private String unitOfMeasurement;

    @Min(value = 1, message = "Minimum order quantity must be at least 1")
    private Integer minimumOrderQuantity = 1;

    private Integer maximumOrderQuantity;

    @Min(value = 1, message = "Low stock alert must be at least 1")
    private Integer minStockAlert = 10;

    private Boolean trackQuantity = true;
    private LocalDate restockDate;

    // Product Descriptions
    @NotBlank(message = "Short description is required")
    @Size(min = 50, max = 300, message = "Short description must be between 50 and 300 characters")
    private String shortDescription;

    @NotBlank(message = "Detailed description is required")
    @Size(min = 200, max = 5000, message = "Detailed description must be between 200 and 5000 characters")
    private String description;

    private List<String> keyFeatures;
    private List<ProductHighlightDTO> productHighlights;
    private String ingredientsList;
    private NutritionalInfoDTO nutritionalInfo;
    private List<String> allergenInfo;

    // Media Gallery
    @NotBlank(message = "Main product image is required")
    private String imageUrl;

    private List<String> galleryImages;
    private List<String> imageAltTags;
    private String videoUrl;

    // Shipping & Logistics
    @NotNull(message = "Shipping weight is required")
    @DecimalMin(value = "0.01", message = "Shipping weight must be greater than 0")
    @DecimalMax(value = "50.00", message = "Shipping weight must not exceed 50kg")
    private BigDecimal weightForShipping;

    private DimensionsDTO dimensions;

    @NotBlank(message = "Delivery time is required")
    private String deliveryTimeEstimate;

    private String shippingClass = "STANDARD";
    private Boolean coldStorageRequired = false;
    private Boolean specialPackaging = false;
    private Boolean insuranceRequired = false;
    private Boolean freeShipping = false;
    private BigDecimal freeShippingThreshold;
    private Boolean isReturnable = true;
    private String returnWindow = "SEVEN_DAYS";
    private List<String> returnConditions;
    private Boolean isCodAvailable = true;

    // Certifications & Compliance
    @Pattern(regexp = "^[0-9]{14}$", message = "FSSAI license must be 14 digits")
    private String fssaiLicense;

    private OrganicCertificationDTO organicCertification;
    private List<QualityCertificationDTO> qualityCertifications;
    private String countryOfOrigin = "India";
    private String stateOfOrigin;
    private String farmName;
    private String harvestSeason;
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private LocalDate bestBeforeDate;
    private Integer shelfLifeDays;
    private String shelfLife;
    private String storageInstructions;
    private String usageInstructions;

    // SEO Optimization
    @Size(max = 60, message = "Meta title must not exceed 60 characters")
    private String metaTitle;

    @Size(max = 160, message = "Meta description must not exceed 160 characters")
    private String metaDescription;

    private List<String> searchKeywords;
    private String urlSlug;

    // Product Status & Flags
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, DRAFT
    private Boolean ecoFriendly = true;
    private String ecoFriendlyDetails;

    // Additional Properties
    private String tags;

    // Vendor Information
    private Integer vendorId;
    private String vendorName;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Helper DTOs
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulkPricingTierDTO {
        @Min(value = 1, message = "Minimum quantity must be at least 1")
        private Integer minQuantity;

        @NotBlank(message = "Discount type is required")
        private String discountType; // percentage, fixed_amount, fixed_price

        @DecimalMin(value = "0", message = "Discount value must be greater than or equal to 0")
        private BigDecimal discountValue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductHighlightDTO {
        private String icon;
        
        @Size(max = 30, message = "Highlight title must not exceed 30 characters")
        private String title;
        
        @Size(max = 100, message = "Highlight description must not exceed 100 characters")
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutritionalInfoDTO {
        private String servingSize;
        private BigDecimal energy; // kcal
        private BigDecimal protein; // g
        private BigDecimal carbohydrates; // g
        private BigDecimal fat; // g
        private BigDecimal fiber; // g
        private BigDecimal sugar; // g
        private BigDecimal sodium; // mg
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DimensionsDTO {
        @DecimalMin(value = "1", message = "Length must be at least 1 cm")
        private BigDecimal length; // cm
        
        @DecimalMin(value = "1", message = "Width must be at least 1 cm")
        private BigDecimal width; // cm
        
        @DecimalMin(value = "1", message = "Height must be at least 1 cm")
        private BigDecimal height; // cm
        
        private BigDecimal volume; // auto-calculated
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganicCertificationDTO {
        private String certificateFile;
        private String certificateNumber;
        private String issuingAuthority; // india_organic, usda_organic, eu_organic, etc.
        private LocalDate issueDate;
        private LocalDate expiryDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QualityCertificationDTO {
        private String certificationType; // iso_22000, haccp, gmp, halal, etc.
        private String certificateFile;
        private String certificateNumber;
        private LocalDate issueDate;
        private LocalDate expiryDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDTO {
        private Long categoryId;
        private String name;
        private String code;
        private String hsnCode;
        private BigDecimal gstRate;
    }

    // Calculated fields
    public BigDecimal getDiscountPercentage() {
        if (mrp != null && price != null && mrp.compareTo(BigDecimal.ZERO) > 0) {
            return mrp.subtract(price)
                     .divide(mrp, 4, java.math.RoundingMode.HALF_UP)
                     .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public String getStockStatus() {
        if (quantity == null || !trackQuantity) return "UNLIMITED";
        if (quantity <= 0) return "OUT_OF_STOCK";
        if (minStockAlert != null && quantity <= minStockAlert) return "LOW_STOCK";
        return "IN_STOCK";
    }

    public Boolean isInStock() {
        return quantity != null && quantity > 0;
    }

    public Boolean isOnOffer() {
        LocalDateTime now = LocalDateTime.now();
        return offerStartDate != null && offerEndDate != null &&
               now.isAfter(offerStartDate) && now.isBefore(offerEndDate);
    }
} 