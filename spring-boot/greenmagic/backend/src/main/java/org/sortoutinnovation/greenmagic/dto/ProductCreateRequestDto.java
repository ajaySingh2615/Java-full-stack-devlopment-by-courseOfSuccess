package org.sortoutinnovation.greenmagic.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sortoutinnovation.greenmagic.model.Product;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Comprehensive DTO for creating new products via vendor dashboard
 * Based on product-form-structure.json specifications
 * Maps to all 9 sections of the product form
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequestDto {

    // ===========================
    // BASIC INFORMATION (Section 1)
    // ===========================
    
    @NotBlank(message = "Product title is required")
    @Size(min = 10, max = 100, message = "Product title must be between 10 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\\s\\-\\.\\(\\)\\–\\—\\&\\,\\'\\'\\\"\\:]+$", message = "Product title contains invalid characters")
    private String productTitle;

    @NotNull(message = "Category is required")
    private Integer categoryId;

    private Integer subcategoryId;

    @NotBlank(message = "Brand name is required")
    @Size(max = 50, message = "Brand name cannot exceed 50 characters")
    private String brandName;

    private String customBrandName;

    @Pattern(regexp = "^GM[A-Z0-9]{2}[0-9]{3}[0-9]{4}$|^$", message = "Invalid SKU format. Use format: GM[XX][000][0000] or leave empty for auto-generation")
    private String skuCode;

    @NotNull(message = "Product type is required")
    @Pattern(regexp = "^(SIMPLE|VARIABLE)$", message = "Product type must be 'SIMPLE' or 'VARIABLE'")
    private String productType = "SIMPLE";

    // ===========================
    // PRICING STRATEGY (Section 2)
    // ===========================
    
    @NotNull(message = "MRP is required")
    @DecimalMin(value = "1.0", message = "MRP must be at least ₹1")
    @DecimalMax(value = "100000.0", message = "MRP cannot exceed ₹100,000")
    private BigDecimal mrp;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Selling price must be greater than 0")
    private BigDecimal sellingPrice;

    @DecimalMin(value = "0.0", message = "Cost price cannot be negative")
    private BigDecimal costPrice;

    private LocalDateTime offerStartDate;
    private LocalDateTime offerEndDate;

    @JsonProperty("bulkPricingTiers")
    private List<BulkPricingTier> bulkPricingTiers;

    // ===========================
    // INVENTORY MANAGEMENT (Section 3)
    // ===========================
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    @Max(value = 10000, message = "Stock quantity cannot exceed 10,000")
    private Integer stockQuantity;

    @NotBlank(message = "Unit of measurement is required")
    private String unitOfMeasurement;

    @Min(value = 1, message = "Minimum order quantity must be at least 1")
    private Integer minimumOrderQuantity = 1;

    private Integer maximumOrderQuantity;

    @Min(value = 1, message = "Low stock alert must be at least 1")
    private Integer lowStockAlert = 10;

    private Boolean trackQuantity = true;

    private LocalDate restockDate;

    // ===========================
    // PRODUCT VARIANTS (Section 4)
    // ===========================
    
    private Boolean hasVariants = false;
    private List<VariantAttribute> variantAttributes;
    private List<ProductVariantDto> variants;

    // ===========================
    // MEDIA GALLERY (Section 5)
    // ===========================
    
    @NotBlank(message = "Main product image is required")
    private String mainImageUrl;

    private List<String> galleryImages;
    
    private String videoUrl;
    
    private List<String> imageAltTags;

    // ===========================
    // SHIPPING & LOGISTICS (Section 6)
    // ===========================
    
    @NotNull(message = "Shipping weight is required")
    @DecimalMin(value = "0.01", message = "Weight for shipping must be greater than 0")
    @DecimalMax(value = "50.0", message = "Weight cannot exceed 50kg")
    private BigDecimal weightForShipping;

    private ProductDimensions dimensions;

    @NotBlank(message = "Delivery time is required")
    private String deliveryTimeEstimate = "3-5_days";

    @Pattern(regexp = "^(STANDARD|FRAGILE|PERISHABLE|LIQUID|OVERSIZED|HAZARDOUS)$")
    private String shippingClass = "STANDARD";

    private Boolean coldStorageRequired = false;
    private Boolean specialPackaging = false;
    private Boolean insuranceRequired = false;
    private Boolean freeShipping = false;
    private BigDecimal freeShippingThreshold;
    private Boolean isReturnable = true;
    
    @Pattern(regexp = "^(SEVEN_DAYS|FIFTEEN_DAYS|THIRTY_DAYS)$")
    private String returnWindow = "SEVEN_DAYS";
    
    private List<String> returnConditions;
    private Boolean isCodAvailable = true;

    // ===========================
    // PRODUCT DESCRIPTIONS (Section 7)
    // ===========================
    
    @NotBlank(message = "Short description is required")
    @Size(min = 50, max = 300, message = "Short description must be between 50 and 300 characters")
    private String shortDescription;

    @NotBlank(message = "Detailed description is required")
    @Size(min = 200, max = 5000, message = "Detailed description must be between 200 and 5000 characters")
    private String detailedDescription;

    private List<String> keyFeatures;
    
    @JsonProperty("productHighlights")
    private List<ProductHighlight> productHighlights;
    
    private String ingredientsList;
    
    @JsonProperty("nutritionalInfo")
    private NutritionalInfo nutritionalInfo;
    
    private List<String> allergenInfo;

    // ===========================
    // CERTIFICATIONS & COMPLIANCE (Section 8)
    // ===========================
    
    @Size(max = 14, message = "FSSAI license must be 14 digits")
    @Pattern(regexp = "^[0-9]{14}$", message = "FSSAI license must be 14 digits")
    private String fssaiLicense;

    @JsonProperty("organicCertification")
    private OrganicCertification organicCertification;
    
    @JsonProperty("qualityCertifications")
    private List<QualityCertification> qualityCertifications;
    
    private String countryOfOrigin = "India";
    private String stateOfOrigin;
    private String farmName;
    
    @Pattern(regexp = "^(SPRING|SUMMER|MONSOON|WINTER|YEAR_ROUND)$")
    private String harvestSeason;
    
    private LocalDate manufacturingDate;
    private LocalDate expiryDate;
    private LocalDate bestBeforeDate;
    private Integer shelfLifeDays;

    // ===========================
    // SEO OPTIMIZATION (Section 9)
    // ===========================
    
    @Size(max = 60, message = "Meta title cannot exceed 60 characters")
    private String metaTitle;

    @Size(max = 160, message = "Meta description cannot exceed 160 characters")
    private String metaDescription;

    private List<String> searchKeywords;
    
    @Size(max = 100, message = "URL slug cannot exceed 100 characters")
    private String urlSlug;

    private Object structuredData;

    // ===========================
    // SYSTEM FIELDS
    // ===========================
    
    @Pattern(regexp = "^(DRAFT|ACTIVE|INACTIVE)$", message = "Invalid status")
    private String status = "DRAFT";

    // ===========================
    // NESTED DTOs
    // ===========================
    
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
    public static class VariantAttribute {
        private String name; // weight, packaging, quality_grade, flavor
        private String label;
        private List<String> options;
        private Boolean allowCustom = false;
        private String priceModifierType; // percentage_or_fixed, percentage, currency
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
        private Boolean enabled = true;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductHighlight {
        private String icon;
        private String title;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutritionalInfo {
        private String servingSize;
        private Map<String, NutrientValue> nutrients; // energy, protein, carbs, fat, etc
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NutrientValue {
        private BigDecimal value;
        private String unit; // kcal, g, mg
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrganicCertification {
        private String certificateNumber;
        private String issuingAuthority; // india_organic, usda_organic, eu_organic, etc
        private LocalDate issueDate;
        private LocalDate expiryDate;
        private String certificateFileUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QualityCertification {
        private String type; // iso_22000, haccp, gmp, halal, etc
        private String certificateNumber;
        private LocalDate issueDate;
        private LocalDate expiryDate;
        private String certificateFileUrl;
    }
} 