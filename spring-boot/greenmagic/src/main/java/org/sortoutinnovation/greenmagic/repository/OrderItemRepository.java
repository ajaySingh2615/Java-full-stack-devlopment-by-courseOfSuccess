package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository interface for OrderItem entity operations
 * Provides CRUD operations and custom queries for order item management
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    /**
     * Find order items by order ID
     * @param orderId the order ID
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.id = :orderId ORDER BY oi.id")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
    
    /**
     * Find order items by product ID
     * @param productId the product ID
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.id = :productId ORDER BY oi.order.createdAt DESC")
    List<OrderItem> findByProductId(@Param("productId") Long productId);
    
    /**
     * Find order items by user ID
     * @param userId the user ID
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.user.id = :userId ORDER BY oi.order.createdAt DESC")
    List<OrderItem> findByUserId(@Param("userId") Long userId);
    
    /**
     * Calculate total quantity sold for a product
     * @param productId the product ID
     * @return Integer total quantity sold
     */
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.paymentStatus = 'PAID'")
    Integer calculateTotalQuantitySoldForProduct(@Param("productId") Long productId);
    
    /**
     * Calculate total revenue for a product
     * @param productId the product ID
     * @return BigDecimal total revenue
     */
    @Query("SELECT COALESCE(SUM(oi.subtotal), 0) FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.paymentStatus = 'PAID'")
    BigDecimal calculateTotalRevenueForProduct(@Param("productId") Long productId);
    
    /**
     * Find top selling products by quantity
     * @param limit number of products to return
     * @return List<Object[]> containing product ID and total quantity sold
     */
    @Query("SELECT oi.product.id, SUM(oi.quantity) as totalQty FROM OrderItem oi " +
           "WHERE oi.order.paymentStatus = 'PAID' " +
           "GROUP BY oi.product.id " +
           "ORDER BY totalQty DESC")
    List<Object[]> findTopSellingProductsByQuantity(@Param("limit") int limit);
    
    /**
     * Find top selling products by revenue
     * @param limit number of products to return
     * @return List<Object[]> containing product ID and total revenue
     */
    @Query("SELECT oi.product.id, SUM(oi.subtotal) as totalRevenue FROM OrderItem oi " +
           "WHERE oi.order.paymentStatus = 'PAID' " +
           "GROUP BY oi.product.id " +
           "ORDER BY totalRevenue DESC")
    List<Object[]> findTopSellingProductsByRevenue(@Param("limit") int limit);
    
    /**
     * Find order items by date range
     * @param startDate start date
     * @param endDate end date
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.createdAt BETWEEN :startDate AND :endDate ORDER BY oi.order.createdAt DESC")
    List<OrderItem> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Calculate total tax collected by date range
     * @param startDate start date
     * @param endDate end date
     * @return BigDecimal total tax amount
     */
    @Query("SELECT COALESCE(SUM(oi.taxAmount), 0) FROM OrderItem oi WHERE oi.order.createdAt BETWEEN :startDate AND :endDate AND oi.order.paymentStatus = 'PAID'")
    BigDecimal calculateTotalTaxCollectedByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find order items by price range
     * @param minPrice minimum unit price
     * @param maxPrice maximum unit price
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.unitPrice BETWEEN :minPrice AND :maxPrice ORDER BY oi.unitPrice DESC")
    List<OrderItem> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
} 