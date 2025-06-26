package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing vendor-customer relationships
 * Maps to the 'vendor_customers' table in the database
 */
@Entity
@Table(name = "vendor_customers", indexes = {
    @Index(name = "idx_vendor_customers", columnList = "vendor_id, customer_id"),
    @Index(name = "idx_customer_segment", columnList = "customer_segment"),
    @Index(name = "idx_last_order_date", columnList = "last_order_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorCustomer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "relationship_id")
    private Long relationshipId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", referencedColumnName = "user_id", nullable = false)
    private User vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "user_id", nullable = false)
    private User customer;

    // Purchase History
    @Column(name = "total_orders", nullable = false)
    private Integer totalOrders = 0;

    @DecimalMin(value = "0.00", message = "Total spent must be greater than or equal to 0")
    @Column(name = "total_spent", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalSpent = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Average order value must be greater than or equal to 0")
    @Column(name = "average_order_value", precision = 10, scale = 2)
    private BigDecimal averageOrderValue = BigDecimal.ZERO;

    @Column(name = "first_order_date")
    private LocalDateTime firstOrderDate;

    @Column(name = "last_order_date")
    private LocalDateTime lastOrderDate;

    // Customer Segmentation
    @Enumerated(EnumType.STRING)
    @Column(name = "customer_segment", nullable = false)
    private CustomerSegment customerSegment = CustomerSegment.NEW;

    @Column(name = "loyalty_points", nullable = false)
    private Integer loyaltyPoints = 0;

    // Ratings and Reviews
    @DecimalMin(value = "0.0", message = "Average rating must be greater than or equal to 0")
    @DecimalMax(value = "5.0", message = "Average rating must be less than or equal to 5")
    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_reviews", nullable = false)
    private Integer totalReviews = 0;

    // Communication
    @Column(name = "preferred_communication", length = 50)
    private String preferredCommunication = "EMAIL";

    @Column(name = "last_communication_date")
    private LocalDateTime lastCommunicationDate;

    @Column(name = "communication_frequency", nullable = false)
    private Integer communicationFrequency = 0;

    // Behavior Analysis
    @Column(name = "favorite_category", length = 100)
    private String favoriteCategory;

    @Column(name = "average_days_between_orders")
    private Integer averageDaysBetweenOrders;

    @Column(name = "preferred_payment_method", length = 50)
    private String preferredPaymentMethod;

    @Column(name = "preferred_delivery_time", length = 50)
    private String preferredDeliveryTime;

    // Engagement Metrics
    @Column(name = "email_opens", nullable = false)
    private Integer emailOpens = 0;

    @Column(name = "email_clicks", nullable = false)
    private Integer emailClicks = 0;

    @Column(name = "website_visits", nullable = false)
    private Integer websiteVisits = 0;

    @Column(name = "product_views", nullable = false)
    private Integer productViews = 0;

    // Status
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_vip")
    private Boolean isVip = false;

    @Column(name = "is_blacklisted")
    private Boolean isBlacklisted = false;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CustomerSegment {
        NEW,        // 0-1 orders
        REGULAR,    // 2-5 orders
        VIP,        // 6+ orders or high value
        INACTIVE    // No orders in last 6 months
    }

    // Helper methods
    public boolean isRecentCustomer() {
        if (lastOrderDate == null) return false;
        return lastOrderDate.isAfter(LocalDateTime.now().minusMonths(3));
    }

    public boolean isRepeatCustomer() {
        return totalOrders != null && totalOrders > 1;
    }

    public boolean isHighValueCustomer() {
        return totalSpent != null && totalSpent.compareTo(BigDecimal.valueOf(10000)) >= 0;
    }

    public BigDecimal getEngagementRate() {
        if (emailOpens > 0) {
            return BigDecimal.valueOf(emailClicks)
                    .divide(BigDecimal.valueOf(emailOpens), 4, java.math.RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }

    public CustomerSegment calculateSegment() {
        if (totalOrders == 0 || !isRecentCustomer()) {
            return CustomerSegment.INACTIVE;
        } else if (totalOrders == 1) {
            return CustomerSegment.NEW;
        } else if (totalOrders <= 5 && !isHighValueCustomer()) {
            return CustomerSegment.REGULAR;
        } else {
            return CustomerSegment.VIP;
        }
    }

    public Integer getDaysSinceLastOrder() {
        if (lastOrderDate == null) return null;
        return (int) java.time.temporal.ChronoUnit.DAYS.between(lastOrderDate.toLocalDate(), LocalDateTime.now().toLocalDate());
    }
} 