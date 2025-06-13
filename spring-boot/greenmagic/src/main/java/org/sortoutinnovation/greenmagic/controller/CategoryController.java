package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
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
    public ResponseEntity<ApiResponseDto<List<Category>>> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllActiveCategories();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve categories: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Category>> getCategoryById(@PathVariable Long id) {
        try {
            Category category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Category found", category));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve category: " + e.getMessage(), null));
        }
    }

    @GetMapping("/top-level")
    public ResponseEntity<ApiResponseDto<List<Category>>> getTopLevelCategories() {
        try {
            List<Category> categories = categoryService.getTopLevelCategories();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Top-level categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve top-level categories: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<Category>> createCategory(@Valid @RequestBody Category category) {
        try {
            Category savedCategory = categoryService.createCategory(category);
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

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<ApiResponseDto<List<Category>>> getSubcategories(@PathVariable Long id) {
        try {
            List<Category> subcategories = categoryService.getSubcategories(id);
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Subcategories retrieved successfully", subcategories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve subcategories: " + e.getMessage(), null));
        }
    }
} 