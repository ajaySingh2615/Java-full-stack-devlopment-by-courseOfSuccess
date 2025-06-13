package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findBySku(String sku);
    Optional<Product> findBySlug(String slug);
    boolean existsBySku(String sku);
    boolean existsBySlug(String slug);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true ORDER BY p.createdAt DESC")
    Page<Product> findAllActiveProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.isActive = true ORDER BY p.name")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.name")
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.sellingPrice BETWEEN :minPrice AND :maxPrice ORDER BY p.sellingPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.isFeatured = true ORDER BY p.createdAt DESC")
    Page<Product> findFeaturedProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.isOnSale = true ORDER BY p.discountPercentage DESC")
    Page<Product> findProductsOnSale(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > 0 ORDER BY p.name")
    Page<Product> findProductsInStock(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity = 0 ORDER BY p.name")
    List<Product> findOutOfStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.stockQuantity > 0 AND p.stockQuantity <= :threshold ORDER BY p.stockQuantity")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND LOWER(p.brand) = LOWER(:brand) ORDER BY p.name")
    Page<Product> findByBrand(@Param("brand") String brand, Pageable pageable);
} 