package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.ProductVariant;
import org.sortoutinnovation.greenmagic.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    /**
     * Find all variants for a specific product
     */
    List<ProductVariant> findByProductOrderBySortOrderAsc(Product product);

    /**
     * Find all variants for a specific product with pagination
     */
    Page<ProductVariant> findByProduct(Product product, Pageable pageable);

    /**
     * Find variants by product ID
     */
    List<ProductVariant> findByProductProductIdOrderBySortOrderAsc(Integer productId);

    /**
     * Find variant by SKU
     */
    Optional<ProductVariant> findByVariantSku(String variantSku);

    /**
     * Find variants by status
     */
    List<ProductVariant> findByStatusOrderByCreatedAtDesc(ProductVariant.VariantStatus status);

    /**
     * Find variants by product and status
     */
    List<ProductVariant> findByProductAndStatusOrderBySortOrderAsc(Product product, ProductVariant.VariantStatus status);

    /**
     * Find default variant for a product
     */
    Optional<ProductVariant> findByProductAndIsDefaultTrue(Product product);

    /**
     * Find variants with low stock
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.stockQuantity <= v.minStockAlert AND v.status = :status")
    List<ProductVariant> findLowStockVariants(@Param("status") ProductVariant.VariantStatus status);

    /**
     * Find variants with low stock for a specific product
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.product = :product AND v.stockQuantity <= v.minStockAlert")
    List<ProductVariant> findLowStockVariantsByProduct(@Param("product") Product product);

    /**
     * Find out of stock variants
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.stockQuantity = 0 AND v.status = :status")
    List<ProductVariant> findOutOfStockVariants(@Param("status") ProductVariant.VariantStatus status);

    /**
     * Find variants by product and attribute values
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.product = :product " +
           "AND (:size IS NULL OR v.size = :size) " +
           "AND (:color IS NULL OR v.color = :color) " +
           "AND (:weight IS NULL OR v.weight = :weight) " +
           "AND (:flavor IS NULL OR v.flavor = :flavor) " +
           "AND (:packSize IS NULL OR v.packSize = :packSize)")
    List<ProductVariant> findVariantsByAttributes(
            @Param("product") Product product,
            @Param("size") String size,
            @Param("color") String color,
            @Param("weight") String weight,
            @Param("flavor") String flavor,
            @Param("packSize") String packSize);

    /**
     * Count variants by product
     */
    long countByProduct(Product product);

    /**
     * Count active variants by product
     */
    long countByProductAndStatus(Product product, ProductVariant.VariantStatus status);

    /**
     * Check if variant SKU exists
     */
    boolean existsByVariantSku(String variantSku);

    /**
     * Find variants by product and vendor
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.product.createdBy.userId = :vendorId")
    Page<ProductVariant> findByVendorId(@Param("vendorId") Integer vendorId, Pageable pageable);

    /**
     * Find variants by vendor and status
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.product.createdBy.userId = :vendorId AND v.status = :status")
    List<ProductVariant> findByVendorIdAndStatus(@Param("vendorId") Integer vendorId, @Param("status") ProductVariant.VariantStatus status);

    /**
     * Get variants count by vendor
     */
    @Query("SELECT COUNT(v) FROM ProductVariant v WHERE v.product.createdBy.userId = :vendorId")
    long countByVendorId(@Param("vendorId") Integer vendorId);

    /**
     * Get active variants count by vendor
     */
    @Query("SELECT COUNT(v) FROM ProductVariant v WHERE v.product.createdBy.userId = :vendorId AND v.status = :status")
    long countByVendorIdAndStatus(@Param("vendorId") Integer vendorId, @Param("status") ProductVariant.VariantStatus status);

    /**
     * Find variants needing stock alert by vendor
     */
    @Query("SELECT v FROM ProductVariant v WHERE v.product.createdBy.userId = :vendorId " +
           "AND v.stockQuantity <= v.minStockAlert AND v.status = 'ACTIVE'")
    List<ProductVariant> findLowStockVariantsByVendor(@Param("vendorId") Integer vendorId);
} 