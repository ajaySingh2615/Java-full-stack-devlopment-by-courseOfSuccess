package org.sortoutinnovation.greenmagic.controller;

import org.sortoutinnovation.greenmagic.dto.ApiResponseDto;
import org.sortoutinnovation.greenmagic.model.Category;
import org.sortoutinnovation.greenmagic.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<Category>>> getAllCategories() {
        try {
            List<Category> categories = categoryRepository.findAllActiveCategories();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve categories: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto<Category>> getCategoryById(@PathVariable Long id) {
        try {
            Optional<Category> category = categoryRepository.findById(id);
            if (category.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Category found", category.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve category: " + e.getMessage(), null));
        }
    }

    @GetMapping("/top-level")
    public ResponseEntity<ApiResponseDto<List<Category>>> getTopLevelCategories() {
        try {
            List<Category> categories = categoryRepository.findTopLevelCategories();
            return ResponseEntity.ok(new ApiResponseDto<>(true, "Top-level categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to retrieve top-level categories: " + e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponseDto<Category>> createCategory(@RequestBody Category category) {
        try {
            if (categoryRepository.existsByName(category.getName())) {
                return ResponseEntity.badRequest()
                    .body(new ApiResponseDto<>(false, "Category name already exists", null));
            }
            Category savedCategory = categoryRepository.save(category);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponseDto<>(true, "Category created successfully", savedCategory));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponseDto<>(false, "Failed to create category: " + e.getMessage(), null));
        }
    }
} 