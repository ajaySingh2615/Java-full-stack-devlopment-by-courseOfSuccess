package org.sortoutinnovation.greenmagic.service;

import org.sortoutinnovation.greenmagic.dto.CategoryResponseDto;
import org.sortoutinnovation.greenmagic.mapper.CategoryMapper;
import org.sortoutinnovation.greenmagic.model.Category;
import org.sortoutinnovation.greenmagic.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service class for Category business logic
 * Handles category management operations
 */
@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Get all categories
     * @return List<CategoryResponseDto>
     */
    @Transactional(readOnly = true)
    public List<CategoryResponseDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return CategoryMapper.toResponseDtoList(categories);
    }

    /**
     * Get category by ID
     * @param id category ID
     * @return CategoryResponseDto
     * @throws RuntimeException if category not found
     */
    @Transactional(readOnly = true)
    public CategoryResponseDto getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        return CategoryMapper.toResponseDto(category);
    }

    /**
     * Get category entity by ID (for internal use)
     * @param id category ID
     * @return Category
     * @throws RuntimeException if category not found
     */
    @Transactional(readOnly = true)
    public Category getCategoryEntityById(Integer id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    /**
     * Get category by name
     * @param name category name
     * @return CategoryResponseDto
     * @throws RuntimeException if category not found
     */
    @Transactional(readOnly = true)
    public CategoryResponseDto getCategoryByName(String name) {
        Category category = categoryRepository.findByName(name)
            .orElseThrow(() -> new RuntimeException("Category not found with name: " + name));
        return CategoryMapper.toResponseDto(category);
    }

    /**
     * Create a new category
     * @param category category data
     * @return CategoryResponseDto
     * @throws RuntimeException if name already exists
     */
    public CategoryResponseDto createCategory(Category category) {
        // Validate unique name
        if (category.getName() != null && categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category with name already exists: " + category.getName());
        }

        Category savedCategory = categoryRepository.save(category);
        return CategoryMapper.toResponseDto(savedCategory);
    }

    /**
     * Update category
     * @param id category ID
     * @param updatedCategory updated category data
     * @return CategoryResponseDto
     * @throws RuntimeException if category not found or name conflict
     */
    public CategoryResponseDto updateCategory(Integer id, Category updatedCategory) {
        Category existingCategory = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        // Check name uniqueness if being changed
        if (updatedCategory.getName() != null && 
            !existingCategory.getName().equals(updatedCategory.getName()) &&
            categoryRepository.existsByName(updatedCategory.getName())) {
            throw new RuntimeException("Category with name already exists: " + updatedCategory.getName());
        }

        // Update fields
        if (updatedCategory.getName() != null) {
            existingCategory.setName(updatedCategory.getName());
        }

        Category savedCategory = categoryRepository.save(existingCategory);
        return CategoryMapper.toResponseDto(savedCategory);
    }

    /**
     * Delete category
     * @param id category ID
     * @throws RuntimeException if category not found
     */
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    /**
     * Check if category exists by name
     * @param name category name
     * @return boolean
     */
    @Transactional(readOnly = true)
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
} 