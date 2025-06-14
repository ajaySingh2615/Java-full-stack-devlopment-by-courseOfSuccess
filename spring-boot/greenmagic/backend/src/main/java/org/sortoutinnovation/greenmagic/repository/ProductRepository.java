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
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Page<Product> findAllActiveProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND p.status = 'ACTIVE' ORDER BY p.name")
    Page<Product> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.name")
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.price BETWEEN :minPrice AND :maxPrice ORDER BY p.price")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.isFeatured = true ORDER BY p.createdAt DESC")
    Page<Product> findFeaturedProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.isBestSeller = true ORDER BY p.createdAt DESC")
    Page<Product> findBestSellerProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.quantity > 0 ORDER BY p.name")
    Page<Product> findProductsInStock(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.quantity = 0 ORDER BY p.name")
    List<Product> findOutOfStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.quantity > 0 AND p.quantity <= :threshold ORDER BY p.quantity")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND LOWER(p.brand) = LOWER(:brand) ORDER BY p.name")
    Page<Product> findByBrand(@Param("brand") String brand, Pageable pageable);
} 