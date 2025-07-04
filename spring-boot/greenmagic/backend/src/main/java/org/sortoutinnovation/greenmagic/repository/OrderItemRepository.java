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
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.orderId = :orderId ORDER BY oi.orderItemId")
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
    
    /**
     * Find order items by product ID
     * @param productId the product ID
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.productId = :productId ORDER BY oi.order.orderDate DESC")
    List<OrderItem> findByProductId(@Param("productId") Integer productId);
    
    /**
     * Find order items by user ID
     * @param userId the user ID
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.user.userId = :userId ORDER BY oi.order.orderDate DESC")
    List<OrderItem> findByUserId(@Param("userId") Long userId);
    
    /**
     * Calculate total quantity sold for a product
     * @param productId the product ID
     * @return Integer total quantity sold
     */
    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi WHERE oi.product.productId = :productId AND oi.order.paymentStatus = 'COMPLETED'")
    Integer calculateTotalQuantitySoldForProduct(@Param("productId") Integer productId);
    
    /**
     * Calculate total revenue for a product
     * @param productId the product ID
     * @return BigDecimal total revenue
     */
    @Query("SELECT COALESCE(SUM(oi.price * oi.quantity), 0) FROM OrderItem oi WHERE oi.product.productId = :productId AND oi.order.paymentStatus = 'COMPLETED'")
    BigDecimal calculateTotalRevenueForProduct(@Param("productId") Integer productId);
    
    /**
     * Find top selling products by quantity
     * @param limit number of products to return
     * @return List<Object[]> containing product ID and total quantity sold
     */
    @Query("SELECT oi.product.productId, SUM(oi.quantity) as totalQty FROM OrderItem oi " +
           "WHERE oi.order.paymentStatus = 'COMPLETED' " +
           "GROUP BY oi.product.productId " +
           "ORDER BY totalQty DESC")
    List<Object[]> findTopSellingProductsByQuantity(@Param("limit") int limit);
    
    /**
     * Find top selling products by revenue
     * @param limit number of products to return
     * @return List<Object[]> containing product ID and total revenue
     */
    @Query("SELECT oi.product.productId, SUM(oi.price * oi.quantity) as totalRevenue FROM OrderItem oi " +
           "WHERE oi.order.paymentStatus = 'COMPLETED' " +
           "GROUP BY oi.product.productId " +
           "ORDER BY totalRevenue DESC")
    List<Object[]> findTopSellingProductsByRevenue(@Param("limit") int limit);
    
    /**
     * Find order items by date range
     * @param startDate start date
     * @param endDate end date
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.orderDate BETWEEN :startDate AND :endDate ORDER BY oi.order.orderDate DESC")
    List<OrderItem> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Calculate total tax collected by date range
     * @param startDate start date
     * @param endDate end date
     * @return BigDecimal total tax amount
     */
    @Query("SELECT COALESCE(SUM(oi.taxAmount), 0) FROM OrderItem oi WHERE oi.order.orderDate BETWEEN :startDate AND :endDate AND oi.order.paymentStatus = 'COMPLETED'")
    BigDecimal calculateTotalTaxCollectedByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Find order items by price range
     * @param minPrice minimum unit price
     * @param maxPrice maximum unit price
     * @return List<OrderItem>
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.price BETWEEN :minPrice AND :maxPrice ORDER BY oi.price DESC")
    List<OrderItem> findByPriceRange(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice);
    
    /**
     * Count order items by product ID
     */
    @Query("SELECT COUNT(oi) FROM OrderItem oi WHERE oi.product.productId = :productId")
    Integer countByProductId(@Param("productId") Integer productId);
    
    /**
     * Count order items by product ID before a specific date
     */
    @Query("SELECT COUNT(oi) FROM OrderItem oi WHERE oi.product.productId = :productId AND oi.order.orderDate < :date")
    Integer countByProductIdBeforeDate(@Param("productId") Integer productId, @Param("date") LocalDateTime date);
} 