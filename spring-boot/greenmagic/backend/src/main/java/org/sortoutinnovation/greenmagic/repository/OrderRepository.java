package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Order entity operations
 * Provides CRUD operations and custom queries for order management
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    /**
     * Find orders by user ID
     * @param userId the user ID
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.orderDate DESC")
    Page<Order> findByUserId(@Param("userId") Long userId, Pageable pageable);
    
    /**
     * Find orders by user ID and status
     * @param userId the user ID
     * @param status the order status
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId AND o.status = :status ORDER BY o.orderDate DESC")
    Page<Order> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") String status, Pageable pageable);
    
    /**
     * Find orders by status
     * @param status the order status
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.orderDate DESC")
    Page<Order> findByStatus(@Param("status") String status, Pageable pageable);
    
    /**
     * Find orders by payment status
     * @param paymentStatus the payment status
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.paymentStatus = :paymentStatus ORDER BY o.orderDate DESC")
    Page<Order> findByPaymentStatus(@Param("paymentStatus") Order.PaymentStatus paymentStatus, Pageable pageable);
    
    /**
     * Find orders by payment method
     * @param paymentMethod the payment method
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.paymentMethod = :paymentMethod ORDER BY o.orderDate DESC")
    Page<Order> findByPaymentMethod(@Param("paymentMethod") String paymentMethod, Pageable pageable);
    
    /**
     * Find orders by date range
     * @param startDate start date
     * @param endDate end date
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate ORDER BY o.orderDate DESC")
    Page<Order> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, Pageable pageable);
    
    /**
     * Find orders by total amount range
     * @param minAmount minimum amount
     * @param maxAmount maximum amount
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.totalPrice BETWEEN :minAmount AND :maxAmount ORDER BY o.totalPrice DESC")
    Page<Order> findByTotalAmountRange(@Param("minAmount") BigDecimal minAmount, @Param("maxAmount") BigDecimal maxAmount, Pageable pageable);
    
    /**
     * Find recent orders
     * @param since datetime threshold
     * @param pageable pagination information
     * @return Page<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :since ORDER BY o.orderDate DESC")
    Page<Order> findRecentOrders(@Param("since") LocalDateTime since, Pageable pageable);
    
    /**
     * Find orders requiring attention (pending payment or processing)
     * @return List<Order>
     */
    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'PROCESSING') OR o.paymentStatus = 'PENDING' ORDER BY o.orderDate")
    List<Order> findOrdersRequiringAttention();
    
    /**
     * Calculate total sales by date range
     * @param startDate start date
     * @param endDate end date
     * @return BigDecimal total sales amount
     */
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate AND o.paymentStatus = 'COMPLETED'")
    BigDecimal calculateTotalSalesByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Count orders by status
     * @param status the order status
     * @return long count of orders
     */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") String status);
    
    /**
     * Count orders by user ID
     * @param userId the user ID
     * @return long count of orders
     */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.userId = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    /**
     * Find orders by Razorpay order ID
     * @param razorpayOrderId the Razorpay order ID
     * @return Optional<Order>
     */
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    
    /**
     * Find orders by Razorpay payment ID
     * @param razorpayPaymentId the Razorpay payment ID
     * @return Optional<Order>
     */
    Optional<Order> findByRazorpayPaymentId(String razorpayPaymentId);
    
    // ===========================
    // VENDOR-SPECIFIC METHODS
    // ===========================
    
    /**
     * Find orders containing products from a specific vendor
     */
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findOrdersByVendor(@Param("vendorId") Integer vendorId, Pageable pageable);
    
    /**
     * Find orders by vendor and status
     */
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "AND o.status = :status " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findOrdersByVendorAndStatus(@Param("vendorId") Integer vendorId, 
                                           @Param("status") String status, 
                                           Pageable pageable);
    
    /**
     * Find orders by vendor with search
     */
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "AND (:search IS NULL OR " +
           "CAST(o.orderId AS string) LIKE CONCAT('%', :search, '%') OR " +
           "LOWER(o.user.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.user.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findOrdersByVendorWithSearch(@Param("vendorId") Integer vendorId,
                                            @Param("search") String search,
                                            Pageable pageable);
    
    /**
     * Count orders by vendor
     */
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.createdBy.userId = :vendorId")
    long countOrdersByVendor(@Param("vendorId") Integer vendorId);
    
    /**
     * Count orders by vendor and status
     */
    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "AND o.status = :status")
    long countOrdersByVendorAndStatus(@Param("vendorId") Integer vendorId, @Param("status") String status);
    
    /**
     * Calculate total revenue for vendor
     */
    @Query("SELECT COALESCE(SUM(oi.price * oi.quantity), 0) FROM OrderItem oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "AND oi.order.paymentStatus = 'COMPLETED'")
    BigDecimal calculateVendorRevenue(@Param("vendorId") Integer vendorId);
    
    /**
     * Calculate vendor revenue by date range
     */
    @Query("SELECT COALESCE(SUM(oi.price * oi.quantity), 0) FROM OrderItem oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "AND oi.order.paymentStatus = 'COMPLETED' " +
           "AND oi.order.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateVendorRevenueByDateRange(@Param("vendorId") Integer vendorId,
                                                @Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);
    
    /**
     * Get vendor order statistics by date range
     */
    @Query("SELECT " +
           "COUNT(DISTINCT o) as totalOrders, " +
           "COALESCE(SUM(oi.price * oi.quantity), 0) as totalRevenue, " +
           "COALESCE(AVG(oi.price * oi.quantity), 0) as avgOrderValue " +
           "FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "AND o.orderDate BETWEEN :startDate AND :endDate " +
           "AND o.paymentStatus = 'COMPLETED'")
    Object[] getVendorOrderStatistics(@Param("vendorId") Integer vendorId,
                                     @Param("startDate") LocalDateTime startDate,
                                     @Param("endDate") LocalDateTime endDate);
    
    /**
     * Get recent orders for vendor
     */
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.createdBy.userId = :vendorId " +
           "ORDER BY o.orderDate DESC")
    List<Order> findRecentOrdersByVendor(@Param("vendorId") Integer vendorId, Pageable pageable);
    
    /**
     * Check if order contains vendor's products
     */
    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi " +
           "WHERE oi.order.orderId = :orderId " +
           "AND oi.product.createdBy.userId = :vendorId")
    boolean isOrderFromVendor(@Param("orderId") Integer orderId, @Param("vendorId") Integer vendorId);
    
    /**
     * Check if product has any orders
     */
    boolean existsByOrderItemsProductProductId(Integer productId);
} 