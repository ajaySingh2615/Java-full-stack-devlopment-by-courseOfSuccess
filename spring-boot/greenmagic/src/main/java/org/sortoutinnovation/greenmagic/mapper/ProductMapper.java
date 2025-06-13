package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.ProductCreateRequestDto;
import org.sortoutinnovation.greenmagic.dto.ProductResponseDto;
import org.sortoutinnovation.greenmagic.model.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Mapper utility for Product entity and DTOs
 */
public class ProductMapper {

    public static ProductResponseDto toResponseDto(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponseDto dto = new ProductResponseDto();
        dto.setProductId(product.getProductId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setShortDescription(product.getShortDescription());
        dto.setIngredients(product.getIngredients());
        dto.setBrand(product.getBrand());
        dto.setPrice(product.getPrice());
        dto.setRegularPrice(product.getRegularPrice());
        dto.setQuantity(product.getQuantity());
        dto.setImageUrl(product.getImageUrl());
        dto.setGalleryImages(product.getGalleryImages());
        dto.setRating(product.getRating());
        dto.setReviewCount(product.getReviewCount());
        dto.setTags(product.getTags());
        dto.setFreeShipping(product.getFreeShipping());
        dto.setShippingTime(product.getShippingTime());
        dto.setEcoFriendly(product.getEcoFriendly());
        dto.setEcoFriendlyDetails(product.getEcoFriendlyDetails());
        dto.setIsReturnable(product.getIsReturnable());
        dto.setIsCodAvailable(product.getIsCodAvailable());
        dto.setIsFeatured(product.getIsFeatured());
        dto.setIsBestSeller(product.getIsBestSeller());
        dto.setIsNewArrival(product.getIsNewArrival());
        dto.setStatus(product.getStatus());
        dto.setMetaTitle(product.getMetaTitle());
        dto.setMetaDescription(product.getMetaDescription());
        dto.setCreatedAt(product.getCreatedAt());

        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
        }

        if (product.getCreatedBy() != null) {
            dto.setCreatedByName(product.getCreatedBy().getName());
        }

        return dto;
    }

    public static ProductResponseDto toListItemDto(Product product) {
        if (product == null) {
            return null;
        }

        return new ProductResponseDto(
                product.getProductId(),
                product.getName(),
                product.getSlug(),
                product.getPrice(),
                product.getImageUrl(),
                product.getRating(),
                product.getReviewCount(),
                product.getIsFeatured()
        );
    }

    public static Product toEntity(ProductCreateRequestDto dto, Category category, User createdBy) {
        if (dto == null) {
            return null;
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setDescription(dto.getDescription());
        product.setShortDescription(dto.getShortDescription());
        product.setIngredients(dto.getIngredients());
        product.setShelfLife(dto.getShelfLife());
        product.setStorageInstructions(dto.getStorageInstructions());
        product.setUsageInstructions(dto.getUsageInstructions());
        product.setPrice(dto.getPrice());
        product.setRegularPrice(dto.getRegularPrice());
        product.setCostPrice(dto.getCostPrice());
        product.setQuantity(dto.getQuantity());
        product.setMinStockAlert(dto.getMinStockAlert());
        product.setUnitOfMeasurement(dto.getUnitOfMeasurement());
        product.setPackageSize(dto.getPackageSize());
        product.setCategory(category);
        product.setSubcategoryId(dto.getSubcategoryId());
        product.setBrand(dto.getBrand());
        product.setImageUrl(dto.getImageUrl());
        
        // Convert gallery image URLs to the expected format
        if (dto.getGalleryImageUrls() != null && !dto.getGalleryImageUrls().isEmpty()) {
            List<Object> galleryImages = new ArrayList<>();
            for (String url : dto.getGalleryImageUrls()) {
                galleryImages.add(url);
            }
            product.setGalleryImages(galleryImages);
        }
        
        product.setVideoUrl(dto.getVideoUrl());
        product.setMetaTitle(dto.getMetaTitle());
        product.setMetaDescription(dto.getMetaDescription());
        product.setFreeShipping(dto.getFreeShipping());
        product.setShippingTime(dto.getShippingTime());
        product.setWarrantyPeriod(dto.getWarrantyPeriod());
        product.setEcoFriendly(dto.getEcoFriendly());
        product.setEcoFriendlyDetails(dto.getEcoFriendlyDetails());
        product.setTags(dto.getTags());
        product.setWeightForShipping(dto.getWeightForShipping());
        product.setDimensions(dto.getDimensions());
        product.setDeliveryTimeEstimate(dto.getDeliveryTimeEstimate());
        product.setIsReturnable(dto.getIsReturnable());
        product.setIsCodAvailable(dto.getIsCodAvailable());
        product.setIsFeatured(dto.getIsFeatured());
        product.setIsBestSeller(dto.getIsBestSeller());
        product.setIsNewArrival(dto.getIsNewArrival());
        product.setStatus(dto.getStatus());
        product.setCreatedBy(createdBy);
        product.setIsBranded(dto.getIsBranded());
        product.setIsPackaged(dto.getIsPackaged());

        return product;
    }

    public static void updateEntity(Product product, ProductCreateRequestDto dto, Category category) {
        if (product == null || dto == null) {
            return;
        }

        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setDescription(dto.getDescription());
        product.setShortDescription(dto.getShortDescription());
        product.setIngredients(dto.getIngredients());
        product.setShelfLife(dto.getShelfLife());
        product.setStorageInstructions(dto.getStorageInstructions());
        product.setUsageInstructions(dto.getUsageInstructions());
        product.setPrice(dto.getPrice());
        product.setRegularPrice(dto.getRegularPrice());
        product.setCostPrice(dto.getCostPrice());
        product.setQuantity(dto.getQuantity());
        product.setMinStockAlert(dto.getMinStockAlert());
        product.setUnitOfMeasurement(dto.getUnitOfMeasurement());
        product.setPackageSize(dto.getPackageSize());
        product.setCategory(category);
        product.setSubcategoryId(dto.getSubcategoryId());
        product.setBrand(dto.getBrand());
        product.setImageUrl(dto.getImageUrl());
        
        // Convert gallery image URLs
        if (dto.getGalleryImageUrls() != null && !dto.getGalleryImageUrls().isEmpty()) {
            List<Object> galleryImages = new ArrayList<>();
            for (String url : dto.getGalleryImageUrls()) {
                galleryImages.add(url);
            }
            product.setGalleryImages(galleryImages);
        }
        
        product.setVideoUrl(dto.getVideoUrl());
        product.setMetaTitle(dto.getMetaTitle());
        product.setMetaDescription(dto.getMetaDescription());
        product.setFreeShipping(dto.getFreeShipping());
        product.setShippingTime(dto.getShippingTime());
        product.setWarrantyPeriod(dto.getWarrantyPeriod());
        product.setEcoFriendly(dto.getEcoFriendly());
        product.setEcoFriendlyDetails(dto.getEcoFriendlyDetails());
        product.setTags(dto.getTags());
        product.setWeightForShipping(dto.getWeightForShipping());
        product.setDimensions(dto.getDimensions());
        product.setDeliveryTimeEstimate(dto.getDeliveryTimeEstimate());
        product.setIsReturnable(dto.getIsReturnable());
        product.setIsCodAvailable(dto.getIsCodAvailable());
        product.setIsFeatured(dto.getIsFeatured());
        product.setIsBestSeller(dto.getIsBestSeller());
        product.setIsNewArrival(dto.getIsNewArrival());
        product.setStatus(dto.getStatus());
        product.setIsBranded(dto.getIsBranded());
        product.setIsPackaged(dto.getIsPackaged());
    }
} 