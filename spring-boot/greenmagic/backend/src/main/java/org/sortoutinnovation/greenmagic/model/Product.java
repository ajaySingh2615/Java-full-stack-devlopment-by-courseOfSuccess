package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

/**
 * Entity representing products in the e-commerce system
 * Maps to the 'products' table in the database
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_products_slug", columnList = "slug"),
    @Index(name = "idx_products_subcategory", columnList = "subcategory_id"),
    @Index(name = "idx_products_barcode", columnList = "barcode")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Size(max = 50, message = "SKU must not exceed 50 characters")
    @Column(name = "sku", length = 50)
    private String sku;

    @Size(max = 50, message = "Barcode must not exceed 50 characters")
    @Column(name = "barcode", length = 50)
    private String barcode;

    @Size(max = 100, message = "Product name must not exceed 100 characters")
    @Column(name = "name", length = 100)
    private String name;

    @Size(max = 100, message = "Slug must not exceed 100 characters")
    @Column(name = "slug", length = 100)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Size(max = 255, message = "Short description must not exceed 255 characters")
    @Column(name = "short_description", length = 255)
    private String shortDescription;

    @Column(name = "ingredients", columnDefinition = "TEXT")
    private String ingredients;

    @Size(max = 50, message = "Shelf life must not exceed 50 characters")
    @Column(name = "shelf_life", length = 50)
    private String shelfLife;

    @Column(name = "storage_instructions", columnDefinition = "TEXT")
    private String storageInstructions;

    @Column(name = "usage_instructions", columnDefinition = "TEXT")
    private String usageInstructions;

    @DecimalMin(value = "0.00", message = "Price must be greater than or equal to 0")
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Regular price must be greater than or equal to 0")
    @Column(name = "regular_price", precision = 10, scale = 2)
    private BigDecimal regularPrice;

    @DecimalMin(value = "0.00", message = "Cost price must be greater than or equal to 0")
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    @Column(name = "quantity")
    private Integer quantity;

    @Min(value = 0, message = "Min stock alert must be greater than or equal to 0")
    @Column(name = "min_stock_alert")
    private Integer minStockAlert;

    @Size(max = 20, message = "Unit of measurement must not exceed 20 characters")
    @Column(name = "unit_of_measurement", length = 20)
    private String unitOfMeasurement;

    @Size(max = 50, message = "Package size must not exceed 50 characters")
    @Column(name = "package_size", length = 50)
    private String packageSize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Category category;

    @Column(name = "subcategory_id")
    private Integer subcategoryId;

    @Size(max = 100, message = "Brand must not exceed 100 characters")
    @Column(name = "brand", length = 100)
    private String brand;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "gallery_images", columnDefinition = "JSON")
    private List<Object> galleryImages;

    @Size(max = 255, message = "Video URL must not exceed 255 characters")
    @Column(name = "video_url", length = 255)
    private String videoUrl;

    @Size(max = 100, message = "Meta title must not exceed 100 characters")
    @Column(name = "meta_title", length = 100)
    private String metaTitle;

    @Size(max = 255, message = "Meta description must not exceed 255 characters")
    @Column(name = "meta_description", length = 255)
    private String metaDescription;

    @Column(name = "free_shipping")
    private Boolean freeShipping = false;

    @Size(max = 50, message = "Shipping time must not exceed 50 characters")
    @Column(name = "shipping_time", length = 50)
    private String shippingTime = "3-5 business days";

    @Column(name = "warranty_period")
    private Integer warrantyPeriod;

    @Column(name = "eco_friendly")
    private Boolean ecoFriendly = true;

    @Size(max = 255, message = "Eco friendly details must not exceed 255 characters")
    @Column(name = "eco_friendly_details", length = 255)
    private String ecoFriendlyDetails = "Eco-friendly packaging";

    @DecimalMin(value = "0.0", message = "Rating must be greater than or equal to 0")
    @DecimalMax(value = "5.0", message = "Rating must be less than or equal to 5")
    @Column(name = "rating", precision = 2, scale = 1)
    private BigDecimal rating = BigDecimal.valueOf(0.0);

    @Min(value = 0, message = "Review count must be greater than or equal to 0")
    @Column(name = "review_count")
    private Integer reviewCount = 0;

    @Size(max = 255, message = "Tags must not exceed 255 characters")
    @Column(name = "tags", length = 255)
    private String tags;

    @DecimalMin(value = "0.00", message = "Weight for shipping must be greater than or equal to 0")
    @Column(name = "weight_for_shipping", precision = 10, scale = 2)
    private BigDecimal weightForShipping;

    @Size(max = 50, message = "Dimensions must not exceed 50 characters")
    @Column(name = "dimensions", length = 50)
    private String dimensions;

    @Size(max = 50, message = "Delivery time estimate must not exceed 50 characters")
    @Column(name = "delivery_time_estimate", length = 50)
    private String deliveryTimeEstimate;

    @Column(name = "is_returnable")
    private Boolean isReturnable = true;

    @Column(name = "is_cod_available")
    private Boolean isCodAvailable = true;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_best_seller")
    private Boolean isBestSeller = false;

    @Column(name = "is_new_arrival")
    private Boolean isNewArrival = false;

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

    @Column(name = "is_branded")
    private Boolean isBranded = false;

    @Column(name = "is_packaged")
    private Boolean isPackaged = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "custom_gst_rate_id", referencedColumnName = "rate_id")
    private GstRate customGstRate;

    // Relationships
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Review> reviews;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Wishlist> wishlistItems;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<CartItem> cartItems;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OrderItem> orderItems;

    public enum ProductStatus {
        ACTIVE, INACTIVE, DRAFT
    }

    // Constructor for basic product creation
    public Product(String name, String description, BigDecimal price, Category category, User createdBy) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.createdBy = createdBy;
    }
} 