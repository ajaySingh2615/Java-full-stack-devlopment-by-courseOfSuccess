package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.VendorCustomer;
import org.sortoutinnovation.greenmagic.model.User;
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

@Repository
public interface VendorCustomerRepository extends JpaRepository<VendorCustomer, Long> {

    /**
     * Find vendor-customer relationship
     */
    Optional<VendorCustomer> findByVendorAndCustomer(User vendor, User customer);

    /**
     * Find all customers of a vendor
     */
    Page<VendorCustomer> findByVendorOrderByLastOrderDateDesc(User vendor, Pageable pageable);

    /**
     * Find customers by vendor ID
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId ORDER BY vc.lastOrderDate DESC")
    Page<VendorCustomer> findByVendorId(@Param("vendorId") Integer vendorId, Pageable pageable);

    /**
     * Find customers by vendor and segment
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId AND vc.customerSegment = :segment")
    List<VendorCustomer> findByVendorIdAndSegment(
            @Param("vendorId") Integer vendorId,
            @Param("segment") VendorCustomer.CustomerSegment segment);

    /**
     * Find active customers by vendor
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId AND vc.isActive = true")
    Page<VendorCustomer> findActiveCustomersByVendor(@Param("vendorId") Integer vendorId, Pageable pageable);

    /**
     * Find VIP customers by vendor
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId AND vc.isVip = true")
    List<VendorCustomer> findVipCustomersByVendor(@Param("vendorId") Integer vendorId);

    /**
     * Find high-value customers by vendor
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "AND vc.totalSpent >= :minSpent ORDER BY vc.totalSpent DESC")
    List<VendorCustomer> findHighValueCustomers(
            @Param("vendorId") Integer vendorId,
            @Param("minSpent") BigDecimal minSpent);

    /**
     * Find recent customers (ordered in last N months)
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "AND vc.lastOrderDate >= :sinceDate ORDER BY vc.lastOrderDate DESC")
    List<VendorCustomer> findRecentCustomers(
            @Param("vendorId") Integer vendorId,
            @Param("sinceDate") LocalDateTime sinceDate);

    /**
     * Find inactive customers (no orders in last N months)
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "AND (vc.lastOrderDate IS NULL OR vc.lastOrderDate < :beforeDate)")
    List<VendorCustomer> findInactiveCustomers(
            @Param("vendorId") Integer vendorId,
            @Param("beforeDate") LocalDateTime beforeDate);

    /**
     * Get customer count by vendor
     */
    @Query("SELECT COUNT(vc) FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId")
    long countByVendorId(@Param("vendorId") Integer vendorId);

    /**
     * Get customer count by vendor and segment
     */
    @Query("SELECT COUNT(vc) FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId AND vc.customerSegment = :segment")
    long countByVendorIdAndSegment(
            @Param("vendorId") Integer vendorId,
            @Param("segment") VendorCustomer.CustomerSegment segment);

    /**
     * Get active customer count by vendor
     */
    @Query("SELECT COUNT(vc) FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId AND vc.isActive = true")
    long countActiveCustomersByVendor(@Param("vendorId") Integer vendorId);

    /**
     * Get VIP customer count by vendor
     */
    @Query("SELECT COUNT(vc) FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId AND vc.isVip = true")
    long countVipCustomersByVendor(@Param("vendorId") Integer vendorId);

    /**
     * Get total revenue from customers by vendor
     */
    @Query("SELECT COALESCE(SUM(vc.totalSpent), 0) FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId")
    BigDecimal getTotalRevenueByVendor(@Param("vendorId") Integer vendorId);

    /**
     * Get average order value by vendor
     */
    @Query("SELECT COALESCE(AVG(vc.averageOrderValue), 0) FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId")
    BigDecimal getAverageOrderValueByVendor(@Param("vendorId") Integer vendorId);

    /**
     * Get customer acquisition trend
     */
    @Query("SELECT DATE(vc.createdAt) as date, COUNT(vc) as newCustomers " +
           "FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "AND vc.createdAt BETWEEN :startDate AND :endDate " +
           "GROUP BY DATE(vc.createdAt) ORDER BY date ASC")
    List<Object[]> getCustomerAcquisitionTrend(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    /**
     * Get customer segmentation summary
     */
    @Query("SELECT vc.customerSegment, COUNT(vc), COALESCE(SUM(vc.totalSpent), 0) " +
           "FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "GROUP BY vc.customerSegment")
    List<Object[]> getCustomerSegmentationSummary(@Param("vendorId") Integer vendorId);

    /**
     * Get top customers by spending
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "ORDER BY vc.totalSpent DESC")
    List<VendorCustomer> getTopCustomersBySpending(@Param("vendorId") Integer vendorId, Pageable pageable);

    /**
     * Get customers by preferred communication method
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "AND vc.preferredCommunication = :communicationMethod")
    List<VendorCustomer> findByPreferredCommunication(
            @Param("vendorId") Integer vendorId,
            @Param("communicationMethod") String communicationMethod);

    /**
     * Find customers needing follow-up (no recent communication)
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "AND (vc.lastCommunicationDate IS NULL OR vc.lastCommunicationDate < :beforeDate) " +
           "AND vc.isActive = true")
    List<VendorCustomer> findCustomersNeedingFollowUp(
            @Param("vendorId") Integer vendorId,
            @Param("beforeDate") LocalDateTime beforeDate);

    /**
     * Get customer lifetime value statistics
     */
    @Query("SELECT " +
           "AVG(vc.totalSpent) as avgLifetimeValue, " +
           "MAX(vc.totalSpent) as maxLifetimeValue, " +
           "MIN(vc.totalSpent) as minLifetimeValue, " +
           "COUNT(vc) as totalCustomers " +
           "FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId")
    Object[] getCustomerLifetimeValueStats(@Param("vendorId") Integer vendorId);

    /**
     * Search customers by name or email
     */
    @Query("SELECT vc FROM VendorCustomer vc WHERE vc.vendor.userId = :vendorId " +
           "AND (LOWER(vc.customer.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(vc.customer.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<VendorCustomer> searchCustomers(
            @Param("vendorId") Integer vendorId,
            @Param("searchTerm") String searchTerm,
            Pageable pageable);

    /**
     * Check if vendor-customer relationship exists
     */
    boolean existsByVendorAndCustomer(User vendor, User customer);
} 