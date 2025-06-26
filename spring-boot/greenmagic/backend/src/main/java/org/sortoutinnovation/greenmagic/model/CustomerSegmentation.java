package org.sortoutinnovation.greenmagic.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing customer segmentation and behavior analysis
 * Maps to the 'customer_segmentation' table in the database
 */
@Entity
@Table(name = "customer_segmentation", indexes = {
    @Index(name = "idx_customer_segmentation_customer", columnList = "customer_id"),
    @Index(name = "idx_customer_segmentation_vendor", columnList = "vendor_id"),
    @Index(name = "idx_customer_segmentation_segment", columnList = "segment_type"),
    @Index(name = "idx_customer_segmentation_value", columnList = "lifetime_value"),
    @Index(name = "idx_customer_segmentation_updated", columnList = "last_updated")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSegmentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "segmentation_id")
    private Long segmentationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "user_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", referencedColumnName = "vendor_id", nullable = false)
    private VendorProfile vendorProfile;

    @Enumerated(EnumType.STRING)
    @Column(name = "segment_type", nullable = false)
    private SegmentType segmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "value_tier", nullable = false)
    private ValueTier valueTier;

    @Enumerated(EnumType.STRING)
    @Column(name = "engagement_level")
    private EngagementLevel engagementLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "purchase_frequency")
    private PurchaseFrequency purchaseFrequency;

    // Purchase Behavior Metrics
    @DecimalMin(value = "0.00", message = "Lifetime value must be greater than or equal to 0")
    @Column(name = "lifetime_value", precision = 12, scale = 2)
    private BigDecimal lifetimeValue = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "Average order value must be greater than or equal to 0")
    @Column(name = "average_order_value", precision = 10, scale = 2)
    private BigDecimal averageOrderValue = BigDecimal.ZERO;

    @Min(value = 0, message = "Total orders must be greater than or equal to 0")
    @Column(name = "total_orders")
    private Integer totalOrders = 0;

    @Min(value = 0, message = "Completed orders must be greater than or equal to 0")
    @Column(name = "completed_orders")
    private Integer completedOrders = 0;

    @Min(value = 0, message = "Cancelled orders must be greater than or equal to 0")
    @Column(name = "cancelled_orders")
    private Integer cancelledOrders = 0;

    @Min(value = 0, message = "Returned orders must be greater than or equal to 0")
    @Column(name = "returned_orders")
    private Integer returnedOrders = 0;

    @DecimalMin(value = "0.0", message = "Success rate must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Success rate must be between 0 and 100")
    @Column(name = "order_success_rate", precision = 5, scale = 2)
    private BigDecimal orderSuccessRate = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "Cancellation rate must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Cancellation rate must be between 0 and 100")
    @Column(name = "cancellation_rate", precision = 5, scale = 2)
    private BigDecimal cancellationRate = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "Return rate must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Return rate must be between 0 and 100")
    @Column(name = "return_rate", precision = 5, scale = 2)
    private BigDecimal returnRate = BigDecimal.ZERO;

    // Engagement Metrics
    @Column(name = "first_purchase_date")
    private LocalDateTime firstPurchaseDate;

    @Column(name = "last_purchase_date")
    private LocalDateTime lastPurchaseDate;

    @Column(name = "days_since_last_purchase")
    private Integer daysSinceLastPurchase;

    @DecimalMin(value = "0.00", message = "Monthly spending must be greater than or equal to 0")
    @Column(name = "average_monthly_spending", precision = 10, scale = 2)
    private BigDecimal averageMonthlySpending = BigDecimal.ZERO;

    @Min(value = 0, message = "Days as customer must be greater than or equal to 0")
    @Column(name = "days_as_customer")
    private Integer daysAsCustomer = 0;

    // Category Preferences
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "favorite_categories", columnDefinition = "JSON")
    private List<String> favoriteCategories;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "category_spending_breakdown", columnDefinition = "JSON")
    private Object categorySpendingBreakdown;

    // Communication Preferences
    @Column(name = "email_engagement_score")
    private Integer emailEngagementScore = 0; // 0-100

    @Column(name = "sms_engagement_score")
    private Integer smsEngagementScore = 0; // 0-100

    @Column(name = "app_engagement_score")
    private Integer appEngagementScore = 0; // 0-100

    @Column(name = "review_participation_rate", precision = 5, scale = 2)
    private BigDecimal reviewParticipationRate = BigDecimal.ZERO;

    // Risk Assessment
    @Enumerated(EnumType.STRING)
    @Column(name = "churn_risk")
    private ChurnRisk churnRisk = ChurnRisk.LOW;

    @Column(name = "predicted_ltv", precision = 12, scale = 2)
    private BigDecimal predictedLifetimeValue = BigDecimal.ZERO;

    @Column(name = "churn_probability", precision = 5, scale = 2)
    private BigDecimal churnProbability = BigDecimal.ZERO;

    // Segmentation History
    @Column(name = "previous_segment")
    private String previousSegment;

    @Column(name = "segment_change_date")
    private LocalDateTime segmentChangeDate;

    @Column(name = "segment_stability_score")
    private Integer segmentStabilityScore = 100; // 0-100

    // System Fields
    @Column(name = "last_calculated")
    private LocalDateTime lastCalculated;

    @Column(name = "calculation_version")
    private String calculationVersion = "1.0";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    // Enums
    public enum SegmentType {
        NEW_CUSTOMER("New Customer", 0, 30),
        REGULAR_CUSTOMER("Regular Customer", 31, 365),
        VIP_CUSTOMER("VIP Customer", -1, -1),
        INACTIVE_CUSTOMER("Inactive Customer", -1, -1),
        AT_RISK_CUSTOMER("At Risk Customer", -1, -1),
        CHURNED_CUSTOMER("Churned Customer", -1, -1);

        private final String displayName;
        private final int minDays;
        private final int maxDays;

        SegmentType(String displayName, int minDays, int maxDays) {
            this.displayName = displayName;
            this.minDays = minDays;
            this.maxDays = maxDays;
        }

        public String getDisplayName() {
            return displayName;
        }

        public boolean isWithinDaysRange(int days) {
            if (minDays == -1 && maxDays == -1) return false; // Special segments
            return days >= minDays && (maxDays == -1 || days <= maxDays);
        }
    }

    public enum ValueTier {
        BRONZE("Bronze", BigDecimal.ZERO, new BigDecimal("5000")),
        SILVER("Silver", new BigDecimal("5000"), new BigDecimal("15000")),
        GOLD("Gold", new BigDecimal("15000"), new BigDecimal("50000")),
        PLATINUM("Platinum", new BigDecimal("50000"), null),
        DIAMOND("Diamond", new BigDecimal("100000"), null);

        private final String displayName;
        private final BigDecimal minValue;
        private final BigDecimal maxValue;

        ValueTier(String displayName, BigDecimal minValue, BigDecimal maxValue) {
            this.displayName = displayName;
            this.minValue = minValue;
            this.maxValue = maxValue;
        }

        public String getDisplayName() {
            return displayName;
        }

        public static ValueTier getByLifetimeValue(BigDecimal lifetimeValue) {
            for (ValueTier tier : values()) {
                if (lifetimeValue.compareTo(tier.minValue) >= 0 &&
                    (tier.maxValue == null || lifetimeValue.compareTo(tier.maxValue) < 0)) {
                    return tier;
                }
            }
            return BRONZE;
        }
    }

    public enum EngagementLevel {
        HIGH("High Engagement", 80, 100),
        MEDIUM("Medium Engagement", 50, 79),
        LOW("Low Engagement", 20, 49),
        VERY_LOW("Very Low Engagement", 0, 19);

        private final String displayName;
        private final int minScore;
        private final int maxScore;

        EngagementLevel(String displayName, int minScore, int maxScore) {
            this.displayName = displayName;
            this.minScore = minScore;
            this.maxScore = maxScore;
        }

        public String getDisplayName() {
            return displayName;
        }

        public static EngagementLevel getByScore(int score) {
            for (EngagementLevel level : values()) {
                if (score >= level.minScore && score <= level.maxScore) {
                    return level;
                }
            }
            return VERY_LOW;
        }
    }

    public enum PurchaseFrequency {
        DAILY("Daily", 1, 1),
        WEEKLY("Weekly", 2, 7),
        BIWEEKLY("Bi-weekly", 8, 14),
        MONTHLY("Monthly", 15, 30),
        QUARTERLY("Quarterly", 31, 90),
        RARELY("Rarely", 91, Integer.MAX_VALUE);

        private final String displayName;
        private final int minDays;
        private final int maxDays;

        PurchaseFrequency(String displayName, int minDays, int maxDays) {
            this.displayName = displayName;
            this.minDays = minDays;
            this.maxDays = maxDays;
        }

        public String getDisplayName() {
            return displayName;
        }

        public static PurchaseFrequency getByAverageDaysBetweenOrders(int avgDays) {
            for (PurchaseFrequency freq : values()) {
                if (avgDays >= freq.minDays && avgDays <= freq.maxDays) {
                    return freq;
                }
            }
            return RARELY;
        }
    }

    public enum ChurnRisk {
        VERY_LOW("Very Low Risk", 0, 20),
        LOW("Low Risk", 21, 40),
        MEDIUM("Medium Risk", 41, 60),
        HIGH("High Risk", 61, 80),
        VERY_HIGH("Very High Risk", 81, 100);

        private final String displayName;
        private final int minProbability;
        private final int maxProbability;

        ChurnRisk(String displayName, int minProbability, int maxProbability) {
            this.displayName = displayName;
            this.minProbability = minProbability;
            this.maxProbability = maxProbability;
        }

        public String getDisplayName() {
            return displayName;
        }

        public static ChurnRisk getByProbability(BigDecimal probability) {
            int prob = probability.intValue();
            for (ChurnRisk risk : values()) {
                if (prob >= risk.minProbability && prob <= risk.maxProbability) {
                    return risk;
                }
            }
            return VERY_LOW;
        }
    }

    // Helper methods
    public boolean isVipCustomer() {
        return segmentType == SegmentType.VIP_CUSTOMER || valueTier.ordinal() >= ValueTier.GOLD.ordinal();
    }

    public boolean isActiveCustomer() {
        return daysSinceLastPurchase != null && daysSinceLastPurchase <= 90;
    }

    public boolean isNewCustomer() {
        return segmentType == SegmentType.NEW_CUSTOMER;
    }

    public boolean isAtRisk() {
        return churnRisk.ordinal() >= ChurnRisk.HIGH.ordinal() || 
               segmentType == SegmentType.AT_RISK_CUSTOMER;
    }

    public int getOverallEngagementScore() {
        return (emailEngagementScore + smsEngagementScore + appEngagementScore) / 3;
    }

    public BigDecimal getCustomerHealthScore() {
        // Calculate based on multiple factors
        int score = 0;
        
        // Purchase behavior (40%)
        score += (orderSuccessRate.intValue() * 0.4);
        
        // Engagement (30%)
        score += (getOverallEngagementScore() * 0.3);
        
        // Frequency (20%)
        score += (isActiveCustomer() ? 20 : 0);
        
        // Value tier (10%)
        score += (valueTier.ordinal() * 2);
        
        return BigDecimal.valueOf(Math.min(100, score));
    }

    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }
} 