package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Category entity operations
 * Provides CRUD operations and custom queries for category management
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Find category by name
     * @param name the category name
     * @return Optional<Category>
     */
    Optional<Category> findByName(String name);
    
    /**
     * Find category by slug
     * @param slug the category slug
     * @return Optional<Category>
     */
    Optional<Category> findBySlug(String slug);
    
    /**
     * Check if category exists by name
     * @param name the category name
     * @return boolean
     */
    boolean existsByName(String name);
    
    /**
     * Check if category exists by slug
     * @param slug the category slug
     * @return boolean
     */
    boolean existsBySlug(String slug);
    
    /**
     * Find all active categories
     * @return List<Category>
     */
    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.name")
    List<Category> findAllActiveCategories();
    
    /**
     * Find top-level categories (no parent)
     * @return List<Category>
     */
    @Query("SELECT c FROM Category c WHERE c.parentCategory IS NULL AND c.isActive = true ORDER BY c.name")
    List<Category> findTopLevelCategories();
    
    /**
     * Find subcategories by parent category
     * @param parentId the parent category ID
     * @return List<Category>
     */
    @Query("SELECT c FROM Category c WHERE c.parentCategory.id = :parentId AND c.isActive = true ORDER BY c.name")
    List<Category> findSubcategoriesByParentId(@Param("parentId") Long parentId);
    
    /**
     * Find categories by name containing (case insensitive)
     * @param name the name to search
     * @return List<Category>
     */
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY c.name")
    List<Category> findByNameContaining(@Param("name") String name);
} 