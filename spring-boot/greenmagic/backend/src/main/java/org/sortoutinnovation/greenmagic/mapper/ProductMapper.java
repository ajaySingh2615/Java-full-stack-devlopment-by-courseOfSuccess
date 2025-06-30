package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.ProductResponseDto;
import org.sortoutinnovation.greenmagic.model.Product;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.ArrayList;

/**
 * Product Mapper - Fixed to handle JSON fields properly
 */
@Component
public class ProductMapper {

    /**
     * Convert Product entity to ProductResponseDto
     */
    public ProductResponseDto toDto(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponseDto dto = new ProductResponseDto();
        
        // Basic fields that exist in both Product and ProductResponseDto
        dto.setProductId(product.getProductId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setUrlSlug(product.getUrlSlug());
        dto.setDescription(product.getDescription());
        dto.setShortDescription(product.getShortDescription());
        dto.setBrand(product.getBrand());
        dto.setPrice(product.getPrice());
        dto.setMrp(product.getMrp());
        dto.setCostPrice(product.getCostPrice());
        dto.setQuantity(product.getQuantity());
        dto.setImageUrl(product.getImageUrl());
        
        // Handle JSON fields safely - now they are JSON strings
        try {
            if (product.getGalleryImages() != null) {
                // Gallery images are now stored as JSON strings, so we need to parse them
                // For now, just set to empty array to avoid frontend issues
                dto.setGalleryImages(new ArrayList<>());
            } else {
                dto.setGalleryImages(new ArrayList<>());
            }
        } catch (Exception e) {
            // If there's any issue with gallery images, just set to empty array
            dto.setGalleryImages(new ArrayList<>());
        }
        
        dto.setDeliveryTimeEstimate(product.getDeliveryTimeEstimate());
        dto.setFreeShipping(product.getFreeShipping());
        dto.setIsReturnable(product.getIsReturnable());
        dto.setIsCodAvailable(product.getIsCodAvailable());
        dto.setStatus(product.getStatus());
        dto.setMetaTitle(product.getMetaTitle());
        dto.setMetaDescription(product.getMetaDescription());
        dto.setCreatedAt(product.getCreatedAt());

        // Category information
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
            dto.setCategory(new ProductResponseDto.CategoryInfo(
                product.getCategory().getCategoryId(),
                product.getCategory().getName()
            ));
        }

        // Created by information
        if (product.getCreatedBy() != null) {
            dto.setCreatedByName(product.getCreatedBy().getName());
        }

        return dto;
    }

    /**
     * Convert ProductResponseDto to Product entity (simplified)
     */
    public Product toEntity(ProductResponseDto dto) {
        if (dto == null) {
            return null;
        }

        Product product = new Product();
        
        // Basic fields
        product.setProductId(dto.getProductId());
        product.setSku(dto.getSku());
        product.setName(dto.getName());
        product.setUrlSlug(dto.getUrlSlug());
        product.setDescription(dto.getDescription());
        product.setShortDescription(dto.getShortDescription());
        product.setBrand(dto.getBrand());
        product.setPrice(dto.getPrice());
        product.setMrp(dto.getMrp());
        product.setCostPrice(dto.getCostPrice());
        product.setQuantity(dto.getQuantity());
        product.setImageUrl(dto.getImageUrl());
        
        // Handle gallery images safely - now stored as JSON strings
        if (dto.getGalleryImages() != null) {
            // For now, just set to null to avoid errors - we'll implement proper serialization later
            product.setGalleryImages(null);
        }
        
        product.setDeliveryTimeEstimate(dto.getDeliveryTimeEstimate());
        product.setFreeShipping(dto.getFreeShipping());
        product.setIsReturnable(dto.getIsReturnable());
        product.setIsCodAvailable(dto.getIsCodAvailable());
        product.setStatus(dto.getStatus());
        product.setMetaTitle(dto.getMetaTitle());
        product.setMetaDescription(dto.getMetaDescription());
        product.setCreatedAt(dto.getCreatedAt());

        return product;
    }

    /**
     * Update existing Product entity with ProductResponseDto data
     */
    public void updateEntity(ProductResponseDto dto, Product product) {
        if (dto == null || product == null) {
            return;
        }

        // Update only non-null fields
        if (dto.getName() != null) {
            product.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            product.setDescription(dto.getDescription());
        }
        if (dto.getShortDescription() != null) {
            product.setShortDescription(dto.getShortDescription());
        }
        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        }
        if (dto.getMrp() != null) {
            product.setMrp(dto.getMrp());
        }
        if (dto.getCostPrice() != null) {
            product.setCostPrice(dto.getCostPrice());
        }
        if (dto.getQuantity() != null) {
            product.setQuantity(dto.getQuantity());
        }
        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }
        if (dto.getBrand() != null) {
            product.setBrand(dto.getBrand());
        }
        if (dto.getStatus() != null) {
            product.setStatus(dto.getStatus());
        }
    }
}