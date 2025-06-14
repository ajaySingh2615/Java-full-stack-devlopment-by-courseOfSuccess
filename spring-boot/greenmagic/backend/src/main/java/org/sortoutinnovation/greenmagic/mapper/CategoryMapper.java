package org.sortoutinnovation.greenmagic.mapper;

import org.sortoutinnovation.greenmagic.dto.CategoryResponseDto;
import org.sortoutinnovation.greenmagic.model.Category;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for Category entity and DTOs
 */
public class CategoryMapper {

    public static CategoryResponseDto toResponseDto(Category category) {
        if (category == null) {
            return null;
        }

        CategoryResponseDto dto = new CategoryResponseDto();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setIsActive(true); // Default value since Category entity doesn't have this field
        
        return dto;
    }

    public static CategoryResponseDto toResponseDtoWithProductCount(Category category, Integer productCount) {
        CategoryResponseDto dto = toResponseDto(category);
        if (dto != null) {
            dto.setProductCount(productCount);
        }
        return dto;
    }

    public static List<CategoryResponseDto> toResponseDtoList(List<Category> categories) {
        if (categories == null) {
            return null;
        }
        
        return categories.stream()
                .map(CategoryMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public static Category toEntity(CategoryResponseDto dto) {
        if (dto == null) {
            return null;
        }

        Category category = new Category();
        category.setCategoryId(dto.getCategoryId());
        category.setName(dto.getName());
        
        return category;
    }
} 