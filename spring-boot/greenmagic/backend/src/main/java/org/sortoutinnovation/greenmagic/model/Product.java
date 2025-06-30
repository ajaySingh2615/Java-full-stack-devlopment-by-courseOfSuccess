package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Entity representing products in the e-commerce system
 * Cleaned up to match product-form-structure.json specification
 * Maps to the 'products' table in the database
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_url_slug", columnList = "url_slug"),
    @Index(name = "idx_products_subcategory", columnList = "subcategory_id"),
    @Index(name = "idx_products_sku", columnList = "sku")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    // ===========================
    // BASIC INFORMATION (from product-form-structure.json)
    // ===========================

    @NotBlank(message = "Product title is required")
    @Size(min = 10, max = 100, message = "Product name must be between 10 and 100 characters")
    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Size(max = 50, message = "SKU must not exceed 50 characters")
    @Column(name = "sku", length = 50, unique = true)
    private String sku;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Category category;

    @Column(name = "subcategory_id")
    private Integer subcategoryId;

    @NotBlank(message = "Brand name is required")
    @Size(max = 100, message = "Brand must not exceed 100 characters")
    @Column(name = "brand", length = 100)
    private String brand;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type")
    private ProductType productType = ProductType.SIMPLE;

    // ===========================
    // PRICING STRATEGY
    // ===========================

    @NotNull(message = "MRP is required")
    @DecimalMin(value = "0.01", message = "MRP must be greater than 0")
    @Column(name = "mrp", precision = 10, scale = 2, nullable = false)
    private BigDecimal mrp;

    @NotNull(message = "Selling price is required")
    @DecimalMin(value = "0.01", message = "Selling price must be greater than 0")
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Cost price must be greater than or equal to 0")
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "offer_start_date")
    private LocalDateTime offerStartDate;

    @Column(name = "offer_end_date")
    private LocalDateTime offerEndDate;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "bulk_pricing_tiers", columnDefinition = "JSON")
    private String bulkPricingTiers;

    // ===========================
    // INVENTORY MANAGEMENT
    // ===========================

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotBlank(message = "Unit of measurement is required")
    @Size(max = 20, message = "Unit of measurement must not exceed 20 characters")
    @Column(name = "unit_of_measurement", length = 20, nullable = false)
    private String unitOfMeasurement;

    @Min(value = 1, message = "Minimum order quantity must be at least 1")
    @Column(name = "minimum_order_quantity")
    private Integer minimumOrderQuantity = 1;

    @Column(name = "maximum_order_quantity")
    private Integer maximumOrderQuantity;

    @Min(value = 1, message = "Low stock alert must be at least 1")
    @Column(name = "min_stock_alert")
    private Integer minStockAlert = 10;

    @Column(name = "track_quantity")
    private Boolean trackQuantity = true;

    @Column(name = "restock_date")
    private LocalDate restockDate;

    // ===========================
    // MEDIA GALLERY
    // ===========================

    @NotBlank(message = "Main product image is required")
    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    @Column(name = "image_url", length = 255, nullable = false)
    private String imageUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "gallery_images", columnDefinition = "JSON")
    private String galleryImages;

    @Size(max = 255, message = "Video URL must not exceed 255 characters")
    @Column(name = "video_url", length = 255)
    private String videoUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "image_alt_tags", columnDefinition = "JSON")
    private List<String> imageAltTags;

    // ===========================
    // SHIPPING & LOGISTICS
    // ===========================

    @NotNull(message = "Shipping weight is required")
    @DecimalMin(value = "0.01", message = "Weight for shipping must be greater than 0")
    @Column(name = "weight_for_shipping", precision = 10, scale = 2, nullable = false)
    private BigDecimal weightForShipping;

    @Size(max = 50, message = "Dimensions must not exceed 50 characters")
    @Column(name = "dimensions", length = 50)
    private String dimensions;

    @NotBlank(message = "Delivery time is required")
    @Size(max = 50, message = "Delivery time estimate must not exceed 50 characters")
    @Column(name = "delivery_time_estimate", length = 50, nullable = false)
    private String deliveryTimeEstimate;

    @Enumerated(EnumType.STRING)
    @Column(name = "shipping_class")
    private ShippingClass shippingClass = ShippingClass.STANDARD;

    @Column(name = "cold_storage_required")
    private Boolean coldStorageRequired = false;

    @Column(name = "special_packaging")
    private Boolean specialPackaging = false;

    @Column(name = "insurance_required")
    private Boolean insuranceRequired = false;

    @Column(name = "free_shipping")
    private Boolean freeShipping = false;

    @DecimalMin(value = "0.00", message = "Free shipping threshold must be greater than or equal to 0")
    @Column(name = "free_shipping_threshold", precision = 10, scale = 2)
    private BigDecimal freeShippingThreshold;

    @Column(name = "is_returnable")
    private Boolean isReturnable = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "return_window")
    private ReturnWindow returnWindow = ReturnWindow.SEVEN_DAYS;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "return_conditions", columnDefinition = "JSON")
    private List<String> returnConditions;

    @Column(name = "is_cod_available")
    private Boolean isCodAvailable = true;

    // ===========================
    // PRODUCT DESCRIPTIONS
    // ===========================

    @NotBlank(message = "Short description is required")
    @Size(min = 50, max = 300, message = "Short description must be between 50 and 300 characters")
    @Column(name = "short_description", length = 300, nullable = false)
    private String shortDescription;

    @NotBlank(message = "Detailed description is required")
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "key_features", columnDefinition = "JSON")
    private List<String> keyFeatures;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "product_highlights", columnDefinition = "JSON")
    private String productHighlights;

    @Column(name = "ingredients_list", columnDefinition = "TEXT")
    private String ingredientsList;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "nutritional_info", columnDefinition = "JSON")
    private String nutritionalInfo;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "allergen_info", columnDefinition = "JSON")
    private List<String> allergenInfo;

    // ===========================
    // CERTIFICATIONS & COMPLIANCE
    // ===========================

    @Size(max = 14, message = "FSSAI license must be 14 digits")
    @Pattern(regexp = "^[0-9]{14}$", message = "FSSAI license must be 14 digits")
    @Column(name = "fssai_license", length = 14)
    private String fssaiLicense;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "organic_certification", columnDefinition = "JSON")
    private String organicCertification;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "quality_certifications", columnDefinition = "JSON")
    private String qualityCertifications;

    @Size(max = 50, message = "Country of origin must not exceed 50 characters")
    @Column(name = "country_of_origin", length = 50)
    private String countryOfOrigin = "India";

    @Size(max = 50, message = "State of origin must not exceed 50 characters")
    @Column(name = "state_of_origin", length = 50)
    private String stateOfOrigin;

    @Size(max = 100, message = "Farm name must not exceed 100 characters")
    @Column(name = "farm_name", length = 100)
    private String farmName;

    @Enumerated(EnumType.STRING)
    @Column(name = "harvest_season")
    private HarvestSeason harvestSeason;

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "best_before_date")
    private LocalDate bestBeforeDate;

    @Column(name = "shelf_life_days")
    private Integer shelfLifeDays;

    // ===========================
    // SEO OPTIMIZATION
    // ===========================

    @Size(max = 60, message = "Meta title must not exceed 60 characters")
    @Column(name = "meta_title", length = 60)
    private String metaTitle;

    @Size(max = 160, message = "Meta description must not exceed 160 characters")
    @Column(name = "meta_description", length = 160)
    private String metaDescription;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "search_keywords", columnDefinition = "JSON")
    private List<String> searchKeywords;

    @Size(max = 100, message = "URL slug must not exceed 100 characters")
    @Column(name = "url_slug", length = 100, unique = true)
    private String urlSlug;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "structured_data", columnDefinition = "JSON")
    private String structuredData;

    // ===========================
    // SYSTEM FIELDS
    // ===========================

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProductStatus status = ProductStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", referencedColumnName = "user_id")
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hsn_code_id", referencedColumnName = "hsn_id")
    private HsnCode hsnCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_gst_rate_id", referencedColumnName = "rate_id")
    private GstRate customGstRate;

    // ===========================
    // RELATIONSHIPS
    // ===========================

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Wishlist> wishlistItems;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CartItem> cartItems;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OrderItem> orderItems;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductVariant> variants;

    // ===========================
    // ENUMS
    // ===========================

    public enum ProductStatus {
        ACTIVE, INACTIVE, DRAFT
    }

    public enum ProductType {
        SIMPLE, VARIABLE
    }

    public enum ShippingClass {
        STANDARD, FRAGILE, PERISHABLE, LIQUID, OVERSIZED, HAZARDOUS
    }

    public enum ReturnWindow {
        SEVEN_DAYS, FIFTEEN_DAYS, THIRTY_DAYS
    }

    public enum HarvestSeason {
        SPRING, SUMMER, MONSOON, WINTER, YEAR_ROUND
    }

    // ===========================
    // HELPER METHODS
    // ===========================

    /**
     * Calculate discount percentage based on MRP and selling price
     */
    public BigDecimal getDiscountPercentage() {
        if (mrp != null && price != null && mrp.compareTo(BigDecimal.ZERO) > 0) {
            return mrp.subtract(price)
                     .divide(mrp, 4, java.math.RoundingMode.HALF_UP)
                     .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    /**
     * Calculate stock status based on quantity and alert threshold
     */
    public String getStockStatus() {
        if (quantity == null || !trackQuantity) return "UNLIMITED";
        if (quantity <= 0) return "OUT_OF_STOCK";
        if (minStockAlert != null && quantity <= minStockAlert) return "LOW_STOCK";
        return "IN_STOCK";
    }

    /**
     * Check if product is currently in stock
     */
    public Boolean isInStock() {
        return quantity != null && quantity > 0;
    }

    /**
     * Check if product is currently on offer
     */
    public Boolean isOnOffer() {
        LocalDateTime now = LocalDateTime.now();
        return offerStartDate != null && offerEndDate != null &&
               now.isAfter(offerStartDate) && now.isBefore(offerEndDate);
    }

    /**
     * Check if product is a variable product (has variants)
     */
    public Boolean isVariableProduct() {
        return productType == ProductType.VARIABLE;
    }

    // Constructor for basic product creation
    public Product(String name, String description, BigDecimal mrp, BigDecimal price, Category category, User createdBy) {
        this.name = name;
        this.description = description;
        this.mrp = mrp;
        this.price = price;
        this.category = category;
        this.createdBy = createdBy;
    }
} 