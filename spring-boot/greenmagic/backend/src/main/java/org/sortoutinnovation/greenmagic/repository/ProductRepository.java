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
public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    Optional<Product> findBySku(String sku);
    Optional<Product> findByUrlSlug(String urlSlug);
    boolean existsBySku(String sku);
    boolean existsByUrlSlug(String urlSlug);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' ORDER BY p.createdAt DESC")
    Page<Product> findAllActiveProducts(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.category.categoryId = :categoryId AND p.status = 'ACTIVE' ORDER BY p.name")
    Page<Product> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY p.name")
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.price BETWEEN :minPrice AND :maxPrice ORDER BY p.price")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.quantity > 0 ORDER BY p.name")
    Page<Product> findProductsInStock(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.quantity = 0 ORDER BY p.name")
    List<Product> findOutOfStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.quantity > 0 AND p.quantity <= :threshold ORDER BY p.quantity")
    List<Product> findLowStockProducts(@Param("threshold") Integer threshold);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND LOWER(p.brand) = LOWER(:brand) ORDER BY p.name")
    Page<Product> findByBrand(@Param("brand") String brand, Pageable pageable);
    
    // ===========================
    // VENDOR-SPECIFIC METHODS
    // ===========================
    
    /**
     * Find products by vendor (created by user)
     */
    Page<Product> findByCreatedByUserId(Integer vendorId, Pageable pageable);
    
    /**
     * Find products by vendor and status
     */
    Page<Product> findByCreatedByUserIdAndStatus(Integer vendorId, Product.ProductStatus status, Pageable pageable);
    
    /**
     * Count products by vendor
     */
    long countByCreatedByUserId(Integer vendorId);
    
    /**
     * Count products by vendor and status
     */
    long countByCreatedByUserIdAndStatus(Integer vendorId, Product.ProductStatus status);
    
    /**
     * Find products by vendor with search
     */
    @Query("SELECT p FROM Product p WHERE p.createdBy.userId = :vendorId " +
           "AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY p.createdAt DESC")
    Page<Product> findByVendorIdWithSearch(@Param("vendorId") Integer vendorId, 
                                          @Param("search") String search, 
                                          Pageable pageable);
    
    /**
     * Find products by vendor, status and category
     */
    @Query("SELECT p FROM Product p WHERE p.createdBy.userId = :vendorId " +
           "AND (:status IS NULL OR p.status = :status) " +
           "AND (:categoryId IS NULL OR p.category.categoryId = :categoryId) " +
           "ORDER BY p.createdAt DESC")
    Page<Product> findByVendorIdWithFilters(@Param("vendorId") Integer vendorId,
                                           @Param("status") Product.ProductStatus status,
                                           @Param("categoryId") Integer categoryId,
                                           Pageable pageable);
    
    /**
     * Find low stock products by vendor
     */
    @Query("SELECT p FROM Product p WHERE p.createdBy.userId = :vendorId " +
           "AND p.quantity <= p.minStockAlert AND p.status = 'ACTIVE'")
    List<Product> findLowStockProductsByVendor(@Param("vendorId") Integer vendorId);
    
    /**
     * Find out of stock products by vendor
     */
    @Query("SELECT p FROM Product p WHERE p.createdBy.userId = :vendorId " +
           "AND p.quantity = 0 AND p.status = 'ACTIVE'")
    List<Product> findOutOfStockProductsByVendor(@Param("vendorId") Integer vendorId);
    
    /**
     * Get top selling products by vendor
     */
    @Query("SELECT p, COALESCE(SUM(oi.quantity), 0) as totalSold FROM Product p " +
           "LEFT JOIN OrderItem oi ON p.productId = oi.product.productId " +
           "WHERE p.createdBy.userId = :vendorId " +
           "GROUP BY p.productId ORDER BY totalSold DESC")
    List<Object[]> findTopSellingProductsByVendor(@Param("vendorId") Integer vendorId, Pageable pageable);
    
    /**
     * Check if vendor owns product
     */
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.productId = :productId AND p.createdBy.userId = :vendorId")
    boolean isProductOwnedByVendor(@Param("productId") Integer productId, @Param("vendorId") Integer vendorId);
    
    /**
     * Find all products by vendor ID
     */
    @Query("SELECT p FROM Product p WHERE p.createdBy.userId = :vendorId")
    List<Product> findByVendorId(@Param("vendorId") Integer vendorId);
} 