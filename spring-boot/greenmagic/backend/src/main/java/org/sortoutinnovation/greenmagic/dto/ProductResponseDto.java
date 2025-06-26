package org.sortoutinnovation.greenmagic.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sortoutinnovation.greenmagic.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for product response data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponseDto {

    private Integer productId;
    private String sku;
    private String name;
    private String urlSlug;
    private String description;
    private String shortDescription;
    private String ingredientsList;
    private String brand;
    private BigDecimal price;
    private BigDecimal mrp;
    private BigDecimal costPrice;
    private Integer quantity;
    private String imageUrl;
    private List<Object> galleryImages;
    private String deliveryTimeEstimate;
    private Boolean freeShipping;
    private Boolean isReturnable;
    private Boolean isCodAvailable;
    private Product.ProductStatus status;
    private String metaTitle;
    private String metaDescription;
    private String categoryName;
    private String createdByName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // Constructor for minimal product info (for listings)
    public ProductResponseDto(Integer productId, String name, String urlSlug, BigDecimal price, String imageUrl) {
        this.productId = productId;
        this.name = name;
        this.urlSlug = urlSlug;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    // Constructor for detailed product info
    public ProductResponseDto(Integer productId, String sku, String name, String urlSlug, String description, String shortDescription, 
                             BigDecimal price, BigDecimal mrp, Integer quantity, String imageUrl, String brand, 
                             String categoryName, Product.ProductStatus status) {
        this.productId = productId;
        this.sku = sku;
        this.name = name;
        this.urlSlug = urlSlug;
        this.description = description;
        this.shortDescription = shortDescription;
        this.price = price;
        this.mrp = mrp;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.categoryName = categoryName;
        this.status = status;
    }
} 