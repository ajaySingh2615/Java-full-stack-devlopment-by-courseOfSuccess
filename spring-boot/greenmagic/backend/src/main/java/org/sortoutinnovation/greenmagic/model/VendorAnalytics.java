package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing vendor analytics data
 * Maps to the 'vendor_analytics' table in the database
 */
@Entity
@Table(name = "vendor_analytics", indexes = {
    @Index(name = "idx_analytics_vendor_date", columnList = "vendor_id, analytics_date"),
    @Index(name = "idx_analytics_date", columnList = "analytics_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "analytics_id")
    private Long analyticsId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", referencedColumnName = "user_id", nullable = false)
    private User vendor;

    @Column(name = "analytics_date", nullable = false)
    private LocalDate analyticsDate;

    // Sales Metrics
    @DecimalMin(value = "0.00", message = "Total revenue must be greater than or equal to 0")
    @Column(name = "total_revenue", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Column(name = "total_orders", nullable = false)
    private Integer totalOrders = 0;

    @Column(name = "total_customers", nullable = false)
    private Integer totalCustomers = 0;

    @DecimalMin(value = "0.00", message = "Average order value must be greater than or equal to 0")
    @Column(name = "average_order_value", precision = 10, scale = 2)
    private BigDecimal averageOrderValue = BigDecimal.ZERO;

    // Product Metrics
    @Column(name = "total_products", nullable = false)
    private Integer totalProducts = 0;

    @Column(name = "active_products", nullable = false)
    private Integer activeProducts = 0;

    @Column(name = "out_of_stock_products", nullable = false)
    private Integer outOfStockProducts = 0;

    @Column(name = "low_stock_products", nullable = false)
    private Integer lowStockProducts = 0;

    // Order Status Metrics
    @Column(name = "pending_orders", nullable = false)
    private Integer pendingOrders = 0;

    @Column(name = "processing_orders", nullable = false)
    private Integer processingOrders = 0;

    @Column(name = "shipped_orders", nullable = false)
    private Integer shippedOrders = 0;

    @Column(name = "delivered_orders", nullable = false)
    private Integer deliveredOrders = 0;

    @Column(name = "cancelled_orders", nullable = false)
    private Integer cancelledOrders = 0;

    @Column(name = "returned_orders", nullable = false)
    private Integer returnedOrders = 0;

    // Customer Metrics
    @Column(name = "new_customers", nullable = false)
    private Integer newCustomers = 0;

    @Column(name = "repeat_customers", nullable = false)
    private Integer repeatCustomers = 0;

    @DecimalMin(value = "0.0", message = "Customer satisfaction must be greater than or equal to 0")
    @Column(name = "avg_customer_rating", precision = 3, scale = 2)
    private BigDecimal avgCustomerRating = BigDecimal.ZERO;

    @Column(name = "total_reviews", nullable = false)
    private Integer totalReviews = 0;

    // Financial Metrics
    @DecimalMin(value = "0.00", message = "Gross profit must be greater than or equal to 0")
    @Column(name = "gross_profit", precision = 12, scale = 2)
    private BigDecimal grossProfit = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Commission paid must be greater than or equal to 0")
    @Column(name = "commission_paid", precision = 10, scale = 2)
    private BigDecimal commissionPaid = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Net earnings must be greater than or equal to 0")
    @Column(name = "net_earnings", precision = 12, scale = 2)
    private BigDecimal netEarnings = BigDecimal.ZERO;

    // Performance Metrics
    @Column(name = "conversion_rate", precision = 5, scale = 2)
    private BigDecimal conversionRate = BigDecimal.ZERO;

    @Column(name = "page_views", nullable = false)
    private Integer pageViews = 0;

    @Column(name = "product_views", nullable = false)
    private Integer productViews = 0;

    @Column(name = "cart_additions", nullable = false)
    private Integer cartAdditions = 0;

    // Growth Metrics (compared to previous period)
    @Column(name = "revenue_growth", precision = 5, scale = 2)
    private BigDecimal revenueGrowth = BigDecimal.ZERO;

    @Column(name = "order_growth", precision = 5, scale = 2)
    private BigDecimal orderGrowth = BigDecimal.ZERO;

    @Column(name = "customer_growth", precision = 5, scale = 2)
    private BigDecimal customerGrowth = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Helper methods
    public BigDecimal getGrossProfitMargin() {
        if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            return grossProfit.divide(totalRevenue, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getCommissionRate() {
        if (totalRevenue.compareTo(BigDecimal.ZERO) > 0) {
            return commissionPaid.divide(totalRevenue, 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public Integer getTotalOrdersExcludingCancelled() {
        return totalOrders - cancelledOrders;
    }

    public BigDecimal getOrderFulfillmentRate() {
        int totalProcessedOrders = getTotalOrdersExcludingCancelled();
        if (totalProcessedOrders > 0) {
            return BigDecimal.valueOf(deliveredOrders)
                    .divide(BigDecimal.valueOf(totalProcessedOrders), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getCancellationRate() {
        if (totalOrders > 0) {
            return BigDecimal.valueOf(cancelledOrders)
                    .divide(BigDecimal.valueOf(totalOrders), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }
} 