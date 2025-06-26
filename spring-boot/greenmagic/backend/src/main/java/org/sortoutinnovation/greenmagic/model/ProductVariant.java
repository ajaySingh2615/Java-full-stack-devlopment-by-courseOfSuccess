package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing product variants in the e-commerce system
 * Maps to the 'product_variants' table in the database
 */
@Entity
@Table(name = "product_variants", indexes = {
    @Index(name = "idx_variants_product_id", columnList = "product_id"),
    @Index(name = "idx_variants_sku", columnList = "variant_sku"),
    @Index(name = "idx_variants_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Long variantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", referencedColumnName = "product_id", nullable = false)
    private Product product;

    @Size(max = 100, message = "Variant SKU must not exceed 100 characters")
    @Column(name = "variant_sku", length = 100, unique = true)
    private String variantSku;

    @Size(max = 200, message = "Variant name must not exceed 200 characters")
    @Column(name = "variant_name", length = 200)
    private String variantName;

    // Variant Attributes
    @Size(max = 50, message = "Size must not exceed 50 characters")
    @Column(name = "size", length = 50)
    private String size;

    @Size(max = 50, message = "Color must not exceed 50 characters")
    @Column(name = "color", length = 50)
    private String color;

    @Size(max = 50, message = "Weight must not exceed 50 characters")
    @Column(name = "weight", length = 50)
    private String weight;

    @Size(max = 50, message = "Flavor must not exceed 50 characters")
    @Column(name = "flavor", length = 50)
    private String flavor;

    @Size(max = 50, message = "Pack size must not exceed 50 characters")
    @Column(name = "pack_size", length = 50)
    private String packSize;

    // Pricing
    @DecimalMin(value = "0.00", message = "Price must be greater than or equal to 0")
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Regular price must be greater than or equal to 0")
    @Column(name = "regular_price", precision = 10, scale = 2)
    private BigDecimal regularPrice;

    @DecimalMin(value = "0.00", message = "Cost price must be greater than or equal to 0")
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;

    // Inventory
    @Min(value = 0, message = "Stock quantity must be greater than or equal to 0")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    @Min(value = 0, message = "Min stock alert must be greater than or equal to 0")
    @Column(name = "min_stock_alert")
    private Integer minStockAlert = 5;

    @Column(name = "track_inventory")
    private Boolean trackInventory = true;

    @Column(name = "allow_backorders")
    private Boolean allowBackorders = false;

    // Images and Media
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // Physical Properties
    @DecimalMin(value = "0.00", message = "Weight must be greater than or equal to 0")
    @Column(name = "weight_grams", precision = 10, scale = 2)
    private BigDecimal weightGrams;

    @Size(max = 100, message = "Dimensions must not exceed 100 characters")
    @Column(name = "dimensions", length = 100)
    private String dimensions;

    // Status and Availability
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VariantStatus status = VariantStatus.ACTIVE;

    @Column(name = "is_default")
    private Boolean isDefault = false;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    // Metadata
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum VariantStatus {
        ACTIVE, INACTIVE, OUT_OF_STOCK
    }

    // Helper methods
    public boolean isInStock() {
        return this.stockQuantity != null && this.stockQuantity > 0;
    }

    public boolean isLowStock() {
        return this.stockQuantity != null && this.minStockAlert != null && 
               this.stockQuantity <= this.minStockAlert;
    }

    public String getDisplayName() {
        if (variantName != null && !variantName.trim().isEmpty()) {
            return variantName;
        }
        
        StringBuilder displayName = new StringBuilder();
        if (size != null) displayName.append(size).append(" ");
        if (color != null) displayName.append(color).append(" ");
        if (weight != null) displayName.append(weight).append(" ");
        if (flavor != null) displayName.append(flavor).append(" ");
        if (packSize != null) displayName.append(packSize).append(" ");
        
        return displayName.toString().trim();
    }

    public BigDecimal getDiscountAmount() {
        if (regularPrice != null && price != null) {
            return regularPrice.subtract(price);
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getDiscountPercentage() {
        if (regularPrice != null && price != null && regularPrice.compareTo(BigDecimal.ZERO) > 0) {
            return getDiscountAmount()
                .divide(regularPrice, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }
} 