package org.sortoutinnovation.greenmagic.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sortoutinnovation.greenmagic.model.Product;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO for product creation requests
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequestDto {

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String name;

    @Size(max = 100, message = "Slug must not exceed 100 characters")
    private String slug;

    @NotBlank(message = "Product description is required")
    private String description;

    @Size(max = 255, message = "Short description must not exceed 255 characters")
    private String shortDescription;

    private String ingredients;

    @Size(max = 50, message = "Shelf life must not exceed 50 characters")
    private String shelfLife;

    private String storageInstructions;

    private String usageInstructions;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Regular price must be greater than or equal to 0")
    private BigDecimal regularPrice;

    @DecimalMin(value = "0.00", message = "Cost price must be greater than or equal to 0")
    private BigDecimal costPrice;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private Integer quantity;

    @Min(value = 0, message = "Min stock alert must be greater than or equal to 0")
    private Integer minStockAlert;

    @Size(max = 20, message = "Unit of measurement must not exceed 20 characters")
    private String unitOfMeasurement;

    @Size(max = 50, message = "Package size must not exceed 50 characters")
    private String packageSize;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    private Integer subcategoryId;

    @Size(max = 100, message = "Brand must not exceed 100 characters")
    private String brand;

    @Size(max = 255, message = "Image URL must not exceed 255 characters")
    private String imageUrl;

    private List<String> galleryImageUrls;

    @Size(max = 255, message = "Video URL must not exceed 255 characters")
    private String videoUrl;

    @Size(max = 100, message = "Meta title must not exceed 100 characters")
    private String metaTitle;

    @Size(max = 255, message = "Meta description must not exceed 255 characters")
    private String metaDescription;

    private Boolean freeShipping = false;

    @Size(max = 50, message = "Shipping time must not exceed 50 characters")
    private String shippingTime = "3-5 business days";

    private Integer warrantyPeriod;

    private Boolean ecoFriendly = true;

    @Size(max = 255, message = "Eco friendly details must not exceed 255 characters")
    private String ecoFriendlyDetails = "Eco-friendly packaging";

    @Size(max = 255, message = "Tags must not exceed 255 characters")
    private String tags;

    @DecimalMin(value = "0.00", message = "Weight for shipping must be greater than or equal to 0")
    private BigDecimal weightForShipping;

    @Size(max = 50, message = "Dimensions must not exceed 50 characters")
    private String dimensions;

    @Size(max = 50, message = "Delivery time estimate must not exceed 50 characters")
    private String deliveryTimeEstimate;

    private Boolean isReturnable = true;

    private Boolean isCodAvailable = true;

    private Boolean isFeatured = false;

    private Boolean isBestSeller = false;

    private Boolean isNewArrival = false;

    private Product.ProductStatus status = Product.ProductStatus.ACTIVE;

    private Integer hsnCodeId;

    private Boolean isBranded = false;

    private Boolean isPackaged = false;

    private Integer customGstRateId;
} 