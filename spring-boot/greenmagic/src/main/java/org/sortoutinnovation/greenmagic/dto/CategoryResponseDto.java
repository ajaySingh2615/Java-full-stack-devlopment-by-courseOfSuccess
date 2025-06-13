package org.sortoutinnovation.greenmagic.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for category response data
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponseDto {

    private Integer categoryId;
    private String name;
    private Boolean isActive;
    private Integer productCount;

    // Constructor for basic category info
    public CategoryResponseDto(Integer categoryId, String name) {
        this.categoryId = categoryId;
        this.name = name;
        this.isActive = true;
    }

    // Constructor with product count
    public CategoryResponseDto(Integer categoryId, String name, Integer productCount) {
        this.categoryId = categoryId;
        this.name = name;
        this.productCount = productCount;
        this.isActive = true;
    }
} 