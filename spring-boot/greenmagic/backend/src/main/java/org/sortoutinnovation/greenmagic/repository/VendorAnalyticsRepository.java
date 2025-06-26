package org.sortoutinnovation.greenmagic.repository;

import org.sortoutinnovation.greenmagic.model.VendorAnalytics;
import org.sortoutinnovation.greenmagic.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorAnalyticsRepository extends JpaRepository<VendorAnalytics, Long> {

    /**
     * Find analytics by vendor and date
     */
    Optional<VendorAnalytics> findByVendorAndAnalyticsDate(User vendor, LocalDate analyticsDate);

    /**
     * Find analytics by vendor ID and date
     */
    @Query("SELECT va FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId AND va.analyticsDate = :date")
    Optional<VendorAnalytics> findByVendorIdAndDate(@Param("vendorId") Integer vendorId, @Param("date") LocalDate date);

    /**
     * Find analytics by vendor for date range
     */
    @Query("SELECT va FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "AND va.analyticsDate BETWEEN :startDate AND :endDate ORDER BY va.analyticsDate DESC")
    List<VendorAnalytics> findByVendorIdAndDateRange(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Find analytics by vendor for date range with pagination
     */
    @Query("SELECT va FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "AND va.analyticsDate BETWEEN :startDate AND :endDate ORDER BY va.analyticsDate DESC")
    Page<VendorAnalytics> findByVendorIdAndDateRange(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    /**
     * Get total revenue for vendor in date range
     */
    @Query("SELECT COALESCE(SUM(va.totalRevenue), 0) FROM VendorAnalytics va " +
           "WHERE va.vendor.userId = :vendorId AND va.analyticsDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByVendorAndDateRange(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get total orders for vendor in date range
     */
    @Query("SELECT COALESCE(SUM(va.totalOrders), 0) FROM VendorAnalytics va " +
           "WHERE va.vendor.userId = :vendorId AND va.analyticsDate BETWEEN :startDate AND :endDate")
    Integer getTotalOrdersByVendorAndDateRange(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get total customers for vendor in date range
     */
    @Query("SELECT COALESCE(SUM(va.totalCustomers), 0) FROM VendorAnalytics va " +
           "WHERE va.vendor.userId = :vendorId AND va.analyticsDate BETWEEN :startDate AND :endDate")
    Integer getTotalCustomersByVendorAndDateRange(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get average order value for vendor in date range
     */
    @Query("SELECT COALESCE(AVG(va.averageOrderValue), 0) FROM VendorAnalytics va " +
           "WHERE va.vendor.userId = :vendorId AND va.analyticsDate BETWEEN :startDate AND :endDate")
    BigDecimal getAverageOrderValueByVendorAndDateRange(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get latest analytics for vendor
     */
    @Query("SELECT va FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "ORDER BY va.analyticsDate DESC LIMIT 1")
    Optional<VendorAnalytics> findLatestByVendorId(@Param("vendorId") Integer vendorId);

    /**
     * Get analytics for current month
     */
    @Query("SELECT va FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "AND YEAR(va.analyticsDate) = :year AND MONTH(va.analyticsDate) = :month " +
           "ORDER BY va.analyticsDate ASC")
    List<VendorAnalytics> findByVendorIdAndMonth(
            @Param("vendorId") Integer vendorId,
            @Param("year") int year,
            @Param("month") int month);

    /**
     * Get analytics for current year
     */
    @Query("SELECT va FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "AND YEAR(va.analyticsDate) = :year ORDER BY va.analyticsDate ASC")
    List<VendorAnalytics> findByVendorIdAndYear(
            @Param("vendorId") Integer vendorId,
            @Param("year") int year);

    /**
     * Get monthly revenue summary for vendor
     */
    @Query("SELECT YEAR(va.analyticsDate) as year, MONTH(va.analyticsDate) as month, " +
           "SUM(va.totalRevenue) as revenue, SUM(va.totalOrders) as orders " +
           "FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "GROUP BY YEAR(va.analyticsDate), MONTH(va.analyticsDate) " +
           "ORDER BY YEAR(va.analyticsDate) DESC, MONTH(va.analyticsDate) DESC")
    List<Object[]> getMonthlyRevenueSummary(@Param("vendorId") Integer vendorId);

    /**
     * Get top performing vendors by revenue
     */
    @Query("SELECT va.vendor, SUM(va.totalRevenue) as totalRevenue " +
           "FROM VendorAnalytics va WHERE va.analyticsDate BETWEEN :startDate AND :endDate " +
           "GROUP BY va.vendor ORDER BY totalRevenue DESC")
    List<Object[]> getTopVendorsByRevenue(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    /**
     * Get vendor performance comparison
     */
    @Query("SELECT va.vendor.userId, " +
           "SUM(va.totalRevenue) as revenue, " +
           "SUM(va.totalOrders) as orders, " +
           "AVG(va.averageOrderValue) as avgOrderValue, " +
           "AVG(va.conversionRate) as conversionRate " +
           "FROM VendorAnalytics va WHERE va.analyticsDate BETWEEN :startDate AND :endDate " +
           "GROUP BY va.vendor.userId")
    List<Object[]> getVendorPerformanceComparison(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Get revenue trend for vendor
     */
    @Query("SELECT va.analyticsDate, va.totalRevenue, va.totalOrders " +
           "FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "AND va.analyticsDate BETWEEN :startDate AND :endDate " +
           "ORDER BY va.analyticsDate ASC")
    List<Object[]> getRevenueTrend(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Check if analytics exist for vendor and date
     */
    boolean existsByVendorAndAnalyticsDate(User vendor, LocalDate analyticsDate);

    /**
     * Delete old analytics data (for cleanup)
     */
    @Query("DELETE FROM VendorAnalytics va WHERE va.analyticsDate < :cutoffDate")
    void deleteAnalyticsOlderThan(@Param("cutoffDate") LocalDate cutoffDate);

    /**
     * Get analytics summary for dashboard
     */
    @Query("SELECT " +
           "SUM(va.totalRevenue) as totalRevenue, " +
           "SUM(va.totalOrders) as totalOrders, " +
           "SUM(va.totalCustomers) as totalCustomers, " +
           "AVG(va.averageOrderValue) as avgOrderValue, " +
           "AVG(va.conversionRate) as conversionRate " +
           "FROM VendorAnalytics va WHERE va.vendor.userId = :vendorId " +
           "AND va.analyticsDate BETWEEN :startDate AND :endDate")
    Object[] getAnalyticsSummary(
            @Param("vendorId") Integer vendorId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
} 