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
    private String slug;
    private String description;
    private String shortDescription;
    private String ingredients;
    private String brand;
    private BigDecimal price;
    private BigDecimal regularPrice;
    private Integer quantity;
    private String imageUrl;
    private List<Object> galleryImages;
    private BigDecimal rating;
    private Integer reviewCount;
    private String tags;
    private Boolean freeShipping;
    private String shippingTime;
    private Boolean ecoFriendly;
    private String ecoFriendlyDetails;
    private Boolean isReturnable;
    private Boolean isCodAvailable;
    private Boolean isFeatured;
    private Boolean isBestSeller;
    private Boolean isNewArrival;
    private Product.ProductStatus status;
    private String metaTitle;
    private String metaDescription;
    private String categoryName;
    private String createdByName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // Constructor for minimal product info (for listings)
    public ProductResponseDto(Integer productId, String name, String slug, BigDecimal price, String imageUrl, BigDecimal rating, Integer reviewCount, Boolean isFeatured) {
        this.productId = productId;
        this.name = name;
        this.slug = slug;
        this.price = price;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.isFeatured = isFeatured;
    }

    // Constructor for detailed product info
    public ProductResponseDto(Integer productId, String sku, String name, String slug, String description, String shortDescription, 
                             BigDecimal price, BigDecimal regularPrice, Integer quantity, String imageUrl, String brand, 
                             String categoryName, Product.ProductStatus status) {
        this.productId = productId;
        this.sku = sku;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.shortDescription = shortDescription;
        this.price = price;
        this.regularPrice = regularPrice;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.categoryName = categoryName;
        this.status = status;
    }
} 