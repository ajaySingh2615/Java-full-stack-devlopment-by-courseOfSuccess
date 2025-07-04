package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.dto.CategoryResponseDto;
import org.sortoutinnovation.greenmagic.model.Category;
import org.sortoutinnovation.greenmagic.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<CategoryResponseDto>>> getAllCategories() {
        try {
            List<CategoryResponseDto> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve categories: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<CategoryResponseDto>> getCategoryById(@PathVariable Integer id) {
        try {
            CategoryResponseDto category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Category found", category));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve category: " + e.getMessage(), null));
        }
    }

    @GetMapping("/top-level")
    public ResponseEntity<ApiResponseDto<List<CategoryResponseDto>>> getTopLevelCategories() {
        try {
            List<CategoryResponseDto> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve categories: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<CategoryResponseDto>> createCategory(@Valid @RequestBody Category category) {
        try {
            CategoryResponseDto savedCategory = categoryService.createCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Category created successfully", savedCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create category: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto<CategoryResponseDto>> updateCategory(
            @PathVariable Integer id, 
            @Valid @RequestBody Category categoryRequest) {
        try {
            CategoryResponseDto updatedCategory = categoryService.updateCategory(id, categoryRequest);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Category updated successfully", updatedCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to update category: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Void>> deleteCategory(@PathVariable Integer id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Category deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponseDto<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to delete category: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<ApiResponseDto<List<CategoryResponseDto>>> getSubcategories(@PathVariable Integer id) {
        try {
            List<CategoryResponseDto> subcategories = List.of();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "No subcategories found (hierarchy not supported)", subcategories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve subcategories: " + e.getMessage(), null));
        }
    }
} 