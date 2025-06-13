package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
     * Check if category exists by name
     * @param name the category name
     * @return boolean
     */
    boolean existsByName(String name);
} 